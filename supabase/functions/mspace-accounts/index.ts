
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { authenticateUser, getApiCredentials } from './auth.ts'
import { makeApiRequest } from './api-client.ts'

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
    const { supabase, user } = await authenticateUser(authHeader!)
    const { apiKey, mspaceUsername } = await getApiCredentials(supabase, user.id)

    const responseData = await makeApiRequest({
      operation,
      username: mspaceUsername,
      apiKey,
      clientname,
      noOfSms
    })

    console.log('Final response data:', responseData)
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
