
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

    const { action, data } = await req.json()

    switch (action) {
      case 'log_event':
        const { user_id, event_type, service_type, metadata, revenue } = data

        const { data: event, error } = await supabase
          .from('analytics_events')
          .insert({
            user_id,
            event_type,
            service_type,
            metadata: metadata || {},
            revenue: revenue || 0
          })
          .select()
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ success: true, event }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'get_user_analytics':
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('id, role, user_type, created_at')

        if (usersError) throw usersError

        const analytics = {
          totalUsers: users?.length || 0,
          usersByRole: users?.reduce((acc: any, user: any) => {
            acc[user.role] = (acc[user.role] || 0) + 1
            return acc
          }, {}),
          usersByType: users?.reduce((acc: any, user: any) => {
            const type = user.user_type || 'demo'
            acc[type] = (acc[type] || 0) + 1
            return acc
          }, {})
        }

        return new Response(
          JSON.stringify({ success: true, analytics }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'get_service_analytics':
        const { data: subscriptions, error: subsError } = await supabase
          .from('user_service_subscriptions')
          .select(`
            *,
            service:services_catalog(*)
          `)

        if (subsError) throw subsError

        const serviceAnalytics = {
          totalSubscriptions: subscriptions?.length || 0,
          activeSubscriptions: subscriptions?.filter((sub: any) => sub.status === 'active').length || 0,
          subscriptionsByService: subscriptions?.reduce((acc: any, sub: any) => {
            const serviceName = sub.service?.service_name || 'Unknown'
            acc[serviceName] = (acc[serviceName] || 0) + 1
            return acc
          }, {}),
          subscriptionsByStatus: subscriptions?.reduce((acc: any, sub: any) => {
            acc[sub.status] = (acc[sub.status] || 0) + 1
            return acc
          }, {})
        }

        return new Response(
          JSON.stringify({ success: true, analytics: serviceAnalytics }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Analytics processor error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
