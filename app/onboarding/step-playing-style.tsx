import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useOnboardingStore } from '../../stores/onboarding'
import { Position } from '../../types'

const TOTAL = 10
const STEP = 3

type StyleOption = { value: string; label: string; description: string }

const STYLES_BY_POSITION: Record<string, StyleOption[]> = {
  // Goalkeeper
  goalkeeper: [
    { value: 'shot_stopper', label: 'Shot Stopper', description: 'Reflexes, positioning, and shot-blocking — dominate the six-yard box and goal line' },
    { value: 'sweeper_keeper', label: 'Sweeper Keeper', description: 'Push out to intercept through balls, act as extra outfield player behind a high line (Neuer style)' },
    { value: 'ball_playing_keeper', label: 'Ball-Playing Keeper', description: 'Elite footwork and passing — initiate build-up play and switch flanks with distribution' },
    { value: 'commanding_aerial', label: 'Commanding Aerial Keeper', description: 'Physically dominant, rule your box through aerial presence and vocal defensive organization' },
  ],
  // Center Back
  cb: [
    { value: 'stopper', label: 'Stopper', description: 'Aggressive man-marker who wins aerial duels and makes decisive tackles to shut down attackers' },
    { value: 'ball_playing_cb', label: 'Ball-Playing Defender', description: 'Technically gifted — play line-breaking passes from deep to trigger attacks (Saliba / Ruben Dias style)' },
    { value: 'libero_sweeper', label: 'Libero / Sweeper', description: 'Read the game ahead of others — mop up second balls using intelligence over aggression (Beckenbauer mold)' },
    { value: 'progressive_carrier', label: 'Progressive Carrier', description: 'Carry the ball out under pressure, drive through midfield lines, create superiority before offloading' },
  ],
  // Left Back
  lb: [
    { value: 'attacking_fullback', label: 'Attacking Full-Back', description: 'Surge forward as a second winger — provide width, assist, and create in the final third (Robertson style)' },
    { value: 'inverted_fullback', label: 'Inverted Full-Back', description: 'Tuck into central midfield rather than overlapping — create superiority in the middle (Trent style)' },
    { value: 'traditional_overlapper', label: 'Traditional Overlapper', description: 'Defensive solidity first, timed overlapping runs second — cross from the byline and track back' },
    { value: 'defensive_fullback', label: 'Defensive Full-Back', description: 'Prioritize tracking wingers and compactness — disciplined and positionally reliable first' },
  ],
  // Right Back
  rb: [
    { value: 'attacking_fullback', label: 'Attacking Full-Back', description: 'Dominate the right flank going forward — cross, assist, and arrive in the box (Hakimi style)' },
    { value: 'inverted_fullback', label: 'Inverted Full-Back', description: 'Tuck inside to overload central midfield — dictate from narrow positions and create overloads' },
    { value: 'traditional_overlapper', label: 'Traditional Overlapper', description: 'Timed overlapping runs to deliver crosses — solid defensively with attacking contribution from wide' },
    { value: 'defensive_fullback', label: 'Defensive Full-Back', description: 'Disciplined positional defending — tough to beat, rarely out of position, defensive reliability' },
  ],
  // Left Wing Back
  lwb: [
    { value: 'width_provider', label: 'Width Provider', description: 'Hug the touchline and bomb forward constantly — deliver crosses and provide natural width in attack' },
    { value: 'complete_wingback', label: 'Complete Wing-Back', description: 'All-action player — contribute offensively in the final third while covering defensive duties in a back-five' },
    { value: 'inverted_wingback', label: 'Inverted Wing-Back', description: 'Shift inside to join midfield lines — overload the center and aid progression rather than going wide' },
    { value: 'underlapping_wingback', label: 'Underlapping Wing-Back', description: 'Make runs into the half-space behind wide forwards — combine centrally to create shooting lanes' },
  ],
  // Right Wing Back
  rwb: [
    { value: 'width_provider', label: 'Width Provider', description: 'Non-stop right flank bombing — constant overlapping runs, crosses, and attacking presence' },
    { value: 'complete_wingback', label: 'Complete Wing-Back', description: 'Dominate the right flank in both directions — attack with quality and defend with intensity' },
    { value: 'inverted_wingback', label: 'Inverted Wing-Back', description: 'Tuck inside to overload midfield — create central superiority rather than going wide' },
    { value: 'underlapping_wingback', label: 'Underlapping Wing-Back', description: 'Run into the half-space inside the wide forward — combine to create shooting angles and overloads' },
  ],
  // Defensive Mid
  cdm: [
    { value: 'ball_winner', label: 'Ball-Winner / Destroyer', description: 'Aggressive, dominant midfielder who wins possession through tackles and interceptions — shields the back four' },
    { value: 'regista', label: 'Regista (Deep Playmaker)', description: 'Drop between center-backs, dictate tempo, initiate attacks with precise line-breaking passes (Pirlo / Rodri style)' },
    { value: 'space_eater', label: 'Space-Eater / Shuttler', description: 'Elite engine — cover massive distances, win second balls, help in transitions both ways (Kanté style)' },
    { value: 'press_trigger', label: 'Press Trigger', description: 'Initiate the team\'s high press — block passing lanes and force turnovers in the opponent\'s half' },
  ],
  // Center Midfielder
  cm: [
    { value: 'box_to_box', label: 'Box-to-Box', description: 'Cover the full pitch — defend, press, carry, and arrive in the box to score or assist (Bellingham style)' },
    { value: 'mezzala', label: 'Mezzala', description: 'Drift into the half-space on the weak side — make third-man runs beyond the striker and arrive late into the box' },
    { value: 'carrilero', label: 'Carrilero (Lane Runner)', description: 'Disciplined up-and-down midfielder — shuttle your channel, cover the full-back, and recycle possession efficiently' },
    { value: 'roaming_playmaker', label: 'Roaming Playmaker', description: 'Creative freedom to drift across the pitch — pop up in unexpected areas, create overloads and distribute (Modrić style)' },
  ],
  // Left Midfielder
  lm: [
    { value: 'direct_dribbler', label: 'Direct Dribbler', description: 'Pace and 1v1 ability to beat the full-back and drive play forward — stretch defensive blocks through direct running' },
    { value: 'wide_playmaker', label: 'Wide Playmaker', description: 'Drop deeper to receive and distribute — switch play and feed forwards using vision from a wider position' },
    { value: 'halfspace_runner', label: 'Half-Space Runner', description: 'Operate in the channel between wide and central zones — diagonal runs in behind or exploit the gap between defenders' },
    { value: 'pressing_wide_mid', label: 'Pressing Machine', description: 'Work rate and defensive contribution are paramount — press-trap full-backs and create turnovers from wide' },
  ],
  // Right Midfielder
  rm: [
    { value: 'direct_dribbler', label: 'Direct Dribbler', description: 'Pace and skill to beat opponents wide right — stretch defensive blocks and drive play forward with direct running' },
    { value: 'wide_playmaker', label: 'Wide Playmaker', description: 'Drop to receive from wide right — switch play, deliver assists, and create through vision and technique' },
    { value: 'halfspace_runner', label: 'Half-Space Runner', description: 'Exploit the channel between the full-back and center-back — diagonal runs and late arrivals in the box' },
    { value: 'pressing_wide_mid', label: 'Pressing Machine', description: 'Non-stop energy from wide right — hunt the ball, trap opponents, and contribute defensively across every line' },
  ],
  // Attacking Midfielder
  cam: [
    { value: 'trequartista', label: 'Trequartista', description: 'Free-roaming creative force between the lines — drift to find space and create through dribbling, vision, and one-touch play' },
    { value: 'enganche', label: 'Enganche', description: 'The focal point through which all attacking play flows — stationary pivot who acts as the \'hook\' connecting midfield and attack' },
    { value: 'shadow_striker', label: 'Shadow Striker', description: 'Second striker in the hole behind the No.9 — arrive late into the box, exploit second balls, and score goals' },
    { value: 'advanced_playmaker', label: 'Classic #10 Creator', description: 'Drop into the half-space, receive, turn, and play through defensive lines with incisive passing — the definitive No.10' },
  ],
  // Left Wing
  lw: [
    { value: 'inverted_winger', label: 'Inverted Winger', description: 'Start wide on the left, cut inside on your stronger foot to shoot or play centrally (Salah / Robben style)' },
    { value: 'inside_forward', label: 'Inside Forward', description: 'Wide starting point, central mindset — diagonal runs in behind, combine centrally, and finish as a secondary goal threat' },
    { value: 'traditional_winger', label: 'Traditional Wide Winger', description: 'Hug the left touchline, beat the full-back in 1v1, and deliver dangerous crosses into the box' },
    { value: 'pressing_wide_fwd', label: 'Pressing Wide Forward', description: 'High energy and defensive contribution as important as attacking — press-trap defenders and trigger turnovers high up' },
  ],
  // Right Wing
  rw: [
    { value: 'inverted_winger', label: 'Inverted Winger', description: 'Start wide on the right, cut inside on your stronger foot — shoot, create, and combine centrally' },
    { value: 'inside_forward', label: 'Inside Forward', description: 'Wide starting point, central execution — diagonal runs in behind, finish from inside the box as a second striker' },
    { value: 'traditional_winger', label: 'Traditional Wide Winger', description: 'Hug the right touchline, attack the full-back 1v1, and deliver crosses into the box for strikers' },
    { value: 'pressing_wide_fwd', label: 'Pressing Wide Forward', description: 'Defensive contribution as important as attacking — press-trap from wide, force errors, and win the ball high' },
  ],
  // Center Forward
  cf: [
    { value: 'false_9', label: 'False 9', description: 'Drop deep into midfield to collect the ball — drag defenders out of position and create space for runners behind' },
    { value: 'deep_lying_forward', label: 'Deep-Lying Forward', description: 'Hold up play with back to goal — link midfield and attack, lay off to runners, and bring teammates into play' },
    { value: 'second_striker', label: 'Second Striker', description: 'Operate in the pocket between opposition midfield and defense — combine, arrive late, score, and assist' },
    { value: 'pressing_fwd', label: 'Press Leader', description: 'Set the press from the front — disrupt opposition build-up, coordinate with midfielders, and create turnovers high up' },
  ],
  // Striker
  st: [
    { value: 'poacher', label: 'Poacher / Fox in the Box', description: 'Instinctive penalty-area predator — elite positioning, timing, and clinical finishing from close range (Haaland style)' },
    { value: 'target_man', label: 'Target Man', description: 'Physically dominant aerial threat — win long balls, hold up play under pressure, and lay off to teammates' },
    { value: 'pressing_striker', label: 'Pressing Forward', description: 'Lead the press from the front with relentless aggression — disrupt build-up and create turnovers in dangerous areas (Firmino style)' },
    { value: 'speed_striker', label: 'Speed Striker', description: 'Explosive pace and runs in behind — exploit space on counter-attacks and race onto through balls (Mbappé style)' },
  ],
}

