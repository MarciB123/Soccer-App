import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useOnboardingStore } from '../../stores/onboarding'

const TOTAL = 20
const STEP = 4

export default function StepNameScreen() {
  const { firstName, setFirstName } = useOnboardingStore()
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
            Setting up your profile...
          </Text>
        </View>

        <Text className="text-slate-900 text-3xl font-poppins-semibold mb-1">What's your name?</Text>
        <Text className="text-slate-400 text-sm mb-6">
          Your AI coach will use this to personalize your experience.
        </Text>

        <View className="bg-coach-card border border-coach-border rounded-2xl px-5 py-4 mb-6">
          <TextInput
            className="text-slate-900 text-2xl font-poppins-bold"
            placeholder="Full name..."
            placeholderTextColor="#334155"
            value={firstName}
            onChangeText={setFirstName}
            autoFocus
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => {
              if (firstName.trim()) router.push('/onboarding/age-gate')
            }}
          />
        </View>

        <View className="flex-1" />

        <TouchableOpacity
          onPress={() => firstName.trim() && router.push('/onboarding/age-gate')}
          disabled={!firstName.trim()}
          className={`rounded-2xl py-4 items-center flex-row justify-center gap-2 mb-4 ${
            firstName.trim() ? 'bg-brand-blue' : 'bg-coach-card border border-coach-border'
          }`}
        >
          <Text className={`font-poppins-bold text-base ${firstName.trim() ? 'text-white' : 'text-slate-600'}`}>
            Continue
          </Text>
          {firstName.trim() && <Ionicons name="arrow-forward" size={18} color="white" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
