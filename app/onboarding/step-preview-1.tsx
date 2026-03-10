import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const FEATURES = [
  {
    icon: 'flash' as const,
    color: '#2563EB',
    bg: '#EFF6FF',
    title: 'AI-Powered Coaching',
    description: 'Your personal coach available 24/7, built around your exact position and skill level.',
  },
  {
    icon: 'locate' as const,
    color: '#16A34A',
    bg: '#F0FDF4',
    title: 'Personalized Training Plans',
    description: 'Custom weekly drill programs that adapt as you improve — no generic workouts.',
  },
  {
    icon: 'nutrition' as const,
    color: '#D97706',
    bg: '#FFFBEB',
    title: 'Nutrition Guidance',
    description: 'Pre and post-training fuel plans optimized for your position and training load.',
  },
  {
    icon: 'trending-up' as const,
    color: '#7C3AED',
    bg: '#F5F3FF',
    title: 'Performance Analytics',
    description: 'Track sessions, monitor streaks, and see real measurable improvement over time.',
  },
]

export default function Preview1Screen() {
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-6 pb-4">
          {/* Header */}
          <Text className="text-slate-500 text-xs font-poppins-semibold uppercase tracking-widest mb-1">
            AI TRAINING
          </Text>
          <Text className="text-slate-900 text-3xl font-poppins-semibold mb-1">
            Your Personal Soccer Coach
          </Text>
          <Text className="text-slate-500 text-sm font-poppins leading-5">
            Built around your position. Powered by AI. Ready in minutes.
          </Text>
        </View>

        {/* Hero visual */}
        <View className="mx-6 mb-6 bg-brand-blue rounded-3xl p-7 items-center">
          <View className="w-20 h-20 bg-white/20 rounded-3xl items-center justify-center mb-4">
            <Ionicons name="trophy" size={40} color="white" />
          </View>
          <Text className="text-white text-2xl font-poppins-semibold text-center mb-2">
            Dominate the Pitch
          </Text>
          <Text className="text-blue-100 text-sm font-poppins text-center leading-5">
            Join thousands of players using AI to perfect technique and crush the competition
          </Text>
        </View>

        {/* Features */}
        <View className="px-6">
          <Text className="text-slate-900 text-lg font-poppins-bold mb-4">What You Get</Text>
          {FEATURES.map((f) => (
            <View
              key={f.title}
              className="bg-coach-card border border-coach-border rounded-2xl p-4 mb-3 flex-row items-start"
            >
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mr-3 flex-shrink-0"
                style={{ backgroundColor: f.bg }}
              >
                <Ionicons name={f.icon} size={20} color={f.color} />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 font-poppins-bold text-sm mb-0.5">{f.title}</Text>
                <Text className="text-slate-500 text-xs font-poppins leading-4">{f.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Social proof strip */}
        <View className="mx-6 mt-4 bg-coach-card border border-coach-border rounded-2xl p-4 flex-row justify-around">
          <View className="items-center">
            <Text className="text-brand-blue text-xl font-poppins-bold">15+</Text>
            <Text className="text-slate-500 text-xs font-poppins text-center">Positions</Text>
          </View>
          <View className="w-px bg-coach-border" />
          <View className="items-center">
            <Text className="text-brand-gold text-xl font-poppins-bold">7-Day</Text>
            <Text className="text-slate-500 text-xs font-poppins text-center">Free Trial</Text>
          </View>
          <View className="w-px bg-coach-border" />
          <View className="items-center">
            <Text className="text-brand-blue text-xl font-poppins-bold">100%</Text>
            <Text className="text-slate-500 text-xs font-poppins text-center">Personalized</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-coach-border px-6 pt-4 pb-8">
        <TouchableOpacity
          onPress={() => router.push('/onboarding/age-gate')}
          className="bg-brand-blue rounded-2xl py-4 items-center flex-row justify-center gap-2 mb-2"
        >
          <Text className="text-white font-poppins-bold text-base">Build My Profile</Text>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </TouchableOpacity>
        <Text className="text-slate-400 text-xs font-poppins text-center">
          No commitment required · Cancel anytime
        </Text>
      </View>
    </SafeAreaView>
  )
}
