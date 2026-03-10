import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useOnboardingStore } from '../../stores/onboarding'
import { BodyType } from '../../types'

const TOTAL = 10
const STEP = 4

const BODY_TYPES: { value: BodyType; label: string; icon: string; iconColor: string; description: string }[] = [
  { value: 'lean', label: 'Lean', icon: 'speedometer-outline', iconColor: '#2563EB', description: 'Naturally slim, fast metabolism, built for speed' },
  { value: 'athletic', label: 'Athletic', icon: 'fitness-outline', iconColor: '#059669', description: 'Balanced build, naturally strong and agile' },
  { value: 'stocky', label: 'Stocky', icon: 'shield-outline', iconColor: '#7C3AED', description: 'Compact, powerful frame, hard to push off the ball' },
  { value: 'tall_lean', label: 'Tall & Lean', icon: 'resize-outline', iconColor: '#0891B2', description: 'Tall frame, slim build, great for aerial duels' },
  { value: 'tall_athletic', label: 'Tall & Athletic', icon: 'body-outline', iconColor: '#DC2626', description: 'Tall and muscular, dominant physically' },
]

export default function StepBodyTypeScreen() {
  const { bodyType, setBodyType } = useOnboardingStore()
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <View className="flex-1 px-6 pt-4">
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
            Optimizing for your physique
          </Text>
        </View>

        <Text className="text-slate-900 text-3xl font-poppins-semibold mb-1">Your body type</Text>
        <Text className="text-slate-500 text-sm font-poppins mb-6">
          This helps us optimize your training and nutrition plan.
        </Text>

        <View className="gap-3 flex-1">
          {BODY_TYPES.map((bt) => {
            const selected = bodyType === bt.value
            return (
              <TouchableOpacity
                key={bt.value}
                onPress={() => setBodyType(bt.value)}
                className={`rounded-2xl p-4 flex-row items-center border ${
                  selected ? 'border-brand-blue bg-brand-blue/5' : 'border-coach-border bg-coach-card'
                }`}
              >
                <View className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                  selected ? 'border-brand-blue bg-brand-blue' : 'border-slate-300'
                }`}>
                  {selected && <View className="w-2 h-2 bg-white rounded-full" />}
                </View>
                <Ionicons name={bt.icon as any} size={20} color={selected ? '#2563EB' : bt.iconColor} style={{ marginRight: 12 }} />
                <View className="flex-1">
                  <Text className={`font-poppins-bold text-sm ${selected ? 'text-brand-blue' : 'text-slate-900'}`}>
                    {bt.label}
                  </Text>
                  <Text className={`text-xs font-poppins mt-0.5 ${selected ? 'text-blue-500' : 'text-slate-500'}`}>
                    {bt.description}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>

        <TouchableOpacity
          onPress={() => bodyType && router.push('/onboarding/step-skill-level')}
          disabled={!bodyType}
          className={`rounded-2xl py-4 items-center flex-row justify-center gap-2 mb-4 ${
            bodyType ? 'bg-brand-blue' : 'bg-slate-100 border border-slate-200'
          }`}
        >
          <Text className={`font-poppins-bold text-base ${bodyType ? 'text-white' : 'text-slate-400'}`}>
            Continue
          </Text>
          {bodyType && <Ionicons name="arrow-forward" size={18} color="white" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
