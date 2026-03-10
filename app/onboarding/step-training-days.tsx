import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useOnboardingStore } from '../../stores/onboarding'

const TOTAL = 10
const STEP = 6

type DayOption = {
  days: number
  label: string
  tag: string
  tagColor: string
  tagBg: string
  description: string
}

const DAY_OPTIONS: DayOption[] = [
  {
    days: 2,
    label: '2 days',
    tag: 'Light',
    tagColor: '#16A34A',
    tagBg: '#F0FDF4',
    description: 'Perfect for beginners or busy schedules',
  },
  {
    days: 3,
    label: '3 days',
    tag: 'Balanced',
    tagColor: '#2563EB',
    tagBg: '#EFF6FF',
    description: 'Solid improvement without overloading',
  },
  {
    days: 4,
    label: '4 days',
    tag: 'Focused',
    tagColor: '#7C3AED',
    tagBg: '#F5F3FF',
    description: 'Great for consistent skill development',
  },
  {
    days: 5,
    label: '5 days',
    tag: 'Intense',
    tagColor: '#D97706',
    tagBg: '#FFFBEB',
    description: 'Serious player training level',
  },
  {
    days: 6,
    label: '6 days',
    tag: 'Elite',
    tagColor: '#DC2626',
    tagBg: '#FEF2F2',
    description: 'Near-professional training volume',
  },
  {
    days: 7,
    label: '7 days',
    tag: 'Pro',
    tagColor: '#DC2626',
    tagBg: '#FEF2F2',
    description: 'Full week commitment — recovery is key',
  },
]

export default function StepTrainingDaysScreen() {
  const { trainingDaysPerWeek, setTrainingDaysPerWeek } = useOnboardingStore()
  const router = useRouter()

  const selectedOption = DAY_OPTIONS.find((d) => d.days === trainingDaysPerWeek)

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

        <Text className="text-slate-900 text-3xl font-poppins-semibold mb-1">Training schedule</Text>
        <Text className="text-slate-500 text-sm font-poppins mb-6 leading-5">
          How many days per week can you train? Quality beats quantity.
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="gap-3 pb-4">
            {DAY_OPTIONS.map((opt) => {
              const selected = trainingDaysPerWeek === opt.days
              return (
                <TouchableOpacity
                  key={opt.days}
                  onPress={() => setTrainingDaysPerWeek(opt.days)}
                  className={`rounded-2xl px-5 py-4 flex-row items-center border ${
                    selected ? 'border-brand-blue bg-brand-blue/5' : 'border-coach-border bg-coach-card'
                  }`}
                >
                  {/* Days number */}
                  <View
                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4 flex-shrink-0"
                    style={{ backgroundColor: selected ? '#EFF6FF' : '#F1F5F9' }}
                  >
                    <Text
                      className="text-xl font-poppins-bold"
                      style={{ color: selected ? '#2563EB' : '#475569' }}
                    >
                      {opt.days}
                    </Text>
                  </View>

                  {/* Label + description */}
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-0.5">
                      <Text className={`font-poppins-bold text-sm ${selected ? 'text-brand-blue' : 'text-slate-900'}`}>
                        {opt.label}
                      </Text>
                      <View
                        className="px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: selected ? opt.tagBg : '#F1F5F9' }}
                      >
                        <Text
                          className="text-xs font-poppins-bold"
                          style={{ color: selected ? opt.tagColor : '#94A3B8' }}
                        >
                          {opt.tag}
                        </Text>
                      </View>
                    </View>
                    <Text className={`text-xs font-poppins ${selected ? 'text-blue-500' : 'text-slate-500'}`}>
                      {opt.description}
                    </Text>
                  </View>

                  {selected && <Ionicons name="checkmark-circle" size={20} color="#2563EB" />}
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Message when selected */}
          {selectedOption && (
            <View className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4">
              <Text className="text-blue-700 text-sm font-poppins leading-5">
                {(trainingDaysPerWeek ?? 0) >= 5
                  ? 'Elite commitment. Your plan will push you to the next level with periodized training.'
                  : (trainingDaysPerWeek ?? 0) >= 3
                  ? 'Great balance. Consistency at this level drives serious, measurable improvement.'
                  : 'Every session counts. We\'ll build focused, high-impact drills around your schedule.'}
              </Text>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity
          onPress={() => trainingDaysPerWeek && router.push('/onboarding/step-goals-input')}
          disabled={!trainingDaysPerWeek}
          className={`rounded-2xl py-4 items-center flex-row justify-center gap-2 mb-4 ${
            trainingDaysPerWeek ? 'bg-brand-blue' : 'bg-slate-100 border border-slate-200'
          }`}
        >
          <Text className={`font-poppins-bold text-base ${trainingDaysPerWeek ? 'text-white' : 'text-slate-400'}`}>
            Continue
          </Text>
          {trainingDaysPerWeek && <Ionicons name="arrow-forward" size={18} color="white" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
