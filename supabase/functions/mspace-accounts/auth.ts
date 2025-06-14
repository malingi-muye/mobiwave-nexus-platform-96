
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export async function authenticateUser(authHeader: string) {
  if (!authHeader) {
    throw new Error('Authorization required')
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  )
  
  if (authError || !user) {
    console.error('Authentication failed:', authError)
    throw new Error('Invalid authorization')
  }

  console.log('User authenticated:', user.id)
  return { supabase, user }
}

export async function getApiCredentials(supabase: any, userId: string) {
  const { data: credentials, error: credError } = await supabase
    .from('api_credentials')
    .select('*')
    .eq('user_id', userId)
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

  return { apiKey, mspaceUsername }
}
