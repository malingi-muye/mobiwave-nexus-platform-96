
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SMSRequest {
  recipients: string[]
  message: string
  sender_id?: string
  campaign_id?: string
}

interface MspaceResponse {
  success: boolean
  message: string
  data?: any
  error?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const mspaceApiKey = Deno.env.get('MSPACE_API_KEY')
    if (!mspaceApiKey) {
      throw new Error('MSPACE_API_KEY not configured')
    }

    const { action, ...data } = await req.json()

    switch (action) {
      case 'send_sms':
        return await sendSMS(data as SMSRequest, mspaceApiKey, supabase)
      case 'check_balance':
        return await checkBalance(mspaceApiKey)
      case 'get_delivery_reports':
        return await getDeliveryReports(data.message_ids, mspaceApiKey, supabase)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Mspace API error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function sendSMS(request: SMSRequest, apiKey: string, supabase: any): Promise<Response> {
  const { recipients, message, sender_id = 'MOBIWAVE', campaign_id } = request

  // Calculate cost (assuming $0.05 per SMS)
  const smsCount = Math.ceil(message.length / 160)
  const totalCost = recipients.length * smsCount * 0.05

  // Get user from auth header
  const authHeader = Deno.env.get('AUTHORIZATION')
  const { data: { user } } = await supabase.auth.getUser(authHeader?.replace('Bearer ', ''))
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Check user credits
  const { data: credits } = await supabase
    .from('user_credits')
    .select('credits_remaining')
    .eq('user_id', user.id)
    .single()

  if (!credits || credits.credits_remaining < totalCost) {
    throw new Error('Insufficient credits')
  }

  const results = []
  
  for (const recipient of recipients) {
    try {
      // Send SMS via Mspace API
      const response = await fetch('https://api.mspace.co.ke/v1/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          to: recipient,
          message: message,
          sender_id: sender_id
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // Store message in history
        await supabase
          .from('message_history')
          .insert({
            type: 'sms',
            sender: sender_id,
            recipient: recipient,
            content: message,
            status: 'sent',
            provider: 'mspace',
            provider_message_id: result.data?.message_id,
            sent_at: new Date().toISOString()
          })

        // Update campaign recipient if campaign_id provided
        if (campaign_id) {
          await supabase
            .from('campaign_recipients')
            .upsert({
              campaign_id,
              recipient_type: 'phone',
              recipient_value: recipient,
              status: 'sent',
              sent_at: new Date().toISOString()
            })
        }

        results.push({ recipient, success: true, message_id: result.data?.message_id })
      } else {
        results.push({ recipient, success: false, error: result.message })
      }
    } catch (error) {
      console.error(`SMS send error for ${recipient}:`, error)
      results.push({ recipient, success: false, error: error.message })
    }
  }

  // Deduct credits for successful sends
  const successCount = results.filter(r => r.success).length
  const actualCost = successCount * smsCount * 0.05

  if (actualCost > 0) {
    await supabase
      .from('user_credits')
      .update({
        credits_remaining: credits.credits_remaining - actualCost,
        credits_used: supabase.raw(`credits_used + ${actualCost}`)
      })
      .eq('user_id', user.id)
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      results,
      cost: actualCost,
      sent_count: successCount
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function checkBalance(apiKey: string): Promise<Response> {
  const response = await fetch('https://api.mspace.co.ke/v1/account/balance', {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  })

  const result = await response.json()
  
  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getDeliveryReports(messageIds: string[], apiKey: string, supabase: any): Promise<Response> {
  const reports = []
  
  for (const messageId of messageIds) {
    try {
      const response = await fetch(`https://api.mspace.co.ke/v1/sms/delivery-reports/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      })

      const result = await response.json()
      
      if (result.success) {
        // Update message status in database
        await supabase
          .from('message_history')
          .update({
            status: result.data.status,
            delivered_at: result.data.status === 'delivered' ? new Date().toISOString() : null,
            failed_at: result.data.status === 'failed' ? new Date().toISOString() : null
          })
          .eq('provider_message_id', messageId)

        // Update campaign recipient status
        await supabase
          .from('campaign_recipients')
          .update({
            status: result.data.status,
            delivered_at: result.data.status === 'delivered' ? new Date().toISOString() : null,
            failed_at: result.data.status === 'failed' ? new Date().toISOString() : null
          })
          .eq('provider_message_id', messageId)

        reports.push(result.data)
      }
    } catch (error) {
      console.error(`Delivery report error for ${messageId}:`, error)
    }
  }

  return new Response(
    JSON.stringify({ success: true, reports }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
