
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messageId } = await req.json()
    if (!messageId) {
      throw new Error('Message ID is required')
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authorization required')
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    
    if (authError || !user) {
      throw new Error('Invalid authorization')
    }

    // Get API credentials
    const { data: credentials, error: credError } = await supabase
      .from('api_credentials')
      .select('*')
      .eq('user_id', user.id)
      .eq('service_name', 'mspace')
      .eq('is_active', true)
      .single()

    if (credError || !credentials) {
      throw new Error('Mspace API credentials not configured')
    }

    const config = credentials.additional_config as any
    const apiKey = config?.api_key || Deno.env.get('MSPACE_API_KEY')
    const username = config?.username

    if (!apiKey || !username) {
      throw new Error('Incomplete Mspace API credentials')
    }

    // Get delivery report from Mspace API
    const response = await fetch('https://api.mspace.co.ke/smsapi/v2/deliveryreport', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        username,
        messageId
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to get delivery report: ${response.statusText}`)
    }

    const reportData = await response.json()
    console.log('Delivery report response:', reportData)

    return new Response(JSON.stringify(reportData), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in mspace-delivery function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
