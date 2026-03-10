import { useEffect, useState, useRef } from 'react'
import { View, Text, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const STEPS = [
  { label: 'Calculating caloric needs...' },
  { label: 'Optimizing macronutrients...' },
  { label: 'Planning meal timing...' },
  { label: 'Setting performance targets...' },
  { label: 'Nutrition plan ready!' },
]

export default function AnalyzingNutritionScreen() {
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const progressAnim = useRef(new Animated.Value(0)).current
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < STEPS.length - 1) return prev + 1
        clearInterval(interval)
        return prev
      })
      setProgress((prev) => Math.min(prev + 20, 100))
    }, 900)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start()
    if (progress >= 100) {
      setTimeout(() => router.replace('/onboarding/step-schedule'), 600)
    }
  }, [progress])

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  })

  return (
    <SafeAreaView className="flex-1 bg-coach-bg justify-center px-6">
      <Text className="text-slate-900 text-3xl font-poppins-semibold mb-8">NUTRITION PLAN</Text>

      <View className="w-20 h-20 bg-yellow-500/10 border border-yellow-500/30 rounded-3xl items-center justify-center mb-8 self-center">
        <Ionicons name="nutrition" size={40} color="#D97706" />
      </View>

      <Text className="text-slate-900 text-2xl font-poppins-bold text-center mb-8">Setting Nutrition Plan</Text>

      <View className="gap-4 mb-8">
        {STEPS.map((step, idx) => {
          const done = idx < activeStep
          const active = idx === activeStep

          return (
            <View key={step.label} className="flex-row items-center gap-4">
              <View
                className={`w-7 h-7 rounded-full border-2 items-center justify-center ${
                  done ? 'bg-brand-blue border-brand-blue' : active ? 'border-brand-blue bg-brand-blue/20' : 'border-coach-border'
                }`}
              >
                {done ? <Ionicons name="checkmark" size={14} color="white" /> : active ? <View className="w-3 h-3 bg-brand-blue rounded-full" /> : null}
              </View>
              <Text className={`text-base ${done ? 'text-slate-400' : active ? 'text-white font-poppins-bold' : 'text-slate-700'}`}>
                {step.label}
              </Text>
            </View>
          )
        })}
      </View>

      <View className="h-1.5 bg-coach-border rounded-full overflow-hidden mb-3">
        <Animated.View className="h-full bg-brand-blue rounded-full" style={{ width: progressWidth }} />
      </View>
      <Text className="text-brand-blue text-sm font-poppins-bold text-center">{progress}%</Text>
    </SafeAreaView>
  )
}
