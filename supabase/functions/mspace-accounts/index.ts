
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AccountOperation {
  operation: string;
  username?: string;
  clientname?: string;
  noOfSms?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { operation, username, clientname, noOfSms } = await req.json() as AccountOperation
    
    if (!operation) {
      throw new Error('Operation type is required')
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
    const mspaceUsername = config?.username

    if (!apiKey || !mspaceUsername) {
      throw new Error('Incomplete Mspace API credentials')
    }

    let endpoint = '';
    let payload: any = { username: mspaceUsername };
    
    // Set up endpoint and payload based on operation
    switch(operation) {
      case 'subAccounts':
        endpoint = 'https://api.mspace.co.ke/smsapi/v2/subusers';
        break;
      case 'resellerClients':
        endpoint = 'https://api.mspace.co.ke/smsapi/v2/resellerclients';
        break;
      case 'topUpSubAccount':
        if (!clientname || !noOfSms) {
          throw new Error('Client name and SMS quantity required');
        }
        endpoint = 'https://api.mspace.co.ke/smsapi/v2/subacctopup';
        payload = {
          username: mspaceUsername,
          clientname,
          noOfSms
        };
        break;
      case 'topUpResellerClient':
        if (!clientname || !noOfSms) {
          throw new Error('Client name and SMS quantity required');
        }
        endpoint = 'https://api.mspace.co.ke/smsapi/v2/resellerclienttopup';
        payload = {
          username: mspaceUsername,
          clientname,
          noOfSms
        };
        break;
      default:
        throw new Error('Invalid operation');
    }

    // Call Mspace API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Mspace API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Mspace accounts operation response:', data);

    return new Response(JSON.stringify(data), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in mspace-accounts function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
