import Anthropic from 'npm:@anthropic-ai/sdk@0.27.3'
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
    const { message, userId } = await req.json()

    if (!message || !userId) {
      return new Response(JSON.stringify({ error: 'Missing message or userId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Fetch user profile for context
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    // Fetch last 20 chat messages for conversation history
    const { data: history } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(20)

    // Fetch active training plan summary
    const { data: plan } = await supabase
      .from('training_plans')
      .select('ai_notes, week_number')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    // Build system prompt
    const systemPrompt = `You are Coach Alex, an elite AI soccer coach with 20+ years of experience coaching youth and young adult players. You are motivating, knowledgeable, and speak directly like a real coach — not like a chatbot.

Player Profile:
- Position: ${profile?.position || 'Unknown'}
- Skill Level: ${profile?.skill_level || 'Unknown'}
- Body Type: ${profile?.body_type || 'Unknown'}
- Age: ${profile?.age || 'Unknown'}
- Training Days/Week: ${profile?.training_days_per_week || 3}
- Goals: ${(profile?.goals || []).join(', ') || 'Improve overall game'}
${plan ? `- Current Week: Week ${plan.week_number} of training` : ''}
${plan?.ai_notes ? `- Plan Notes: ${plan.ai_notes}` : ''}

Guidelines:
- Give specific, actionable coaching advice tailored to their position and skill level
- Be encouraging but honest — do not sugarcoat weaknesses
- Use soccer terminology naturally (press triggers, defensive shape, combination play, etc.)
- Keep responses concise (2-4 paragraphs max) unless explaining a complex drill
- If they ask about nutrition, give position-appropriate advice
- If they report an injury or pain, recommend rest and consulting a doctor — never diagnose
- Reference their goals and current training when relevant
- Sign off messages with "- Coach Alex" when appropriate`

    // Build messages array for Claude
    const messages = [
      ...(history || []).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: message },
    ]

    // Call Claude API
    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') })
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    })

    const assistantMessage = response.content[0].type === 'text' ? response.content[0].text : ''

    // Save both messages to DB
    await supabase.from('chat_messages').insert([
      { user_id: userId, role: 'user', content: message },
      { user_id: userId, role: 'assistant', content: assistantMessage },
    ])

    return new Response(JSON.stringify({ message: assistantMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('ai-coach error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
