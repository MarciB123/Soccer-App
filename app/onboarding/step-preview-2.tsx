import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function Preview2Screen() {
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
            <View className="h-full bg-brand-blue rounded-full w-[10%]" />
          </View>
          <Text className="text-slate-500 text-xs">2/20</Text>
        </View>

        <Text className="text-slate-400 text-xs font-poppins-semibold uppercase tracking-widest mb-1">
          SMART PLANS
        </Text>

        <View className="bg-coach-card border border-coach-border rounded-3xl p-8 items-center mb-8 mt-4">
          <View className="w-20 h-20 bg-brand-blue/20 rounded-3xl items-center justify-center mb-4">
            <Ionicons name="locate" size={40} color="#2563EB" />
          </View>
          <Text className="text-slate-900 text-2xl font-poppins-semibold text-center mb-2">
            Built for Your Position
          </Text>
          <Text className="text-slate-400 text-sm text-center leading-5">
            Every drill, every session — calibrated to your position, body type, and skill level
          </Text>
        </View>

        <View className="gap-3">
          {[
            { label: 'Goalkeeper', detail: 'Reaction drills, distribution, positioning', color: '#1D4ED8', bg: '#1E3A6E' },
            { label: 'Striker', detail: 'Finishing, movement, penalty box mastery', color: '#2563EB', bg: '#1E3A6E' },
            { label: 'Midfielder', detail: 'Passing range, vision, pressing triggers', color: '#7C3AED', bg: '#2D1B69' },
            { label: 'Defender', detail: 'Aerial duels, tackling, line management', color: '#D97706', bg: '#451A03' },
          ].map((item) => (
            <View key={item.label} className="bg-coach-card border border-coach-border rounded-xl px-4 py-3 flex-row items-center">
              <View className="w-8 h-8 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: item.bg }}>
                <Ionicons name="football" size={16} color={item.color} />
              </View>
              <View>
                <Text className="text-white font-poppins-semibold text-sm">{item.label}</Text>
                <Text className="text-slate-500 text-xs">{item.detail}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="flex-1" />

        <TouchableOpacity
          onPress={() => router.push('/onboarding/step-preview-3')}
          className="bg-brand-blue rounded-2xl py-4 items-center flex-row justify-center gap-2 mb-4"
        >
          <Text className="text-white font-poppins-bold text-base">Continue</Text>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </TouchableOpacity>
        <Text className="text-slate-600 text-xs text-center mb-2">No commitment required · Cancel anytime</Text>
      </View>
    </SafeAreaView>
  )
}
