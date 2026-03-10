import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../../stores/auth'
import { useTrainingPlan } from '../../hooks/useTrainingPlan'

const POSITION_NUTRITION: Record<string, { focus: string; tips: string[] }> = {
  goalkeeper: {
    focus: 'Explosive power and reaction time',
    tips: [
      'Focus on lean protein to maintain power-to-weight ratio',
      'Complex carbs 2-3 hours before training for sustained energy',
      'Stay hydrated — even mild dehydration slows reaction time',
    ],
  },
  cb: {
    focus: 'Strength, aerial dominance, and recovery',
    tips: [
      'Higher protein intake supports muscle density and tackling power',
      'Anti-inflammatory foods (berries, salmon, leafy greens) aid recovery',
      'Creatine from food sources (red meat, fish) supports explosive aerial bursts',
    ],
  },
  lb: {
    focus: 'Endurance, speed, and recovery',
    tips: [
      'Full-backs cover massive distance — carb-load the night before match days',
      'Electrolytes are critical for 90-minute endurance at high intensity',
      'Lean protein supports muscle repair from repeated sprinting and tackling',
    ],
  },
  rb: {
    focus: 'Endurance, speed, and recovery',
    tips: [
      'Full-backs cover massive distance — carb-load the night before match days',
      'Electrolytes are critical for 90-minute endurance at high intensity',
      'Lean protein supports muscle repair from repeated sprinting and tackling',
    ],
  },
  lwb: {
    focus: 'Speed, endurance, and explosive output',
    tips: [
      'Wing-backs need elite aerobic capacity — prioritize complex carbs daily',
      'Lightweight carbs (banana, oats) before sessions fuel fast-twitch muscles',
      'Electrolyte balance is critical — coconut water post-session works well',
    ],
  },
  rwb: {
    focus: 'Speed, endurance, and explosive output',
    tips: [
      'Wing-backs need elite aerobic capacity — prioritize complex carbs daily',
      'Lightweight carbs (banana, oats) before sessions fuel fast-twitch muscles',
      'Electrolyte balance is critical — coconut water post-session works well',
    ],
  },
  cdm: {
    focus: 'Sustained energy, strength, and mental sharpness',
    tips: [
      'CDMs make high-intensity interceptions all game — stay fueled with complex carbs',
      'Higher protein supports the physical demands of shielding and winning duels',
      'Omega-3 fatty acids (salmon, walnuts) support mental clarity and focus',
    ],
  },
  cm: {
    focus: 'Sustained energy and high-intensity output',
    tips: [
      'Midfielders cover the most distance — prioritize carb loading on match days',
      'Eat every 3-4 hours to maintain energy through full matches',
      'Electrolyte balance is critical — coconut water post-session works well',
    ],
  },
  lm: {
    focus: 'Speed, agility, and explosive bursts',
    tips: [
      'Lightweight carbs (banana, oats) before sessions fuel fast-twitch muscles',
      'Avoid heavy meals within 2 hours of training',
      'BCAAs from food (chicken, eggs, dairy) support fast-twitch muscle recovery',
    ],
  },
  rm: {
    focus: 'Speed, agility, and explosive bursts',
    tips: [
      'Lightweight carbs (banana, oats) before sessions fuel fast-twitch muscles',
      'Avoid heavy meals within 2 hours of training',
      'BCAAs from food (chicken, eggs, dairy) support fast-twitch muscle recovery',
    ],
  },
  cam: {
    focus: 'Mental sharpness, creativity, and sustained output',
    tips: [
      'Brain-fueling foods (blueberries, dark chocolate, nuts) sharpen decision-making',
      'Steady blood sugar with complex carbs prevents energy crashes in the second half',
      'Protein within 30 min post-training for muscle repair and recovery',
    ],
  },
  lw: {
    focus: 'Explosive pace, agility, and 1v1 power',
    tips: [
      'Lightweight carbs before sessions maximize fast-twitch muscle fuel',
      'Lean body weight is key for wingers — avoid heavy, slow-digesting foods pre-game',
      'BCAAs from food (chicken, eggs, dairy) support recovery from explosive sprinting',
    ],
  },
  rw: {
    focus: 'Explosive pace, agility, and 1v1 power',
    tips: [
      'Lightweight carbs before sessions maximize fast-twitch muscle fuel',
      'Lean body weight is key for wingers — avoid heavy, slow-digesting foods pre-game',
      'BCAAs from food (chicken, eggs, dairy) support recovery from explosive sprinting',
    ],
  },
  cf: {
    focus: 'Linkup strength, speed, and finishing sharpness',
    tips: [
      'High-quality carbs the night before maximize glycogen stores for match day',
      'Caffeine (coffee or green tea) 60 min before games sharpens focus and reaction',
      'Protein within 30 min post-training supports muscle repair and power development',
    ],
  },
  st: {
    focus: 'Power, explosive pace, and mental focus',
    tips: [
      'High-quality carbs the night before maximize glycogen stores for match day',
      'Caffeine (coffee or green tea) 60 min before games can sharpen finishing focus',
      'Protein within 30 min post-training for muscle repair and growth',
    ],
  },
}

