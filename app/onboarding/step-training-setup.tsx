import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useOnboardingStore, TrainingFrequency, TrainingIntensity } from '../../stores/onboarding'

const TOTAL = 20
const STEP = 9

const FREQUENCIES: { value: TrainingFrequency; label: string; sub: string }[] = [
  { value: '2-3x', label: '2-3x', sub: 'per week' },
  { value: '4-5x', label: '4-5x', sub: 'per week' },
  { value: '6-7x', label: '6-7x', sub: 'per week' },
]

const INTENSITIES: { value: TrainingIntensity; label: string; sub: string }[] = [
  { value: 'moderate', label: 'Moderate', sub: 'Balanced approach' },
  { value: 'intense', label: 'Intense', sub: 'Competition prep' },
  { value: 'elite', label: 'Elite', sub: 'Two-a-days, full send' },
]

export default function StepTrainingSetupScreen() {
  const { trainingFrequency, setTrainingFrequency, trainingIntensity, setTrainingIntensity } = useOnboardingStore()
  const router = useRouter()
  const canContinue = !!trainingFrequency && !!trainingIntensity

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
            Optimizing training load...
          </Text>
        </View>

        <Text className="text-slate-900 text-3xl font-poppins-semibold mb-1">How do you train?</Text>
        <Text className="text-slate-400 text-sm mb-6">This helps us calibrate intensity and recovery in your plan</Text>

        {/* Frequency */}
        <Text className="text-slate-400 text-xs font-poppins-semibold uppercase tracking-wider mb-3">FREQUENCY</Text>
        <View className="flex-row gap-3 mb-6">
          {FREQUENCIES.map((f) => {
            const selected = trainingFrequency === f.value
            return (
              <TouchableOpacity
                key={f.value}
                onPress={() => setTrainingFrequency(f.value)}
                className={`flex-1 rounded-2xl p-4 items-center border ${
                  selected ? 'border-brand-blue bg-brand-blue/10' : 'border-coach-border bg-coach-card'
                }`}
              >
                <Text className={`text-xl font-poppins-semibold ${selected ? 'text-white' : 'text-slate-600'}`}>
                  {f.label}
                </Text>
                <Text className={`text-xs mt-1 ${selected ? 'text-blue-600' : 'text-slate-500'}`}>
                  {f.sub}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Intensity */}
        <Text className="text-slate-400 text-xs font-poppins-semibold uppercase tracking-wider mb-3">INTENSITY</Text>
        <View className="flex-row gap-3 mb-6">
          {INTENSITIES.map((i) => {
            const selected = trainingIntensity === i.value
            return (
              <TouchableOpacity
                key={i.value}
                onPress={() => setTrainingIntensity(i.value)}
                className={`flex-1 rounded-2xl p-4 items-center border ${
                  selected ? 'border-brand-blue bg-brand-blue/10' : 'border-coach-border bg-coach-card'
                }`}
              >
                <Text className={`text-base font-poppins-bold ${selected ? 'text-white' : 'text-slate-600'}`}>
                  {i.label}
                </Text>
                <Text className={`text-xs mt-1 text-center ${selected ? 'text-blue-600' : 'text-slate-500'}`}>
                  {i.sub}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <View className="flex-1" />

        <TouchableOpacity
          onPress={() => canContinue && router.push('/onboarding/step-skill-level')}
          disabled={!canContinue}
          className={`rounded-2xl py-4 items-center flex-row justify-center gap-2 mb-4 ${
            canContinue ? 'bg-brand-blue' : 'bg-coach-card border border-coach-border'
          }`}
        >
          <Text className={`font-poppins-bold text-base ${canContinue ? 'text-white' : 'text-slate-600'}`}>
            Continue
          </Text>
          {canContinue && <Ionicons name="arrow-forward" size={18} color="white" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
