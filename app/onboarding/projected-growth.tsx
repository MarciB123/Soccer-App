import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useOnboardingStore } from '../../stores/onboarding'

const WITH_AI =    [30, 45, 58, 72, 85, 95]
const WITHOUT_AI = [15, 18, 20, 22, 24, 25]
const MONTHS = ['Mo 1', 'Mo 2', 'Mo 3', 'Mo 4', 'Mo 5', 'Mo 6']

const MONTH_EXPLANATIONS = [
  { month: 'Month 1–2', icon: 'scan-outline', iconColor: '#2563EB', iconBg: '#EFF6FF', title: 'AI learns your game', body: 'Your plan is built around your exact position and playing style. Generic training has no idea who you are — Soccer AI does.' },
  { month: 'Month 3–4', icon: 'trending-up', iconColor: '#16A34A', iconBg: '#F0FDF4', title: 'Compound gains kick in', body: 'Every session builds on the last. AI tracks what worked and adjusts. Random YouTube drills reset your progress every time.' },
  { month: 'Month 5–6', icon: 'trophy', iconColor: '#D97706', iconBg: '#FFFBEB', title: 'Others plateau. You don\'t.', body: 'Most players hit a wall here because their training doesn\'t adapt. Soccer AI keeps evolving your plan as you improve.' },
]

function BarGroup({ withAI, withoutAI, label }: { withAI: number; withoutAI: number; label: string }) {
  return (
    <View className="items-center flex-1">
      <View className="flex-row items-end gap-1" style={{ height: 100 }}>
        <View className="bg-brand-blue rounded-t-sm w-5" style={{ height: (withAI / 100) * 100 }} />
        <View className="bg-red-400 rounded-t-sm w-5" style={{ height: (withoutAI / 100) * 100 }} />
      </View>
      <Text className="text-slate-500 text-xs mt-2">{label}</Text>
    </View>
  )
}

const POSITION_LABELS: Record<string, string> = {
  goalkeeper: 'Goalkeeper', cb: 'Center Back', lb: 'Left Back', rb: 'Right Back',
  lwb: 'Left Wing Back', rwb: 'Right Wing Back', cdm: 'Defensive Mid', cm: 'Center Midfielder',
  lm: 'Left Midfielder', rm: 'Right Midfielder', cam: 'Attacking Midfielder',
  lw: 'Left Winger', rw: 'Right Winger', cf: 'Center Forward', st: 'Striker',
}

const STYLE_LABELS: Record<string, string> = {
  shot_stopper: 'Shot Stopper', sweeper_keeper: 'Sweeper Keeper', ball_playing_keeper: 'Ball-Playing Keeper', commanding_aerial: 'Commanding Aerial',
  stopper: 'Stopper', ball_playing_cb: 'Ball-Playing Defender', libero_sweeper: 'Libero', progressive_carrier: 'Progressive Carrier',
  attacking_fullback: 'Attacking Full-Back', inverted_fullback: 'Inverted Full-Back', traditional_overlapper: 'Traditional Overlapper', defensive_fullback: 'Defensive Full-Back',
  width_provider: 'Width Provider', complete_wingback: 'Complete Wing-Back', inverted_wingback: 'Inverted Wing-Back', underlapping_wingback: 'Underlapping Wing-Back',
  ball_winner: 'Ball Winner', regista: 'Regista', space_eater: 'Space Eater', press_trigger: 'Press Trigger',
  box_to_box: 'Box-to-Box', mezzala: 'Mezzala', carrilero: 'Carrilero', roaming_playmaker: 'Roaming Playmaker',
  direct_dribbler: 'Direct Dribbler', wide_playmaker: 'Wide Playmaker', halfspace_runner: 'Half-Space Runner', pressing_wide_mid: 'Pressing Machine',
  trequartista: 'Trequartista', enganche: 'Enganche', shadow_striker: 'Shadow Striker', advanced_playmaker: 'Classic #10',
  inverted_winger: 'Inverted Winger', inside_forward: 'Inside Forward', traditional_winger: 'Traditional Winger', pressing_wide_fwd: 'Pressing Wide Forward',
  false_9: 'False 9', deep_lying_forward: 'Deep-Lying Forward', second_striker: 'Second Striker', pressing_fwd: 'Press Leader',
  poacher: 'Poacher', target_man: 'Target Man', pressing_striker: 'Pressing Forward', speed_striker: 'Speed Striker',
}

