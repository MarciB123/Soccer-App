import { useEffect, useState, useRef } from 'react'
import { View, Text, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const STEPS = [
  { label: 'Processing your goals...' },
  { label: 'Analyzing training data...' },
  { label: 'Building custom roadmap...' },
  { label: 'Generating insights...' },
  { label: 'Analysis complete!' },
]

const DURATION_PER_STEP = 900 // ms

export default function AnalyzingGoalsScreen() {
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
    }, DURATION_PER_STEP)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: DURATION_PER_STEP - 100,
      useNativeDriver: false,
    }).start()

    if (progress >= 100) {
      setTimeout(() => router.replace('/onboarding/projected-growth'), 600)
    }
  }, [progress])

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  })

  return (
    <SafeAreaView className="flex-1 bg-coach-bg justify-center px-6">
      <Text className="text-slate-900 text-3xl font-poppins-semibold mb-8">YOUR GOALS</Text>

      {/* Icon */}
      <View className="w-20 h-20 bg-coach-card border border-coach-border rounded-3xl items-center justify-center mb-8 self-center">
        <Ionicons name="locate" size={40} color="#2563EB" />
      </View>

      <Text className="text-slate-900 text-2xl font-poppins-bold text-center mb-8">Analyzing Your Goals</Text>

      {/* Steps */}
      <View className="gap-4 mb-8">
        {STEPS.map((step, idx) => {
          const done = idx < activeStep
          const active = idx === activeStep
          const pending = idx > activeStep

          return (
            <View key={step.label} className="flex-row items-center gap-4">
              <View
                className={`w-7 h-7 rounded-full border-2 items-center justify-center ${
                  done
                    ? 'bg-brand-blue border-brand-blue'
                    : active
                    ? 'border-brand-blue bg-brand-blue/20'
                    : 'border-coach-border'
                }`}
              >
                {done ? (
                  <Ionicons name="checkmark" size={14} color="white" />
                ) : active ? (
                  <View className="w-3 h-3 bg-brand-blue rounded-full" />
                ) : null}
              </View>
              <Text
                className={`text-base ${
                  done ? 'text-slate-400' : active ? 'text-white font-poppins-bold' : 'text-slate-700'
                }`}
              >
                {step.label}
              </Text>
            </View>
          )
        })}
      </View>

      {/* Progress bar */}
      <View className="h-1.5 bg-coach-border rounded-full overflow-hidden mb-3">
        <Animated.View
          className="h-full bg-brand-blue rounded-full"
          style={{ width: progressWidth }}
        />
      </View>
      <Text className="text-brand-blue text-sm font-poppins-bold text-center">{progress}%</Text>
    </SafeAreaView>
  )
}
