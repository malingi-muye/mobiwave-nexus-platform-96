
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

    console.log('Mspace accounts operation:', operation)

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
      console.error('Authentication failed:', authError)
      throw new Error('Invalid authorization')
    }

    console.log('User authenticated:', user.id)

    // Get API credentials
    const { data: credentials, error: credError } = await supabase
      .from('api_credentials')
      .select('*')
      .eq('user_id', user.id)
      .eq('service_name', 'mspace')
      .eq('is_active', true)
      .single()

    if (credError || !credentials) {
      console.error('Credentials error:', credError)
      throw new Error('Mspace API credentials not configured. Please configure them in Settings.')
    }

    const config = credentials.additional_config as any
    const apiKey = config?.api_key || Deno.env.get('MSPACE_API_KEY')
    const mspaceUsername = config?.username

    if (!apiKey || !mspaceUsername) {
      throw new Error('Incomplete Mspace API credentials. API key and username are required.')
    }

    console.log('Processing operation:', operation, 'for user:', mspaceUsername)

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
          throw new Error('Client name and SMS quantity required for top-up');
        }
        endpoint = 'https://api.mspace.co.ke/smsapi/v2/subacctopup';
        payload = {
          username: mspaceUsername,
          subaccname: clientname, // Use 'subaccname' as per API docs
          noOfSms
        };
        break;
      case 'topUpResellerClient':
        if (!clientname || !noOfSms) {
          throw new Error('Client name and SMS quantity required for top-up');
        }
        endpoint = 'https://api.mspace.co.ke/smsapi/v2/resellerclienttopup';
        payload = {
          username: mspaceUsername,
          clientname,
          noOfSms
        };
        break;
      default:
        throw new Error(`Invalid operation: ${operation}`);
    }

    // Try POST method first (more reliable according to docs)
    let responseData;
    try {
      const postResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'apikey': apiKey
        },
        body: JSON.stringify(payload)
      });

      if (postResponse.ok) {
        const responseText = await postResponse.text();
        console.log('POST response:', responseText);
        
        try {
          responseData = JSON.parse(responseText);
        } catch {
          // If not JSON, treat as plain text response
          responseData = { message: responseText, status: 'success' };
        }
      } else {
        throw new Error(`POST request failed: ${postResponse.status} ${postResponse.statusText}`);
      }
    } catch (postError) {
      console.log('POST method failed, trying GET method for query operations:', postError);
      
      // Fallback to GET method for query operations only
      if (operation === 'subAccounts' || operation === 'resellerClients') {
        const getUrl = `${endpoint}/apikey=${apiKey}/username=${mspaceUsername}`;
        const getResponse = await fetch(getUrl);

        if (!getResponse.ok) {
          throw new Error(`Both POST and GET requests failed. Last error: ${getResponse.status} ${getResponse.statusText}`);
        }

        const responseText = await getResponse.text();
        console.log('GET response:', responseText);
        
        try {
          responseData = JSON.parse(responseText);
        } catch {
          responseData = { message: responseText, status: 'success' };
        }
      } else if (operation === 'topUpSubAccount') {
        // Try GET method for sub-account top-up with correct parameter format
        const getUrl = `${endpoint}/apikey=${apiKey}/username=${mspaceUsername}/subaccname=${clientname}/noofsms=${noOfSms}`;
        const getResponse = await fetch(getUrl);

        if (!getResponse.ok) {
          throw new Error(`Both POST and GET requests failed. Last error: ${getResponse.status} ${getResponse.statusText}`);
        }

        const responseText = await getResponse.text();
        console.log('GET response:', responseText);
        
        try {
          responseData = JSON.parse(responseText);
        } catch {
          responseData = { message: responseText, status: 'success' };
        }
      } else if (operation === 'topUpResellerClient') {
        // Try GET method for reseller client top-up with correct parameter format
        const getUrl = `${endpoint}/apikey=${apiKey}/username=${mspaceUsername}/clientname=${clientname}/noofsms=${noOfSms}`;
        const getResponse = await fetch(getUrl);

        if (!getResponse.ok) {
          throw new Error(`Both POST and GET requests failed. Last error: ${getResponse.status} ${getResponse.statusText}`);
        }

        const responseText = await getResponse.text();
        console.log('GET response:', responseText);
        
        try {
          responseData = JSON.parse(responseText);
        } catch {
          responseData = { message: responseText, status: 'success' };
        }
      } else {
        throw postError;
      }
    }

    console.log('Final response data:', responseData);
    return new Response(JSON.stringify(responseData), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in mspace-accounts function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
