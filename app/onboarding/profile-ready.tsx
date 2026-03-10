import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const READY_ITEMS = [
  { icon: 'brain', iconColor: '#7C3AED', iconBg: '#2D1B69', label: 'AI Coaching Profile', sub: 'Custom-built for your style' },
  { icon: 'nutrition', iconColor: '#D97706', iconBg: '#451A03', label: 'Nutrition Plan', sub: 'Calibrated to your position' },
  { icon: 'locate', iconColor: '#059669', iconBg: '#064E3B', label: 'Training Roadmap', sub: 'Personalized drill sequences' },
]

export default function ProfileReadyScreen() {
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <View className="flex-1 px-6 pt-4">
        {/* Progress — full */}
        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-1 h-1 bg-brand-blue rounded-full mr-3" />
          <Text className="text-slate-500 text-xs">20/20</Text>
        </View>

        <Text className="text-slate-900 text-3xl font-poppins-semibold mb-8">SOCCER AI</Text>

        {/* Big checkmark */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-brand-blue/20 border-2 border-brand-blue rounded-full items-center justify-center">
            <Ionicons name="checkmark" size={48} color="#2563EB" />
          </View>
        </View>

        <Text className="text-slate-900 text-3xl font-poppins-semibold text-center mb-2">Profile Ready</Text>
        <Text className="text-slate-400 text-sm text-center mb-8 leading-5">
          Your personalized soccer AI is calibrated and ready to go.
        </Text>

        {/* Ready items */}
        <View className="gap-3 mb-8">
          {READY_ITEMS.map((item) => (
            <View
              key={item.label}
              className="bg-coach-card border border-coach-border rounded-2xl px-4 py-4 flex-row items-center"
            >
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: item.iconBg }}
              >
                <Ionicons name={item.icon as any} size={20} color={item.iconColor} />
              </View>
              <View className="flex-1">
                <Text className="text-white font-poppins-bold text-sm">{item.label}</Text>
                <Text className="text-slate-500 text-xs">{item.sub}</Text>
              </View>
              <Ionicons name="checkmark" size={18} color="#2563EB" />
            </View>
          ))}
        </View>

        <Text className="text-slate-500 text-xs text-center mb-6">
          Sign in to unlock your full experience
        </Text>

        <View className="flex-1" />

        <TouchableOpacity
          onPress={() => router.replace('/paywall')}
          className="bg-brand-blue rounded-2xl py-4 items-center flex-row justify-center gap-2 mb-4"
        >
          <Text className="text-white font-poppins-bold text-base">Sign In to Continue</Text>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
