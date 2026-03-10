import Anthropic from 'npm:@anthropic-ai/sdk@0.27.3'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PushMessage {
  to: string
  title: string
  body: string
  data?: Record<string, string>
}

async function sendPushNotifications(messages: PushMessage[]) {
  if (messages.length === 0) return

  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate',
    },
    body: JSON.stringify(messages),
  })

  const result = await response.json()
  console.log('Push result:', JSON.stringify(result))
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Fetch all active users with push tokens
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, push_token, position, skill_level, goals, training_days_per_week')
      .not('push_token', 'is', null)

    if (error || !users || users.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') })

    // Get day of week for context
    const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' })

    // Generate a batch of personalized notifications
    // For efficiency, generate one per position/skill combo and reuse
    const messages: PushMessage[] = []

    for (const user of users) {
      if (!user.push_token) continue

      try {
        const prompt = `Generate a short, motivating soccer coach push notification for a ${user.skill_level || 'intermediate'} ${user.position || 'midfielder'} on a ${dayOfWeek}. 

Goals: ${(user.goals || []).join(', ') || 'improve overall game'}

Rules:
- Title: 5 words max, energetic, coach-voice
- Body: 1-2 sentences max, specific to their position or goals
- Sound like Coach Alex — direct, motivating, real
- Do NOT use generic phrases like "Keep going!" or "You got this!"
- Vary the focus: technique, mental game, nutrition, recovery, or game tactics

Return JSON only: {"title": "...", "body": "..."}`

        const response = await anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 150,
          messages: [{ role: 'user', content: prompt }],
        })

        const raw = response.content[0].type === 'text' ? response.content[0].text : '{}'
        const parsed = JSON.parse(raw)

        messages.push({
          to: user.push_token,
          title: parsed.title || 'Time to Train',
          body: parsed.body || 'Your next session is ready. Let\'s go.',
          data: { screen: 'session' },
        })
      } catch (e) {
        console.error(`Failed to generate notification for user ${user.id}:`, e)
        // Fallback notification
        messages.push({
          to: user.push_token,
          title: 'Training Time',
          body: 'Your daily session is ready. Coach Alex is waiting.',
          data: { screen: 'session' },
        })
      }
    }

    // Send in batches of 100 (Expo limit)
    const batchSize = 100
    for (let i = 0; i < messages.length; i += batchSize) {
      await sendPushNotifications(messages.slice(i, i + batchSize))
    }

    return new Response(JSON.stringify({ sent: messages.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('send-notifications error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
