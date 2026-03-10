import { useEffect, useState, useRef } from 'react'
import { View, Text, Animated, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../../stores/auth'
import { supabase } from '../../lib/supabase'

const STEPS = [
  { label: 'Processing your profile...' },
  { label: 'Generating drill sequences...' },
  { label: 'Building weekly schedule...' },
  { label: 'Finalizing your plan...' },
  { label: 'Plan ready!' },
]

export default function GeneratingPlanScreen() {
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [failed, setFailed] = useState(false)
  const progressAnim = useRef(new Animated.Value(0)).current
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { user, fetchProfile } = useAuthStore()
  const router = useRouter()

  // Animation timer — stored in ref so we can stop it when API finishes
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1))
      setProgress((prev) => Math.min(prev + 20, 80))
    }, 900)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start()
  }, [progress])

  const runGenerate = async () => {
    if (!user) return
    setFailed(false)
    try {
      const { error: fnError } = await supabase.functions.invoke('generate-training-plan', {
        body: { userId: user.id },
      })
      if (fnError) throw fnError
      await fetchProfile()
      // Stop the timer before setting 100% — prevents it snapping back to 80%
      if (intervalRef.current) clearInterval(intervalRef.current)
      setProgress(100)
      setTimeout(() => router.replace('/(tabs)/home'), 800)
    } catch {
      setFailed(true)
    }
  }

  useEffect(() => {
    if (!user) return
    runGenerate()
  }, [user])

  const handleRetry = () => {
    setFailed(false)
    setActiveStep(0)
    setProgress(0)
    progressAnim.setValue(0)
    // Restart the animation timer
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1))
      setProgress((prev) => Math.min(prev + 20, 80))
    }, 900)
    runGenerate()
  }

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  })

  if (failed) {
    return (
      <SafeAreaView className="flex-1 bg-coach-bg justify-center items-center px-6">
        <View className="w-20 h-20 bg-red-100 rounded-3xl items-center justify-center mb-6">
          <Ionicons name="alert-circle" size={40} color="#EF4444" />
        </View>
        <Text className="text-slate-900 text-2xl font-poppins-semibold text-center mb-3">
          Generation Failed
        </Text>
        <Text className="text-slate-400 text-center text-sm mb-8 leading-6">
          We couldn't generate your plan. Check your connection and try again.
        </Text>
        <TouchableOpacity
          onPress={handleRetry}
          className="bg-brand-blue rounded-2xl py-4 px-10"
        >
          <Text className="text-white font-poppins-bold text-base">Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-coach-bg justify-center px-6">
      <View className="w-20 h-20 bg-brand-blue/10 border border-brand-blue/30 rounded-3xl items-center justify-center mb-8 self-center">
        <Ionicons name="football-outline" size={40} color="#2563EB" />
      </View>

      <Text className="text-slate-900 text-2xl font-poppins-bold text-center mb-8">Building Your Plan</Text>

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
              <Text className={`text-base ${done ? 'text-slate-400' : active ? 'text-slate-900 font-poppins-bold' : 'text-slate-500'}`}>
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
