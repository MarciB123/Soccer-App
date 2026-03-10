import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function Preview3Screen() {
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <View className="flex-1 px-6 pt-4">
        {/* Progress */}
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={20} color="#64748B" />
          </TouchableOpacity>
          <View className="flex-1 h-1 bg-coach-border rounded-full mr-3">
            <View className="h-full bg-brand-blue rounded-full w-[15%]" />
          </View>
          <Text className="text-slate-500 text-xs">3/20</Text>
        </View>

        <Text className="text-slate-400 text-xs font-poppins-semibold uppercase tracking-widest mb-1">
          NUTRITION
        </Text>

        {/* Phone mockup placeholder */}
        <View className="bg-coach-card border border-coach-border rounded-3xl p-8 items-center mb-6 mt-4">
          <View className="w-20 h-20 bg-yellow-500/20 rounded-3xl items-center justify-center mb-4">
            <Ionicons name="nutrition" size={40} color="#D97706" />
          </View>
          <Text className="text-slate-900 text-2xl font-poppins-semibold text-center mb-2">
            Fuel Your Game
          </Text>
          <Text className="text-yellow-400 text-sm font-poppins-semibold mb-1">Train Smart · Perform Better</Text>
          <Text className="text-slate-400 text-sm text-center leading-5">
            Personalized meal timing, calorie guidance, and weight management designed specifically for soccer players
          </Text>
        </View>

        {[
          { icon: 'time-outline', text: 'Pre & post-training meal timing' },
          { icon: 'scale-outline', text: 'Body composition optimization' },
          { icon: 'water-outline', text: 'Hydration protocols for match day' },
          { icon: 'restaurant-outline', text: 'Position-specific macros' },
        ].map((item) => (
          <View key={item.text} className="flex-row items-center bg-coach-card border border-coach-border rounded-xl px-4 py-3 mb-2">
            <Ionicons name={item.icon as any} size={18} color="#D97706" style={{ marginRight: 12 }} />
            <Text className="text-slate-600 text-sm">{item.text}</Text>
          </View>
        ))}

        <View className="flex-1" />

        <TouchableOpacity
          onPress={() => router.push('/onboarding/step-name')}
          className="bg-brand-blue rounded-2xl py-4 items-center flex-row justify-center gap-2 mb-4"
        >
          <Text className="text-white font-poppins-bold text-base">Build My Profile</Text>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </TouchableOpacity>
        <Text className="text-slate-600 text-xs text-center mb-2">No commitment required · Cancel anytime</Text>
      </View>
    </SafeAreaView>
  )
}
