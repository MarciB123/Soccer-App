import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useOnboardingStore, ActivityLevel } from '../../stores/onboarding'

const TOTAL = 20
const STEP = 13

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; description: string; icon: string }[] = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise outside soccer', icon: 'bed-outline' },
  { value: 'lightly_active', label: 'Lightly Active', description: 'Light activity 1-3 days/week', icon: 'walk-outline' },
  { value: 'active', label: 'Active', description: 'Moderate activity 4-5 days/week', icon: 'bicycle-outline' },
  { value: 'very_active', label: 'Very Active', description: 'Intense activity 6-7 days/week', icon: 'flash-outline' },
]

export default function StepPhysicalScreen() {
  const { currentWeight, heightCm, activityLevel, setCurrentWeight, setHeightCm, setActivityLevel } = useOnboardingStore()
  const router = useRouter()

  // Height in feet/inches for US users
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [weightLbs, setWeightLbs] = useState(currentWeight)

  const canContinue = (heightFt || heightCm) && weightLbs && activityLevel

  const handleContinue = () => {
    if (!canContinue) return
    // Convert to cm/lbs for storage
    if (heightFt) {
      const ft = parseFloat(heightFt) || 0
      const inches = parseFloat(heightIn) || 0
      const cm = Math.round((ft * 12 + inches) * 2.54)
      setHeightCm(cm.toString())
    }
    setCurrentWeight(weightLbs)
    router.push('/onboarding/analyzing-nutrition')
  }

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
          <View className="px-6 pt-4">
            {/* Header */}
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
                Calibrating your nutrition...
              </Text>
            </View>

            <Text className="text-slate-900 text-3xl font-poppins-semibold mb-1">Your physical stats</Text>
            <Text className="text-slate-400 text-sm mb-6">Used to calculate your optimal nutrition targets.</Text>

            {/* Height */}
            <Text className="text-slate-600 text-sm font-poppins-semibold mb-3">Height</Text>
            <View className="flex-row gap-3 mb-6">
              <View className="flex-1 bg-coach-card border border-coach-border rounded-2xl px-4 py-4 flex-row items-center">
                <TextInput
                  className="flex-1 text-slate-900 text-lg font-poppins-bold"
                  placeholder="5"
                  placeholderTextColor="#475569"
                  value={heightFt}
                  onChangeText={setHeightFt}
                  keyboardType="number-pad"
                  maxLength={1}
                />
                <Text className="text-slate-500 text-sm font-poppins-medium">ft</Text>
              </View>
              <View className="flex-1 bg-coach-card border border-coach-border rounded-2xl px-4 py-4 flex-row items-center">
                <TextInput
                  className="flex-1 text-slate-900 text-lg font-poppins-bold"
                  placeholder="9"
                  placeholderTextColor="#475569"
                  value={heightIn}
                  onChangeText={setHeightIn}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text className="text-slate-500 text-sm font-poppins-medium">in</Text>
              </View>
            </View>

            {/* Weight */}
            <Text className="text-slate-600 text-sm font-poppins-semibold mb-3">Weight</Text>
            <View className="bg-coach-card border border-coach-border rounded-2xl px-4 py-4 flex-row items-center mb-6">
              <TextInput
                className="flex-1 text-slate-900 text-lg font-poppins-bold"
                placeholder="155"
                placeholderTextColor="#475569"
                value={weightLbs}
                onChangeText={setWeightLbs}
                keyboardType="number-pad"
                maxLength={3}
              />
              <Text className="text-slate-500 text-sm font-poppins-medium">lbs</Text>
            </View>

            {/* Activity Level */}
            <Text className="text-slate-600 text-sm font-poppins-semibold mb-3">Daily Activity Level</Text>
            <View className="gap-2 mb-6">
              {ACTIVITY_LEVELS.map((level) => {
                const selected = activityLevel === level.value
                return (
                  <TouchableOpacity
                    key={level.value}
                    onPress={() => setActivityLevel(level.value)}
                    className={`rounded-2xl p-4 flex-row items-center border ${
                      selected ? 'border-brand-blue bg-brand-blue/10' : 'border-coach-border bg-coach-card'
                    }`}
                  >
                    <View className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                      selected ? 'border-brand-blue bg-brand-blue' : 'border-slate-600'
                    }`}>
                      {selected && <View className="w-2 h-2 bg-white rounded-full" />}
                    </View>
                    <Ionicons name={level.icon as any} size={20} color={selected ? '#2563EB' : '#64748B'} style={{ marginRight: 12 }} />
                    <View className="flex-1">
                      <Text className={`font-poppins-bold text-sm ${selected ? 'text-white' : 'text-slate-700'}`}>{level.label}</Text>
                      <Text className={`text-xs mt-0.5 ${selected ? 'text-blue-600' : 'text-slate-500'}`}>{level.description}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>

            {/* Note */}
            <View className="bg-coach-card border border-coach-border rounded-2xl p-4 mb-6 flex-row items-start gap-2">
              <Ionicons name="lock-closed-outline" size={12} color="#94A3B8" style={{ marginTop: 2 }} />
              <Text className="text-slate-400 text-xs leading-5 flex-1">
                This information is used only to personalize your nutrition guidance. It is never shared or sold.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleContinue}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
