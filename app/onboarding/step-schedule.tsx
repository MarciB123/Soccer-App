import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useOnboardingStore } from '../../stores/onboarding'

const TOTAL = 20
const STEP = 15

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TIMES = [
  { label: 'Morning', sub: '6-9 AM' },
  { label: 'Midday', sub: '11-1 PM' },
  { label: 'Afternoon', sub: '2-5 PM' },
  { label: 'Evening', sub: '5-8 PM' },
]

export default function StepScheduleScreen() {
  const { schedule, toggleScheduleSlot, trainingDaysPerWeek } = useOnboardingStore()
  const router = useRouter()

  const isSelected = (day: string, time: string) =>
    schedule.some((s) => s.day === day && s.time === time)

  // Only show days up to training frequency
  const activeDays = DAYS.slice(0, Math.min(trainingDaysPerWeek || 5, 7))

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <View className="flex-1 pt-4">
        {/* Progress */}
        <View className="flex-row items-center justify-between mb-6 px-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={20} color="#64748B" />
          </TouchableOpacity>
          <View className="flex-1 h-1 bg-coach-border rounded-full mr-3">
            <View className="h-full bg-brand-blue rounded-full" style={{ width: `${(STEP / TOTAL) * 100}%` }} />
          </View>
          <Text className="text-slate-500 text-xs">{STEP}/{TOTAL}</Text>
        </View>

        <Text className="text-slate-900 text-3xl font-poppins-semibold px-6 mb-1">SCHEDULE</Text>
        <Text className="text-slate-400 text-xs font-poppins-semibold uppercase tracking-wider px-6 mb-5">
          SET PRACTICE TIMES
        </Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}>
          {activeDays.map((day) => (
            <View key={day} className="bg-coach-card border border-coach-border rounded-2xl p-4 mb-3">
              <Text className="text-white font-poppins-bold text-base mb-3">{day}</Text>
              <View className="flex-row flex-wrap gap-2">
                {TIMES.map((t) => {
                  const selected = isSelected(day, t.label)
                  return (
                    <TouchableOpacity
                      key={t.label}
                      onPress={() => toggleScheduleSlot(day, t.label)}
                      className={`rounded-xl px-3 py-2 border ${
                        selected
                          ? 'bg-brand-blue/20 border-brand-blue'
                          : 'bg-coach-bg border-coach-border'
                      }`}
                    >
                      <Text className={`text-sm font-poppins-semibold ${selected ? 'text-brand-blue' : 'text-slate-400'}`}>
                        {t.label}
                      </Text>
                      <Text className={`text-xs ${selected ? 'text-blue-300' : 'text-slate-600'}`}>
                        {t.sub}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Bottom buttons */}
        <View className="absolute bottom-0 left-0 right-0 bg-coach-bg border-t border-coach-border px-6 pt-4 pb-8">
          <TouchableOpacity
            onPress={() => router.push('/onboarding/step-goals-input')}
            className="bg-brand-blue rounded-2xl py-4 items-center flex-row justify-center gap-2 mb-2"
          >
            <Ionicons name="calendar" size={18} color="white" />
            <Text className="text-white font-poppins-bold text-base">Save Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/onboarding/step-goals-input')} className="items-center py-2">
            <Text className="text-slate-500 text-sm">Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
