import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '../../stores/auth'
import { useTrainingPlan } from '../../hooks/useTrainingPlan'
import { useTodaySession, useCompleteSession } from '../../hooks/useSessions'
import { supabase } from '../../lib/supabase'
import { Drill } from '../../types'
import { Ionicons } from '@expo/vector-icons'

function DrillCard({ drill, completed, onToggle }: { drill: Drill; completed: boolean; onToggle: () => void }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <View className={`rounded-2xl mb-3 overflow-hidden border ${completed ? 'border-brand-blue/30 bg-brand-blue/5 opacity-60' : 'border-coach-border bg-coach-card'}`}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} className="flex-row items-center px-4 py-4">
        <TouchableOpacity
          onPress={onToggle}
          className={`w-7 h-7 rounded-full border-2 items-center justify-center mr-3 ${
            completed ? 'bg-brand-blue border-brand-blue' : 'border-slate-600'
          }`}
        >
          {completed && <Ionicons name="checkmark" size={14} color="white" />}
        </TouchableOpacity>

        <View className="flex-1">
          <Text className={`font-poppins-bold text-base ${completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
            {drill.name}
          </Text>
          <Text className="text-slate-500 text-sm">{drill.duration_minutes} min</Text>
        </View>

        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color="#64748B" />
      </TouchableOpacity>

      {expanded && (
        <View className="px-4 pb-4 border-t border-coach-border">
          <Text className="text-slate-600 text-sm mb-3 leading-5 mt-3">{drill.description}</Text>
          {drill.instructions?.map((instruction, idx) => (
            <Text key={idx} className="text-slate-400 text-sm mb-1">
              {idx + 1}. {instruction}
            </Text>
          ))}
          {drill.equipment?.length > 0 && (
            <View className="mt-3 flex-row flex-wrap gap-2">
              {drill.equipment.map((item, idx) => (
                <View key={idx} className="bg-brand-blue/10 border border-brand-blue/20 rounded-full px-3 py-1">
                  <Text className="text-brand-blue text-xs">{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  )
}

function RatingModal({ onSubmit }: { onSubmit: (rating: number) => void }) {
  const [rating, setRating] = useState(0)

  return (
    <View className="bg-coach-card border border-coach-border rounded-3xl p-6 mx-4">
      <View className="items-center mb-2">
        <Ionicons name="trophy" size={32} color="#FBBF24" />
      </View>
      <Text className="text-slate-900 text-xl font-poppins-semibold text-center mb-2">Session Complete!</Text>
      <Text className="text-slate-400 text-sm text-center mb-6">How was today's training?</Text>

      <View className="flex-row justify-center gap-3 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={32}
              color={star <= rating ? '#FBBF24' : '#CBD5E1'}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={() => rating > 0 && onSubmit(rating)}
        disabled={rating === 0}
        className={`rounded-2xl py-4 items-center ${rating === 0 ? 'bg-coach-card border border-coach-border' : 'bg-brand-blue'}`}
      >
        <Text className={`font-poppins-bold ${rating === 0 ? 'text-slate-600' : 'text-white'}`}>Done</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function SessionScreen() {
  const { user } = useAuthStore()
  const { data: plan, isLoading: planLoading } = useTrainingPlan()
  const { data: todaySession } = useTodaySession()
  const { mutate: completeSession } = useCompleteSession()

  const [completedDrills, setCompletedDrills] = useState<Set<string>>(new Set())
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [showRating, setShowRating] = useState(false)
  const [sessionActive, setSessionActive] = useState(false)

  const drills: Drill[] = plan?.drills || []

  const toggleDrill = (drillId: string) => {
    if (!sessionActive) {
      setSessionActive(true)
      setSessionStartTime(new Date())
    }
    setCompletedDrills((prev) => {
      const next = new Set(prev)
      if (next.has(drillId)) next.delete(drillId)
      else next.add(drillId)
      return next
    })
  }

  const handleFinishSession = () => {
    if (completedDrills.size === 0) {
      Alert.alert('No drills completed', 'Complete at least one drill to finish the session.')
      return
    }
    setShowRating(true)
  }

  const handleRatingSubmit = async (rating: number) => {
    setShowRating(false)
    const durationMinutes = sessionStartTime
      ? Math.round((Date.now() - sessionStartTime.getTime()) / 60000)
      : 0

    if (todaySession) {
      completeSession({ sessionId: todaySession.id, drillsCompleted: completedDrills.size, durationMinutes, rating })
    } else if (user && plan) {
      const today = new Date().toISOString().split('T')[0]
      await supabase.from('sessions').insert({
        user_id: user.id,
        plan_id: plan.id,
        scheduled_date: today,
        completed_at: new Date().toISOString(),
        duration_minutes: durationMinutes,
        drills_completed: completedDrills.size,
        drills_total: drills.length,
        user_rating: rating,
      })
    }
    setCompletedDrills(new Set())
    setSessionActive(false)
    setSessionStartTime(null)
  }

  if (planLoading) {
    return (
      <SafeAreaView className="flex-1 bg-coach-bg items-center justify-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    )
  }

  if (!plan) {
    return (
      <SafeAreaView className="flex-1 bg-coach-bg items-center justify-center px-6">
        <Ionicons name="document-text-outline" size={48} color="#94A3B8" style={{ marginBottom: 16 }} />
        <Text className="text-slate-900 text-xl font-poppins-semibold mb-2">No Plan Yet</Text>
        <Text className="text-slate-400 text-center text-sm">Go to your home screen and generate your first training plan.</Text>
      </SafeAreaView>
    )
  }

  const totalCompleted = completedDrills.size
  const totalDrills = drills.length
  const progress = totalDrills > 0 ? (totalCompleted / totalDrills) * 100 : 0

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <Modal visible={showRating} transparent animationType="fade">
        <View className="flex-1 bg-black/70 justify-center">
          <RatingModal onSubmit={handleRatingSubmit} />
        </View>
      </Modal>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-slate-500 text-xs mb-1 uppercase tracking-wider">TODAY'S SESSION</Text>
          <Text className="text-slate-900 text-2xl font-poppins-semibold mb-1">Training Plan</Text>
          <Text className="text-slate-400 text-sm">{plan.ai_notes?.slice(0, 100)}</Text>
        </View>

        {/* Progress */}
        <View className="bg-coach-card border border-coach-border rounded-2xl p-4 mb-6">
          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-400 text-sm">Progress</Text>
            <Text className="text-brand-blue text-sm font-poppins-bold">{totalCompleted}/{totalDrills} drills</Text>
          </View>
          <View className="h-2 bg-coach-border rounded-full">
            <View className="h-full bg-brand-blue rounded-full" style={{ width: `${progress}%` }} />
          </View>
        </View>

        {/* Drills */}
        {drills.map((drill) => (
          <DrillCard
            key={drill.id}
            drill={drill}
            completed={completedDrills.has(drill.id)}
            onToggle={() => toggleDrill(drill.id)}
          />
        ))}

        {/* Finish Button */}
        {totalCompleted > 0 && (
          <TouchableOpacity onPress={handleFinishSession} className="bg-brand-blue rounded-2xl py-4 items-center flex-row justify-center gap-2 mt-4">
            <Text className="text-white font-poppins-bold text-base">Finish Session</Text>
            <Ionicons name="checkmark-circle" size={18} color="white" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
