import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useOnboardingStore, DominantArea } from '../../stores/onboarding'

const TOTAL = 20
const STEP = 8

const AREAS: { value: DominantArea; label: string; description: string }[] = [
  { value: 'on_the_ball', label: 'On the Ball', description: 'Takedowns are my bread and butter — I want possession' },
  { value: 'off_the_ball', label: 'Off the Ball', description: 'I make runs, create space, and time my movement' },
  { value: 'in_transition', label: 'In Transition', description: 'I thrive when the game opens up — quick switches' },
  { value: 'defensive_shape', label: 'Defensive Shape', description: 'I read the game, position well, and let them come to me' },
]

export default function StepStrengthsScreen() {
  const { dominantArea, setDominantArea } = useOnboardingStore()
  const router = useRouter()

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
          <Text className="text-slate-500 text-xs">{STEP}/{TOTAL}</Text>
        </View>

        <View className="flex-row items-center gap-2 mb-1">
          <View className="w-2 h-2 bg-brand-blue rounded-full" />
          <Text className="text-brand-blue text-xs font-poppins-semibold uppercase tracking-wider">
            Analyzing scoring tendencies...
          </Text>
        </View>

        <Text className="text-slate-900 text-3xl font-poppins-semibold mb-1">Where do you dominate?</Text>
        <Text className="text-slate-400 text-sm mb-6">We'll build your training around your strengths</Text>

        <View className="gap-3 flex-1">
          {AREAS.map((area) => {
            const selected = dominantArea === area.value
            return (
              <TouchableOpacity
                key={area.value}
                onPress={() => setDominantArea(area.value)}
                className={`rounded-2xl p-5 flex-row items-center border ${
                  selected
                    ? 'border-brand-blue bg-brand-blue/10'
                    : 'border-coach-border bg-coach-card'
                }`}
              >
                <View className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center ${
                  selected ? 'border-brand-blue bg-brand-blue' : 'border-slate-600'
                }`}>
                  {selected && <View className="w-2 h-2 bg-white rounded-full" />}
                </View>
                <View className="flex-1">
                  <Text className={`font-poppins-bold text-base ${selected ? 'text-white' : 'text-slate-700'}`}>
                    {area.label}
                  </Text>
                  <Text className={`text-xs mt-1 leading-4 ${selected ? 'text-blue-600' : 'text-slate-500'}`}>
                    {area.description}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>

        <TouchableOpacity
          onPress={() => dominantArea && router.push('/onboarding/step-training-setup')}
          disabled={!dominantArea}
          className={`rounded-2xl py-4 items-center flex-row justify-center gap-2 mb-4 ${
            dominantArea ? 'bg-brand-blue' : 'bg-coach-card border border-coach-border'
          }`}
        >
          <Text className={`font-poppins-bold text-base ${dominantArea ? 'text-white' : 'text-slate-600'}`}>
            Continue
          </Text>
          {dominantArea && <Ionicons name="arrow-forward" size={18} color="white" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
