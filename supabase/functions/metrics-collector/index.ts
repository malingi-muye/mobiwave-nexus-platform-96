
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Get real-time system metrics
    const [
      { data: campaigns },
      { data: users },
      { data: services },
      { data: subscriptions }
    ] = await Promise.all([
      supabase.from('campaigns').select('status, sent_count, delivered_count, failed_count'),
      supabase.from('profiles').select('id, created_at'),
      supabase.from('services_catalog').select('id, is_active'),
      supabase.from('user_service_subscriptions').select('status')
    ])

    const metrics = {
      campaigns: {
        total: campaigns?.length || 0,
        active: campaigns?.filter(c => c.status === 'sending').length || 0,
        completed: campaigns?.filter(c => c.status === 'sent').length || 0,
        totalSent: campaigns?.reduce((sum, c) => sum + (c.sent_count || 0), 0) || 0,
        totalDelivered: campaigns?.reduce((sum, c) => sum + (c.delivered_count || 0), 0) || 0
      },
      users: {
        total: users?.length || 0,
        newToday: users?.filter(u => {
          const today = new Date().toDateString()
          return new Date(u.created_at).toDateString() === today
        }).length || 0
      },
      services: {
        total: services?.length || 0,
        active: services?.filter(s => s.is_active).length || 0
      },
      subscriptions: {
        total: subscriptions?.length || 0,
        active: subscriptions?.filter(s => s.status === 'active').length || 0,
        pending: subscriptions?.filter(s => s.status === 'pending').length || 0
      },
      timestamp: new Date().toISOString()
    }

    return new Response(
      JSON.stringify({ success: true, metrics }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Metrics collector error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