export default function ProjectedGrowthScreen() {
  const { position, playingStyle, trainingFrequency } = useOnboardingStore()
  const router = useRouter()

  const positionLabel = position ? (POSITION_LABELS[position] || position) : 'Soccer Player'
  const styleLabel = playingStyle ? (STYLE_LABELS[playingStyle] || playingStyle.replace(/_/g, ' ')) : 'Athlete'

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 160 }}>
        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()} className="mb-6 w-10 h-10 items-center justify-center">
          <Ionicons name="arrow-back" size={20} color="#64748B" />
        </TouchableOpacity>

        <View className="flex-row items-center gap-2 mb-3">
          <View className="bg-brand-blue/10 rounded-lg px-3 py-1.5 flex-row items-center gap-2">
            <Ionicons name="sparkles" size={13} color="#2563EB" />
            <Text className="text-brand-blue text-xs font-poppins-bold uppercase tracking-wider">AI Analysis</Text>
          </View>
        </View>

        <Text className="text-slate-900 text-3xl font-poppins-semibold mb-1">Your Growth Plan</Text>
        <Text className="text-slate-500 text-sm font-poppins mb-5">
          Here's what 6 months of AI-coached training looks like vs. training on your own.
        </Text>

        {/* Chart */}
        <View className="bg-coach-card border border-coach-border rounded-2xl p-5 mb-2">
          <Text className="text-slate-900 font-poppins-bold text-sm mb-1">Skill Development Over 6 Months</Text>
          <Text className="text-slate-400 text-xs font-poppins mb-4">Based on your profile as a {positionLabel} / {styleLabel}</Text>

          <View className="flex-row gap-4 mb-4">
            <View className="flex-row items-center gap-2">
              <View className="w-3 h-3 bg-brand-blue rounded-full" />
              <Text className="text-slate-500 text-xs font-poppins">With Soccer AI</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-3 h-3 bg-red-400 rounded-full" />
              <Text className="text-slate-500 text-xs font-poppins">Training alone</Text>
            </View>
          </View>

          <View className="flex-row items-end" style={{ height: 120 }}>
            {MONTHS.map((month, idx) => (
              <BarGroup key={month} withAI={WITH_AI[idx]} withoutAI={WITHOUT_AI[idx]} label={month} />
            ))}
          </View>

          {/* Gap callout */}
          <View className="mt-4 bg-brand-blue/5 border border-brand-blue/20 rounded-xl px-4 py-3 flex-row items-center gap-3">
            <Ionicons name="bar-chart-outline" size={24} color="#2563EB" />
            <View className="flex-1">
              <Text className="text-brand-blue text-xs font-poppins-bold mb-0.5">By Month 6</Text>
              <Text className="text-slate-600 text-xs font-poppins leading-4">
                Players with AI coaching improve <Text className="font-poppins-bold text-slate-900">3.8× faster</Text> than those training without a structured plan.
              </Text>
            </View>
          </View>
        </View>

        {/* Why the gap grows — explanation section */}
        <Text className="text-slate-900 font-poppins-bold text-sm mt-5 mb-3">Why the gap keeps widening</Text>

        {MONTH_EXPLANATIONS.map((item) => (
          <View key={item.month} className="flex-row items-start mb-4 gap-3">
            <View className="w-10 h-10 rounded-xl items-center justify-center flex-shrink-0" style={{ backgroundColor: item.iconBg }}>
              <Ionicons name={item.icon as any} size={20} color={item.iconColor} />
            </View>
            <View className="flex-1">
              <Text className="text-slate-400 text-xs font-poppins mb-0.5">{item.month}</Text>
              <Text className="text-slate-900 font-poppins-bold text-sm mb-0.5">{item.title}</Text>
              <Text className="text-slate-500 text-xs font-poppins leading-4">{item.body}</Text>
            </View>
          </View>
        ))}

        {/* Position-specific insight */}
        <View className="bg-coach-card border border-coach-border rounded-2xl p-4 mt-1 mb-5">
          <Text className="text-slate-500 text-xs font-poppins mb-2 uppercase tracking-wider">YOUR EDGE AS A {positionLabel.toUpperCase()}</Text>
          <View className="flex-row items-start gap-3">
            <Ionicons name="flash" size={16} color="#FBBF24" style={{ marginTop: 2 }} />
            <Text className="text-slate-700 text-sm font-poppins flex-1 leading-5">
              Your AI coach is trained specifically on <Text className="font-poppins-semibold text-slate-900">{positionLabel}</Text> mechanics. Every drill, every session note, and every week's plan is built for your role — not a generic soccer player.
            </Text>
          </View>
        </View>

        {/* What you get bullets */}
        <Text className="text-slate-900 font-poppins-bold text-sm mb-3">Here's how Soccer AI gets you there</Text>
        {[
          `Position-specific drills designed for a ${positionLabel} playing ${styleLabel} style`,
          `${trainingFrequency || '4-5x'} weekly sessions that build on each other — never random`,
          'AI coach adjusts your plan every week based on your progress',
          'Nutrition guidance matched to your training load and position demands',
        ].map((bullet) => (
          <View key={bullet} className="flex-row items-start mb-3">
            <Ionicons name="checkmark-circle" size={16} color="#2563EB" style={{ marginTop: 1, marginRight: 10 }} />
            <Text className="text-slate-600 text-sm flex-1 leading-5">{bullet}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-coach-bg border-t border-coach-border px-6 pt-4 pb-8">
        <TouchableOpacity
          onPress={() => router.push('/')}
          className="bg-brand-blue rounded-2xl py-4 items-center flex-row justify-center gap-2"
        >
          <Text className="text-white font-poppins-bold text-base">See Your Plan</Text>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
