import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const event = body.event

    if (!event) {
      return new Response(JSON.stringify({ error: 'No event in payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const rcUserId = event.app_user_id
    const eventType = event.type

    // Map RevenueCat event types to subscription status
    const statusMap: Record<string, string> = {
      INITIAL_PURCHASE: 'active',
      RENEWAL: 'active',
      PRODUCT_CHANGE: 'active',
      CANCELLATION: 'cancelled',
      EXPIRATION: 'expired',
      BILLING_ISSUE: 'expired',
      SUBSCRIPTION_PAUSED: 'expired',
      TRIAL_STARTED: 'trial',
      TRIAL_CONVERTED: 'active',
      TRIAL_CANCELLED: 'cancelled',
      TRANSFER: 'active',
    }

    const newStatus = statusMap[eventType]
    if (!newStatus) {
      // Unknown event type — acknowledge but do nothing
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Find user by RevenueCat user ID (which we set to their Supabase user ID)
    const expiresAt = event.expiration_at_ms
      ? new Date(event.expiration_at_ms).toISOString()
      : null

    const tier = event.product_id?.includes('annual') ? 'annual' : 'monthly'

    // Upsert subscription record
    await supabase
      .from('subscriptions')
      .upsert(
        {
          user_id: rcUserId,
          revenuecat_user_id: rcUserId,
          status: newStatus,
          tier,
          expires_at: expiresAt,
        },
        { onConflict: 'user_id' }
      )

    console.log(`Updated subscription for user ${rcUserId}: ${newStatus}`)

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('revenuecat-webhook error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