// Fallback for any position not in the map
const DEFAULT_STYLES: StyleOption[] = [
  { value: 'technical_dribbler', label: 'Technical & Creative', description: 'Skill, footwork, and creativity on the ball' },
  { value: 'physical_powerhouse', label: 'Physical & Powerful', description: 'Power, pace, and aggression to dominate' },
  { value: 'creative_passer', label: 'Vision & Passing', description: 'Unlock defenses with smart passing and reading of the game' },
  { value: 'pressing_machine', label: 'High Energy & Pressing', description: 'Work rate, hunting the ball, and relentless effort' },
]

const POSITION_LABELS: Record<string, string> = {
  goalkeeper: 'Goalkeeper', cb: 'Center Back', lb: 'Left Back', rb: 'Right Back',
  lwb: 'Left Wing Back', rwb: 'Right Wing Back', cdm: 'Defensive Mid', cm: 'Center Midfielder',
  lm: 'Left Midfielder', rm: 'Right Midfielder', cam: 'Attacking Midfielder',
  lw: 'Left Wing', rw: 'Right Wing', cf: 'Center Forward', st: 'Striker',
}

export default function StepPlayingStyleScreen() {
  const { playingStyle, setPlayingStyle, position } = useOnboardingStore()
  const router = useRouter()

  const styles = position ? (STYLES_BY_POSITION[position] || DEFAULT_STYLES) : DEFAULT_STYLES
  const posLabel = position ? (POSITION_LABELS[position] || position) : 'Soccer Player'

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <View className="flex-1 px-6 pt-4">
        {/* Progress */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={20} color="#64748B" />
          </TouchableOpacity>
          <View className="flex-1 h-1 bg-coach-border rounded-full mr-3">
            <View className="h-full bg-brand-blue rounded-full" style={{ width: `${(STEP / TOTAL) * 100}%` }} />
          </View>
          <Text className="text-slate-400 text-xs font-poppins">{STEP}/{TOTAL}</Text>
        </View>

        <View className="flex-row items-center gap-2 mb-2">
          <View className="w-2 h-2 bg-brand-blue rounded-full" />
          <Text className="text-brand-blue text-xs font-poppins-semibold uppercase tracking-wider">
            {posLabel} styles
          </Text>
        </View>

        <Text className="text-slate-900 text-3xl font-poppins-semibold mb-1">Your pitch identity</Text>
        <Text className="text-slate-500 text-sm font-poppins mb-6">
          How do you play as a {posLabel}?
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="gap-3 pb-4">
            {styles.map((style) => {
              const selected = playingStyle === style.value
              return (
                <TouchableOpacity
                  key={style.value}
                  onPress={() => setPlayingStyle(style.value)}
                  className={`rounded-2xl p-4 flex-row items-center border ${
                    selected ? 'border-brand-blue bg-brand-blue/5' : 'border-coach-border bg-coach-card'
                  }`}
                >
                  <View className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center flex-shrink-0 ${
                    selected ? 'border-brand-blue bg-brand-blue' : 'border-slate-300'
                  }`}>
                    {selected && <View className="w-2 h-2 bg-white rounded-full" />}
                  </View>
                  <View className="flex-1">
                    <Text className={`font-poppins-bold text-sm ${selected ? 'text-brand-blue' : 'text-slate-900'}`}>
                      {style.label}
                    </Text>
                    <Text className={`text-xs mt-0.5 font-poppins leading-4 ${selected ? 'text-blue-500' : 'text-slate-500'}`}>
                      {style.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>

        <TouchableOpacity
          onPress={() => playingStyle && router.push('/onboarding/step-body-type')}
          disabled={!playingStyle}
          className={`rounded-2xl py-4 items-center flex-row justify-center gap-2 mb-4 ${
            playingStyle ? 'bg-brand-blue' : 'bg-slate-100 border border-slate-200'
          }`}
        >
          <Text className={`font-poppins-bold text-base ${playingStyle ? 'text-white' : 'text-slate-400'}`}>
            Continue
          </Text>
          {playingStyle && <Ionicons name="arrow-forward" size={18} color="white" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
