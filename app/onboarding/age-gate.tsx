import { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useOnboardingStore } from '../../stores/onboarding'

const TOTAL = 10
const STEP = 1

export default function AgeGateScreen() {
  const { setAge, setFirstName } = useOnboardingStore()
  const [name, setName] = useState('')
  const [ageInput, setAgeInput] = useState('')
  const router = useRouter()

  const ageNum = parseInt(ageInput, 10)
  const canContinue = name.trim().length >= 2 && ageNum >= 8 && ageNum <= 80

  const handleContinue = () => {
    if (!canContinue) return
    setFirstName(name.trim())
    setAge(ageNum)

    if (ageNum < 13) {
      router.push('/onboarding/coppa-parent')
    } else {
      router.push('/onboarding/step-position')
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
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

          <View className="flex-row items-center gap-2 mb-2">
            <View className="w-2 h-2 bg-brand-blue rounded-full" />
            <Text className="text-brand-blue text-xs font-poppins-semibold uppercase tracking-wider">
              Setting up your profile
            </Text>
          </View>

          <Text className="text-slate-900 text-3xl font-poppins-semibold mb-1">Let's get started</Text>
          <Text className="text-slate-500 text-sm font-poppins mb-8 leading-5">
            Tell us a little about yourself so we can build the perfect training plan.
          </Text>

          {/* Name field */}
          <Text className="text-slate-700 text-sm font-poppins-semibold mb-2">Full Name</Text>
          <View className="bg-coach-card border border-coach-border rounded-2xl px-4 py-4 flex-row items-center mb-5">
            <Ionicons name="person-outline" size={18} color="#94A3B8" style={{ marginRight: 10 }} />
            <TextInput
              className="text-slate-900 text-base font-poppins flex-1"
              placeholder="Your full name"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          {/* Age field */}
          <Text className="text-slate-700 text-sm font-poppins-semibold mb-2">Your Age</Text>
          <View className="bg-coach-card border border-coach-border rounded-2xl px-4 py-4 flex-row items-center mb-2">
            <Ionicons name="calendar-outline" size={18} color="#94A3B8" style={{ marginRight: 10 }} />
            <TextInput
              className="text-slate-900 text-base font-poppins flex-1"
              placeholder="Enter your age"
              placeholderTextColor="#94A3B8"
              value={ageInput}
              onChangeText={(t) => setAgeInput(t.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              maxLength={3}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />
          </View>

          {ageInput && ageNum < 13 && (
            <View className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 flex-row items-start gap-2">
              <Ionicons name="information-circle" size={16} color="#D97706" style={{ marginTop: 2 }} />
              <Text className="text-amber-700 text-xs font-poppins flex-1 leading-4">
                Players under 13 require a parent or guardian to approve their account. We'll send a quick email to confirm.
              </Text>
            </View>
          )}

          <View className="flex-1" />

          <TouchableOpacity
            onPress={handleContinue}
            disabled={!canContinue}
            className={`rounded-2xl py-4 items-center flex-row justify-center gap-2 mb-4 ${
              canContinue ? 'bg-brand-blue' : 'bg-slate-100 border border-slate-200'
            }`}
          >
            <Text className={`font-poppins-bold text-base ${canContinue ? 'text-white' : 'text-slate-400'}`}>
              Continue
            </Text>
            {canContinue && <Ionicons name="arrow-forward" size={18} color="white" />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
