
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SMSRequest {
  recipients: string[];
  message: string;
  senderId?: string;
  campaignId?: string;
}

interface MspaceMessage {
  messageId: string;
  recipient: string;
  status: number;
  statusDescription: string;
}

interface MspaceResponse {
  message: MspaceMessage[];
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

    const { recipients, message, senderId, campaignId } = await req.json() as SMSRequest
    
    // Get API credentials from the user's stored credentials
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get user's API credentials
    const { data: credentials, error: credError } = await supabase
      .from('api_credentials')
      .select('*')
      .eq('user_id', user.id)
      .eq('service_name', 'mspace')
      .eq('is_active', true)
      .single()

    if (credError || !credentials) {
      return new Response(
        JSON.stringify({ error: 'Mspace API credentials not configured. Please configure them in Settings.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Extract credentials from additional_config
    const config = credentials.additional_config as any
    const apiKey = config?.api_key || Deno.env.get('MSPACE_API_KEY')
    const username = config?.username
    const defaultSenderId = config?.sender_id || senderId || 'MOBIWAVE'

    if (!apiKey || !username) {
      return new Response(
        JSON.stringify({ error: 'Incomplete Mspace API credentials. Please check your settings.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Sending SMS to', recipients.length, 'recipients via Mspace API')

    const results = []
    let totalCost = 0

    // Send SMS to each recipient
    for (const recipient of recipients) {
      try {
        console.log('Sending SMS to:', recipient.substring(0, 5) + '...')

        const mspaceResponse = await fetch('https://api.mspace.co.ke/smsapi/v2/sendtext', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'apikey': apiKey
          },
          body: JSON.stringify({
            username,
            senderId: defaultSenderId,
            recipient: recipient.replace(/\D/g, ''), // Clean phone number
            message
          })
        })

        const responseData = await mspaceResponse.json() as MspaceResponse
        console.log('Mspace API response for', recipient + ':', responseData)

        // Handle the documented response structure
        let isSuccess = false
        let messageId = null
        let errorMessage = null

        if (mspaceResponse.ok && responseData.message && Array.isArray(responseData.message)) {
          // Check if any message in the response has success status (111)
          const messageData = responseData.message.find(msg => msg.recipient === recipient.replace(/\D/g, ''))
          if (messageData) {
            isSuccess = messageData.status === 111
            messageId = messageData.messageId
            errorMessage = isSuccess ? null : messageData.statusDescription
          }
        } else {
          errorMessage = 'Invalid response format from Mspace API'
        }

        const cost = 0.05 // Cost per SMS

        if (isSuccess) {
          totalCost += cost
        }

        // Store message in database
        const messageRecord = {
          user_id: user.id,
          campaign_id: campaignId || null,
          type: 'sms',
          sender: defaultSenderId,
          recipient: recipient.replace(/\D/g, ''),
          content: message,
          status: isSuccess ? 'sent' : 'failed',
          provider: 'mspace',
          provider_message_id: messageId,
          cost: isSuccess ? cost : 0,
          sent_at: isSuccess ? new Date().toISOString() : null,
          failed_at: isSuccess ? null : new Date().toISOString(),
          error_message: errorMessage,
          metadata: { mspace_response: responseData }
        }

        // Try to store in message_history table if it exists
        try {
          const { error: dbError } = await supabase
            .from('message_history')
            .insert(messageRecord)

          if (dbError) {
            console.error('Error storing message in database:', dbError)
          }
        } catch (err) {
          // If message_history table doesn't exist, store in campaigns metadata
          if (campaignId) {
            const { data: campaign } = await supabase
              .from('campaigns')
              .select('metadata')
              .eq('id', campaignId)
              .single()

            const existingMetadata = campaign?.metadata as any || {}
            const messages = existingMetadata.messages || []
            messages.push(messageRecord)

            await supabase
              .from('campaigns')
              .update({ 
                metadata: { ...existingMetadata, messages }
              })
              .eq('id', campaignId)
          }
        }

        results.push({
          recipient,
          success: isSuccess,
          messageId,
          message: isSuccess ? 'Message sent successfully' : errorMessage,
          error: isSuccess ? null : errorMessage
        })

      } catch (error) {
        console.error('Error sending SMS to', recipient + ':', error)
        results.push({
          recipient,
          success: false,
          error: error.message
        })
      }
    }

    // Deduct credits if any messages were successful
    if (totalCost > 0) {
      try {
        const { error: creditError } = await supabase.rpc('deduct_credits', {
          user_id: user.id,
          amount: totalCost
        })

        if (creditError) {
          console.error('Error deducting credits:', creditError)
        }
      } catch (err) {
        console.error('Credits deduction failed:', err)
      }
    }

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
