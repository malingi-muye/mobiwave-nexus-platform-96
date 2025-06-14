
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SMSRequest } from './types.ts'
import { getApiCredentials } from './credentials.ts'
import { sendSMSToRecipient } from './sms-sender.ts'
import { storeMessageResult, deductCredits } from './database.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { recipients, message, senderId, campaignId } = await req.json() as SMSRequest
    const authHeader = req.headers.get('Authorization')
    
    const { user, apiKey, username, defaultSenderId } = await getApiCredentials(authHeader!)
    const actualSenderId = senderId || defaultSenderId

    console.log('Sending SMS to', recipients.length, 'recipients via Mspace API')

    const results = []
    let totalCost = 0

    for (const recipient of recipients) {
      const result = await sendSMSToRecipient(recipient, message, apiKey, username, actualSenderId)
      results.push(result)

      const cost = await storeMessageResult(result, user.id, campaignId, actualSenderId, message, result)
      totalCost += cost
    }

    await deductCredits(user.id, totalCost)

    const successCount = results.filter(r => r.success).length
    const failCount = results.length - successCount

    return new Response(
      JSON.stringify({
        success: successCount > 0,
        results,
        summary: {
          total: results.length,
          successful: successCount,
          failed: failCount,
          totalCost
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in mspace-sms function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
