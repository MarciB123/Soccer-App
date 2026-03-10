import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useOnboardingStore } from '../../stores/onboarding'

const TOTAL = 10
const STEP = 10

export default function StepHealthScreen() {
  const { hasInjuries, parQCleared, setHasInjuries, setParQCleared } = useOnboardingStore()
  const router = useRouter()

  const handleContinue = () => {
    if (hasInjuries === null || parQCleared === null) {
      Alert.alert('Please answer both questions before continuing.')
      return
    }
    if (parQCleared === false) {
      Alert.alert(
        'Medical Clearance Required',
        'Please consult with a healthcare provider before starting any physical training program.',
        [{ text: 'OK' }]
      )
      return
    }
    router.replace('/onboarding/projected-growth')
  }

  const ready = hasInjuries !== null && parQCleared !== null

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

        <Text className="text-slate-900 text-3xl font-poppins-semibold mb-1">Health Check</Text>
        <Text className="text-slate-500 text-sm font-poppins mb-6">
          Required for your safety before we build your plan.
        </Text>

        <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8">
          <View className="flex-row items-center gap-1 mb-1">
            <Ionicons name="warning-outline" size={14} color="#B45309" />
            <Text className="text-amber-700 text-sm font-poppins-bold">Important Disclaimer</Text>
          </View>
          <Text className="text-amber-600 text-xs font-poppins leading-5">
            Soccer AI Coach provides general fitness guidance only. Always consult a licensed coach or medical professional before starting a new training program.
          </Text>
        </View>

        {/* Q1 */}
        <View className="mb-6">
          <Text className="text-slate-900 font-poppins-bold text-base mb-3">
            Do you currently have any injuries or physical limitations?
          </Text>
          <View className="flex-row gap-3">
            {[{ label: 'Yes', value: true }, { label: 'No', value: false }].map(({ label, value }) => {
              const selected = hasInjuries === value
              return (
                <TouchableOpacity
                  key={label}
                  onPress={() => setHasInjuries(value)}
                  className={`flex-1 py-4 rounded-2xl items-center border ${
                    selected ? 'border-brand-blue bg-brand-blue/5' : 'border-coach-border bg-coach-card'
                  }`}
                >
                  <Text className={`font-poppins-bold ${selected ? 'text-brand-blue' : 'text-slate-500'}`}>
                    {label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Q2 — PAR-Q */}
        <View className="mb-8">
          <Text className="text-slate-900 font-poppins-bold text-base mb-3">
            Are you cleared by a doctor or medical professional for physical activity?
          </Text>
          <View className="flex-row gap-3">
            {[{ label: 'Yes', value: true }, { label: 'No / Unsure', value: false }].map(({ label, value }) => {
              const selected = parQCleared === value
              return (
                <TouchableOpacity
                  key={label}
                  onPress={() => setParQCleared(value)}
                  className={`flex-1 py-4 rounded-2xl items-center border ${
                    selected ? 'border-brand-blue bg-brand-blue/5' : 'border-coach-border bg-coach-card'
                  }`}
                >
                  <Text className={`font-poppins-bold text-sm ${selected ? 'text-brand-blue' : 'text-slate-500'}`}>
                    {label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        <View className="flex-1" />

        <TouchableOpacity
          onPress={handleContinue}
          disabled={!ready}
          className={`rounded-2xl py-4 items-center flex-row justify-center gap-2 mb-4 ${
            ready ? 'bg-brand-blue' : 'bg-slate-100 border border-slate-200'
          }`}
        >
          <Text className={`font-poppins-bold text-base ${ready ? 'text-white' : 'text-slate-400'}`}>
            Build My Training Plan
          </Text>
          {ready && <Ionicons name="arrow-forward" size={18} color="white" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