const DEFAULT_NUTRITION = {
  focus: 'Overall performance and recovery',
  tips: [
    'Eat a balanced meal with carbs and protein 2-3 hours before training',
    'Hydrate throughout the day — minimum 8 glasses of water',
    'Recover with protein-rich foods within 30 minutes after training',
  ],
}

function NutritionCard({ icon, iconColor, title, accent, items }: { icon: string; iconColor: string; title: string; accent: string; items: string[] }) {
  return (
    <View className={`rounded-2xl p-5 mb-4 bg-coach-card border ${accent}`}>
      <Ionicons name={icon as any} size={24} color={iconColor} style={{ marginBottom: 8 }} />
      <Text className="text-slate-900 font-poppins-semibold text-base mb-3">{title}</Text>
      {items.map((item, idx) => (
        <View key={idx} className="flex-row mb-2">
          <Text className="text-slate-500 mr-2 mt-0.5">•</Text>
          <Text className="text-slate-600 text-sm flex-1 leading-5">{item}</Text>
        </View>
      ))}
    </View>
  )
}

export default function NutritionScreen() {
  const { profile } = useAuthStore()
  const { data: plan, isLoading } = useTrainingPlan()

  const positionKey = profile?.position as string
  const positionData = POSITION_NUTRITION[positionKey] || DEFAULT_NUTRITION
  const planNutrition = plan?.nutrition_guidance || ''

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        {/* Disclaimer */}
        <View className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-6">
          <View className="flex-row items-center gap-1 mb-1">
            <Ionicons name="warning-outline" size={12} color="#B45309" />
            <Text className="text-amber-700 text-xs font-poppins-bold">Disclaimer</Text>
          </View>
          <Text className="text-amber-600 text-xs leading-5">
            This nutrition guidance is general information only and not medical advice. Consult a registered dietitian for personalized plans.
          </Text>
        </View>

        <Text className="text-slate-900 text-2xl font-poppins-semibold mb-1">Nutrition</Text>
        <Text className="text-slate-400 text-sm mb-6">
          Optimized for {profile?.position ? profile.position.charAt(0).toUpperCase() + profile.position.slice(1) : 'Soccer Players'}
        </Text>

        {/* Position focus */}
        <View className="bg-coach-card border border-coach-border rounded-2xl p-4 mb-6 flex-row items-center gap-3">
          <Ionicons name="flag-outline" size={24} color="#2563EB" />
          <View className="flex-1">
            <Text className="text-slate-500 text-xs mb-1 uppercase tracking-wider">YOUR NUTRITIONAL FOCUS</Text>
            <Text className="text-slate-900 font-poppins-bold text-sm">{positionData.focus}</Text>
          </View>
        </View>

        {/* AI-generated plan nutrition */}
        {isLoading ? (
          <ActivityIndicator color="#2563EB" style={{ marginBottom: 16 }} />
        ) : planNutrition ? (
          <View className="bg-brand-blue/10 border border-brand-blue/30 rounded-2xl p-5 mb-6">
            <Text className="text-brand-blue text-xs font-poppins-bold mb-2 uppercase tracking-wider">THIS WEEK'S PLAN</Text>
            <Text className="text-slate-600 text-sm leading-6">{planNutrition}</Text>
          </View>
        ) : null}

        <NutritionCard
          icon="flash-outline"
          iconColor="#2563EB"
          title="Pre-Training (2-3 hrs before)"
          accent="border-brand-blue/30"
          items={[
            'Oatmeal with banana and a drizzle of honey',
            'Whole grain toast with peanut butter',
            'Brown rice with lean chicken',
            'Avoid high-fat or fried foods — slow digestion',
          ]}
        />

        <NutritionCard
          icon="water-outline"
          iconColor="#2563EB"
          title="During Training (60+ min sessions)"
          accent="border-coach-border"
          items={[
            'Sip water every 15-20 minutes',
            'For sessions over 75 min: add electrolytes (sports drink or coconut water)',
            'A small banana can fuel the second half of long sessions',
          ]}
        />

        <NutritionCard
          icon="barbell-outline"
          iconColor="#2563EB"
          title="Post-Training (within 30 min)"
          accent="border-coach-border"
          items={[
            'Protein shake or Greek yogurt with fruit',
            'Chocolate milk (surprisingly effective recovery drink)',
            'Eggs and toast for a full meal option',
            'Rehydrate with 16-24 oz of water per hour of training',
          ]}
        />

        {/* Position tips */}
        <View className="bg-coach-card border border-coach-border rounded-2xl p-5 mb-4">
          <Text className="text-slate-900 font-poppins-semibold mb-3">
            {profile?.position
              ? `${profile.position.charAt(0).toUpperCase() + profile.position.slice(1)} Tips`
              : 'Position-Specific Tips'}
          </Text>
          {positionData.tips.map((tip, idx) => (
            <View key={idx} className="flex-row mb-3">
              <Text className="text-brand-blue mr-2 font-poppins-bold">{idx + 1}.</Text>
              <Text className="text-slate-600 text-sm flex-1 leading-5">{tip}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
