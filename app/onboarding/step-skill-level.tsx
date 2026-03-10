import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useOnboardingStore } from '../../stores/onboarding'
import { SkillLevel } from '../../types'

const TOTAL = 10
const STEP = 5

const SKILL_LEVELS: { value: SkillLevel; label: string; icon: string; iconColor: string; description: string }[] = [
  { value: 'beginner', label: 'Beginner', icon: 'leaf-outline', iconColor: '#16A34A', description: 'Just starting out, learning the fundamentals' },
  { value: 'intermediate', label: 'Intermediate', icon: 'trending-up-outline', iconColor: '#2563EB', description: 'Playing regularly, comfortable with basics' },
  { value: 'advanced', label: 'Advanced', icon: 'flash-outline', iconColor: '#D97706', description: 'Club or school team, solid fundamentals' },
  { value: 'competitive', label: 'Competitive', icon: 'trophy-outline', iconColor: '#DC2626', description: 'Academy, semi-pro, or elite level' },
]

export default function StepSkillLevelScreen() {
  const { skillLevel, setSkillLevel } = useOnboardingStore()
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <View className="flex-1 px-6 pt-4">
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
            Calibrating your level
          </Text>
        </View>

        <Text className="text-slate-900 text-3xl font-poppins-semibold mb-1">Your skill level</Text>
        <Text className="text-slate-500 text-sm font-poppins mb-6">
          Be honest — your coach will create the right challenge for you.
        </Text>

        <View className="gap-3 flex-1">
          {SKILL_LEVELS.map((level) => {
            const selected = skillLevel === level.value
            return (
              <TouchableOpacity
                key={level.value}
                onPress={() => setSkillLevel(level.value)}
                className={`rounded-2xl p-5 flex-row items-center border ${
                  selected ? 'border-brand-blue bg-brand-blue/5' : 'border-coach-border bg-coach-card'
                }`}
              >
                <View className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center ${
                  selected ? 'border-brand-blue bg-brand-blue' : 'border-slate-300'
                }`}>
                  {selected && <View className="w-2 h-2 bg-white rounded-full" />}
                </View>
                <Ionicons name={level.icon as any} size={22} color={selected ? '#2563EB' : level.iconColor} style={{ marginRight: 12 }} />
                <View className="flex-1">
                  <Text className={`font-poppins-bold text-base ${selected ? 'text-brand-blue' : 'text-slate-900'}`}>
                    {level.label}
                  </Text>
                  <Text className={`text-xs mt-0.5 font-poppins ${selected ? 'text-blue-500' : 'text-slate-500'}`}>
                    {level.description}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>

        <TouchableOpacity
          onPress={() => skillLevel && router.push('/onboarding/step-training-days')}
          disabled={!skillLevel}
          className={`rounded-2xl py-4 items-center flex-row justify-center gap-2 mb-4 ${
            skillLevel ? 'bg-brand-blue' : 'bg-slate-100 border border-slate-200'
          }`}
        >
          <Text className={`font-poppins-bold text-base ${skillLevel ? 'text-white' : 'text-slate-400'}`}>
            Continue
          </Text>
          {skillLevel && <Ionicons name="arrow-forward" size={18} color="white" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
