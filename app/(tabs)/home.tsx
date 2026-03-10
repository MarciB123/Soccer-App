import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '../../stores/auth'
import { useTrainingPlan } from '../../hooks/useTrainingPlan'
import { useWeekSessions } from '../../hooks/useSessions'
import { supabase } from '../../lib/supabase'
import { Ionicons } from '@expo/vector-icons'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function WelcomeBanner({ name, onDismiss }: { name: string; onDismiss: () => void }) {
  const slideAnim = useRef(new Animated.Value(-120)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 8 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start()

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -120, duration: 400, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start(() => onDismiss())
    }, 3500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        opacity: opacityAnim,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}
    >
      <View className="mx-4 mt-2 bg-brand-gold rounded-2xl px-5 py-4 flex-row items-center">
        <View className="w-8 h-8 bg-black/10 rounded-full items-center justify-center mr-3">
          <Ionicons name="football" size={18} color="#000" />
        </View>
        <View className="flex-1">
          <Text className="text-black font-poppins-semibold text-base">Hi, {name?.trim() || 'Player'}!</Text>
          <Text className="text-black/70 font-poppins text-sm">Let's get to training!</Text>
        </View>
        <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={18} color="rgba(0,0,0,0.5)" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

export default function HomeScreen() {
  const { profile, showWelcomeBanner, setShowWelcomeBanner } = useAuthStore()
  const { data: plan, isLoading: planLoading, refetch: refetchPlan } = useTrainingPlan()
  const { data: weekSessions = [], refetch: refetchSessions } = useWeekSessions()
  const [refreshing, setRefreshing] = useState(false)
  const [generatingPlan, setGeneratingPlan] = useState(false)
  const router = useRouter()
  const { user } = useAuthStore()

  const onRefresh = async () => {
    setRefreshing(true)
    await Promise.all([refetchPlan(), refetchSessions()])
    setRefreshing(false)
  }

  const handleGeneratePlan = async () => {
    if (!user) return
    setGeneratingPlan(true)
    try {
      await supabase.functions.invoke('generate-training-plan', { body: { userId: user.id } })
      await refetchPlan()
    } finally {
      setGeneratingPlan(false)
    }
  }

  const completedThisWeek = weekSessions.filter((s: any) => s.completed_at).length
  const totalPlanned = weekSessions.length
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      {showWelcomeBanner && (
        <WelcomeBanner
          name={profile?.first_name || 'Player'}
          onDismiss={() => setShowWelcomeBanner(false)}
        />
      )}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-slate-500 text-sm font-poppins">{today}</Text>
          <Text className="text-slate-900 text-3xl font-poppins-semibold mt-1">
            {getGreeting()},{'\n'}
            {profile?.first_name?.trim() || 'Player'}
          </Text>
        </View>

        {/* Stats Row */}
        <View className="flex-row gap-3 mb-5">
          <View className="flex-1 bg-coach-card border border-coach-border rounded-2xl p-4">
            <Text className="text-slate-500 text-xs font-poppins-medium mb-1">THIS WEEK</Text>
            <Text className="text-slate-900 text-2xl font-poppins-semibold">
              {completedThisWeek}/{totalPlanned || profile?.training_days_per_week || '—'}
            </Text>
            <Text className="text-slate-500 text-xs font-poppins">sessions</Text>
          </View>
          <View className="flex-1 bg-coach-card border border-coach-border rounded-2xl p-4">
            <Text className="text-slate-500 text-xs font-poppins-medium mb-1">STREAK</Text>
            <View className="flex-row items-center gap-1">
            <Text className="text-slate-900 text-2xl font-poppins-semibold">{completedThisWeek}</Text>
            <Ionicons name="flame" size={22} color="#EF4444" />
          </View>
            <Text className="text-slate-500 text-xs font-poppins">days</Text>
          </View>
          <View className="flex-1 bg-coach-card border border-coach-border rounded-2xl p-4">
            <Text className="text-slate-500 text-xs font-poppins-medium mb-1">POSITION</Text>
            <Text className="text-slate-900 text-sm font-poppins-bold capitalize mt-1">
              {profile?.position?.replace(/_/g, ' ') || '—'}
            </Text>
          </View>
        </View>

        {/* Today's Session */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/session')}
          className="bg-brand-blue rounded-3xl p-6 mb-4"
        >
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-blue-200 text-xs font-poppins-semibold uppercase tracking-wider">TODAY'S TRAINING</Text>
            <View className="bg-white/20 px-2 py-0.5 rounded-full">
              <Text className="text-white text-xs font-poppins-medium">Week {plan?.week_number || 1}</Text>
            </View>
          </View>
          {planLoading ? (
            <ActivityIndicator color="white" />
          ) : plan ? (
            <>
              <Text className="text-white text-2xl font-poppins-semibold mb-1">
                {plan.drills?.length || 0} Drills Ready
              </Text>
              <Text className="text-blue-100 text-sm font-poppins mb-4">
                {plan.ai_notes?.slice(0, 90)}...
              </Text>
              <View className="bg-white/20 rounded-xl py-3 items-center flex-row justify-center gap-2">
                <Text className="text-white font-poppins-bold text-base">Start Training</Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </View>
            </>
          ) : (
            <>
              <Text className="text-white text-xl font-poppins-bold mb-3">No Plan Yet</Text>
              <TouchableOpacity
                onPress={handleGeneratePlan}
                disabled={generatingPlan}
                className="bg-white/20 rounded-xl py-3 items-center"
              >
                {generatingPlan ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-white font-poppins-bold">Generate My Plan</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </TouchableOpacity>

        {/* Generate Next Week — shown when a plan already exists */}
        {plan && !generatingPlan && (
          <TouchableOpacity
            onPress={handleGeneratePlan}
            className="flex-row items-center justify-between bg-coach-card border border-coach-border rounded-2xl px-5 py-3.5 mb-4"
          >
            <View>
              <Text className="text-slate-900 font-poppins-semibold text-sm">Ready for Next Week?</Text>
              <Text className="text-slate-500 text-xs font-poppins">Generate Week {(plan.week_number || 1) + 1} plan</Text>
            </View>
            <Ionicons name="refresh" size={20} color="#2563EB" />
          </TouchableOpacity>
        )}
        {plan && generatingPlan && (
          <View className="flex-row items-center justify-center bg-coach-card border border-coach-border rounded-2xl px-5 py-3.5 mb-4 gap-2">
            <ActivityIndicator size="small" color="#2563EB" />
            <Text className="text-slate-500 font-poppins text-sm">Generating Week {(plan.week_number || 1) + 1}...</Text>
          </View>
        )}

        {/* Quick Actions */}
        <View className="flex-row gap-3 mb-4">
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/coach')}
            className="flex-1 bg-coach-card border border-coach-border rounded-2xl p-4"
          >
            <Ionicons name="chatbubble-ellipses" size={24} color="#2563EB" style={{ marginBottom: 8 }} />
            <Text className="text-slate-900 font-poppins-bold text-sm">AI Coach</Text>
            <Text className="text-slate-500 text-xs font-poppins mt-0.5">Ask anything</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/nutrition')}
            className="flex-1 bg-coach-card border border-coach-border rounded-2xl p-4"
          >
            <Ionicons name="nutrition" size={24} color="#16A34A" style={{ marginBottom: 8 }} />
            <Text className="text-slate-900 font-poppins-bold text-sm">Nutrition</Text>
            <Text className="text-slate-500 text-xs font-poppins mt-0.5">Fuel up right</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile')}
            className="flex-1 bg-coach-card border border-coach-border rounded-2xl p-4"
          >
            <Ionicons name="bar-chart" size={24} color="#7C3AED" style={{ marginBottom: 8 }} />
            <Text className="text-slate-900 font-poppins-bold text-sm">Progress</Text>
            <Text className="text-slate-500 text-xs font-poppins mt-0.5">Track stats</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
