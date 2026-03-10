import Anthropic from 'npm:@anthropic-ai/sdk@0.27.3'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const POSITION_LABELS: Record<string, string> = {
  goalkeeper: 'Goalkeeper', cb: 'Center Back', lb: 'Left Back', rb: 'Right Back',
  lwb: 'Left Wing Back', rwb: 'Right Wing Back', cdm: 'Defensive Midfielder',
  cm: 'Central Midfielder', lm: 'Left Midfielder', rm: 'Right Midfielder',
  cam: 'Attacking Midfielder', lw: 'Left Winger', rw: 'Right Winger',
  cf: 'Center Forward', st: 'Striker',
}

const STYLE_LABELS: Record<string, string> = {
  shot_stopper: 'Shot Stopper', sweeper_keeper: 'Sweeper Keeper',
  ball_playing_keeper: 'Ball-Playing Keeper', commanding_aerial: 'Commanding Aerial Keeper',
  stopper: 'Stopper', ball_playing_cb: 'Ball-Playing Center Back',
  libero_sweeper: 'Libero / Sweeper', progressive_carrier: 'Progressive Carrier',
  attacking_fullback: 'Attacking Full-Back', inverted_fullback: 'Inverted Full-Back',
  traditional_overlapper: 'Traditional Overlapping Full-Back', defensive_fullback: 'Defensive Full-Back',
  width_provider: 'Width Provider', complete_wingback: 'Complete Wing-Back',
  inverted_wingback: 'Inverted Wing-Back', underlapping_wingback: 'Underlapping Wing-Back',
  ball_winner: 'Ball Winner', regista: 'Regista / Deep Playmaker',
  space_eater: 'Space Eater', press_trigger: 'Press Trigger',
  box_to_box: 'Box-to-Box Midfielder', mezzala: 'Mezzala',
  carrilero: 'Carrilero', roaming_playmaker: 'Roaming Playmaker',
  direct_dribbler: 'Direct Dribbler', wide_playmaker: 'Wide Playmaker',
  halfspace_runner: 'Half-Space Runner', pressing_wide_mid: 'High-Pressing Wide Mid',
  trequartista: 'Trequartista', enganche: 'Enganche', shadow_striker: 'Shadow Striker',
  advanced_playmaker: 'Classic #10', inverted_winger: 'Inverted Winger',
  inside_forward: 'Inside Forward', traditional_winger: 'Traditional Winger',
  pressing_wide_fwd: 'Pressing Wide Forward', false_9: 'False 9',
  deep_lying_forward: 'Deep-Lying Forward', second_striker: 'Second Striker',
  pressing_fwd: 'Press Leader', poacher: 'Poacher', target_man: 'Target Man',
  pressing_striker: 'Pressing Forward', speed_striker: 'Speed Striker',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Determine week number
    const { data: lastPlan } = await supabase
      .from('training_plans')
      .select('week_number')
      .eq('user_id', userId)
      .order('week_number', { ascending: false })
      .limit(1)
      .single()

    const weekNumber = lastPlan ? lastPlan.week_number + 1 : 1

    // Deactivate old plans
    await supabase
      .from('training_plans')
      .update({ is_active: false })
      .eq('user_id', userId)

    // Build and call Claude
    const prompt = buildPrompt(profile, weekNumber)

    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') })
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const rawText = response.content[0].type === 'text' ? response.content[0].text : '{}'

    let planData
    try {
      planData = JSON.parse(rawText)
    } catch {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      planData = jsonMatch ? JSON.parse(jsonMatch[0]) : { drills: [], nutrition_guidance: '', ai_notes: '', cardio_goal: '' }
    }

    // Insert new active plan
    const { data: newPlan, error: insertError } = await supabase
      .from('training_plans')
      .insert({
        user_id: userId,
        week_number: weekNumber,
        drills: planData.drills || [],
        nutrition_guidance: planData.nutrition_guidance || '',
        ai_notes: planData.ai_notes || '',
        cardio_goal: planData.cardio_goal || '',
        is_active: true,
        generated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return new Response(JSON.stringify({ error: 'Failed to save plan' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create trial subscription if none exists yet
    await supabase
      .from('subscriptions')
      .upsert(
        {
          user_id: userId,
          status: 'trial',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        { onConflict: 'user_id', ignoreDuplicates: true }
      )

    // Mark onboarding complete
    await supabase
      .from('profiles')
      .update({ onboarding_complete: true })
      .eq('id', userId)

    return new Response(JSON.stringify({ plan: newPlan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('generate-training-plan error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function buildPrompt(profile: Record<string, any>, weekNumber: number): string {
  const firstName = profile.first_name || 'Player'
  const position = POSITION_LABELS[profile.position] || profile.position || 'Midfielder'
  const style = STYLE_LABELS[profile.playing_style] || (profile.playing_style?.replace(/_/g, ' ') || 'balanced')
  const bodyType = profile.body_type?.replace(/_/g, ' ') || 'athletic'
  const skillLevel = profile.skill_level || 'intermediate'
  const age = profile.age || 16
  const trainingDays = profile.training_days_per_week || 4
  const sessionMinutes = profile.session_duration_minutes || 60
  const goals = Array.isArray(profile.goals) && profile.goals.length > 0
    ? profile.goals.join(' and ')
    : (profile.goals_text || 'improve overall performance')
  const injuryNote = profile.has_injuries
    ? 'Has existing injuries — avoid high-impact, jumping, or contact drills'
    : 'No injuries — full training intensity allowed'
  const equipment = Array.isArray(profile.equipment) && profile.equipment.length > 0
    ? profile.equipment.join(', ')
    : 'soccer ball, cones, open field'
  const wherePlays = profile.where_plays_specific || profile.where_plays_category || 'local field'
  const proPlayer = profile.pro_player_slug
    ? `Player inspiration / comparison: ${profile.pro_player_slug.replace(/-/g, ' ')}`
    : null
  const weekPhase = weekNumber === 1
    ? 'Week 1 — Foundation: build habits and assess baseline'
    : weekNumber <= 4
    ? `Week ${weekNumber} — Building Phase: increase intensity and volume`
    : `Week ${weekNumber} — Peak Phase: competition preparation and sharpness`

  return `You are Coach Alex, an elite AI soccer coach. Generate a personalized training plan for ${firstName}.

PLAYER PROFILE:
- Name: ${firstName}, Age: ${age}
- Position: ${position}
- Playing Style: ${style}
- Body Type: ${bodyType}
- Skill Level: ${skillLevel}
- Training Days Per Week: ${trainingDays}
- Session Length: ${sessionMinutes} minutes
- Goals: ${goals}
- Injuries: ${injuryNote}
- Equipment Available: ${equipment}
- Training Location: ${wherePlays}${proPlayer ? `\n- ${proPlayer}` : ''}
- Training Phase: ${weekPhase}

Return ONLY a raw JSON object — no markdown, no code blocks, no explanation. Use this exact structure:
{
  "drills": [
    {
      "day": 1,
      "name": "Drill Name",
      "category": "technical",
      "duration_minutes": 20,
      "description": "Step-by-step instructions in 2-3 sentences. Specific and actionable.",
      "coaching_cue": "The single most important focus point for this drill",
      "reps_sets": "e.g. 4 sets x 8 reps or 15 minutes continuous"
    }
  ],
  "cardio_goal": "One specific measurable cardio target for the week (e.g. '3x 20-min runs at 65-70% max HR')",
  "nutrition_guidance": "2-3 sentences specific to their position, body type, and this week's training load. Reference specific foods and timing.",
  "ai_notes": "A personal message from Coach Alex to ${firstName}. Reference their position (${position}), their playing style (${style}), and main goal. 2-3 sentences. Make it feel personal and motivating — not generic."
}

REQUIREMENTS:
- Exactly ${trainingDays} training days using day numbers 1-7 (skip rest days)
- Each training day: 3-5 drills totaling approximately ${sessionMinutes} minutes
- Drills must be specific to ${position} playing as a ${style} — not generic soccer drills
- Week structure: Day 1-2 technical/skill work, middle days fitness/intensity, final day match simulation
- Only use equipment listed: ${equipment}
- ${profile.has_injuries ? 'Modify all drills to avoid aggravating injuries' : 'Full intensity — no restrictions'}`
}
