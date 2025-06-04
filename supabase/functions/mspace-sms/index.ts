
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SMSRequest {
  username: string;
  senderId: string;
  recipient: string;
  message: string;
  campaignId?: string;
}

interface MspaceResponse {
  messageId?: string;
  status?: string;
  message?: string;
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { username, senderId, recipient, message, campaignId } = await req.json() as SMSRequest
    
    // Get API key from request headers
    const apiKey = req.headers.get('x-api-key')
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Sending SMS via Mspace API:', { username, senderId, recipient: recipient.substring(0, 5) + '...' })

    // Send SMS via Mspace API
    const mspaceResponse = await fetch('https://api.mspace.co.ke/smsapi/v2/sendtext', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        username,
        senderId,
        recipient,
        message
      })
    })

    const responseData = await mspaceResponse.json() as MspaceResponse
    console.log('Mspace API response:', responseData)

    // Get user ID from JWT token
    const authHeader = req.headers.get('Authorization')
    let userId = null
    
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
      userId = user?.id
    }

    const isSuccess = mspaceResponse.ok && (responseData.messageId || responseData.status === 'success')
    const messageStatus = isSuccess ? 'sent' : 'failed'

    // Store message in database if we have user ID
    if (userId) {
      const messageRecord = {
        user_id: userId,
        campaign_id: campaignId || null,
        type: 'sms',
        sender: senderId,
        recipient: recipient,
        content: message,
        status: messageStatus,
        provider: 'mspace',
        provider_message_id: responseData.messageId || null,
        cost: 0.05, // Default cost per SMS
        sent_at: isSuccess ? new Date().toISOString() : null,
        failed_at: isSuccess ? null : new Date().toISOString(),
        error_message: isSuccess ? null : responseData.error || responseData.message || 'Failed to send SMS',
        metadata: { mspace_response: responseData }
      }

      const { error: dbError } = await supabase
        .from('message_history')
        .insert(messageRecord)

      if (dbError) {
        console.error('Error storing message in database:', dbError)
      }

      // Update campaign recipient status if campaignId is provided
      if (campaignId) {
        const { error: recipientError } = await supabase
          .from('campaign_recipients')
          .update({
            status: messageStatus,
            provider_message_id: responseData.messageId || null,
            cost: 0.05,
            sent_at: isSuccess ? new Date().toISOString() : null,
            failed_at: isSuccess ? null : new Date().toISOString(),
            error_message: isSuccess ? null : responseData.error || responseData.message || 'Failed to send SMS'
          })
          .eq('campaign_id', campaignId)
          .eq('recipient_value', recipient)

        if (recipientError) {
          console.error('Error updating campaign recipient:', recipientError)
        }
      }

      // Update user credits
      if (isSuccess) {
        const { error: creditError } = await supabase.rpc('deduct_credits', {
          user_id: userId,
          amount: 0.05
        })

        if (creditError) {
          console.error('Error deducting credits:', creditError)
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: isSuccess,
        messageId: responseData.messageId,
        status: messageStatus,
        message: responseData.message || (isSuccess ? 'SMS sent successfully' : 'Failed to send SMS'),
        error: responseData.error
      }),
      { 
        status: isSuccess ? 200 : 400,
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
