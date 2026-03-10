import { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useOnboardingStore } from '../../stores/onboarding'
import { Position, PositionCategory } from '../../types'

const TOTAL = 10
const STEP = 2

type MainCategory = {
  value: PositionCategory
  label: string
  icon: string
  description: string
  color: string
}

type SubPos = {
  value: Position
  label: string
  abbr: string
  description: string
}

const MAIN_CATEGORIES: MainCategory[] = [
  { value: 'goalkeeper', label: 'Goalkeeper', icon: 'shield-checkmark-outline', description: 'Protect the goal, command your area', color: '#7C3AED' },
  { value: 'defender', label: 'Defender', icon: 'shield-outline', description: 'Win duels, protect the backline', color: '#2563EB' },
  { value: 'midfielder', label: 'Midfielder', icon: 'sync-outline', description: 'Control tempo, connect the team', color: '#059669' },
  { value: 'forward', label: 'Forward', icon: 'flash-outline', description: 'Create chances, score goals', color: '#DC2626' },
]

const SUB_POSITIONS: Record<PositionCategory, SubPos[]> = {
  goalkeeper: [
    { value: 'goalkeeper', label: 'Goalkeeper', abbr: 'GK', description: 'Protect the goal, command your box' },
  ],
  defender: [
    { value: 'cb', label: 'Center Back', abbr: 'CB', description: 'Dominant in the air, defensive rock' },
    { value: 'lb', label: 'Left Back', abbr: 'LB', description: 'Defend left, push forward when possible' },
    { value: 'rb', label: 'Right Back', abbr: 'RB', description: 'Defend right, create from flank' },
    { value: 'lwb', label: 'Left Wing Back', abbr: 'LWB', description: 'Attack-minded, cover the whole left flank' },
    { value: 'rwb', label: 'Right Wing Back', abbr: 'RWB', description: 'Attack-minded, dominate the right flank' },
  ],
  midfielder: [
    { value: 'cdm', label: 'Defensive Mid', abbr: 'CDM', description: 'Break up play, screen the defense' },
    { value: 'cm', label: 'Center Midfielder', abbr: 'CM', description: 'Engine room, both attacking and defending' },
    { value: 'lm', label: 'Left Midfielder', abbr: 'LM', description: 'Wide left, box-to-box work rate' },
    { value: 'rm', label: 'Right Midfielder', abbr: 'RM', description: 'Wide right, energy and creativity' },
    { value: 'cam', label: 'Attacking Midfielder', abbr: 'CAM', description: 'Creative spark, unlock defenses' },
  ],
  forward: [
    { value: 'lw', label: 'Left Wing', abbr: 'LW', description: 'Beat fullbacks, cut inside, deliver' },
    { value: 'rw', label: 'Right Wing', abbr: 'RW', description: 'Pace and skill to terrorize defenders' },
    { value: 'cf', label: 'Center Forward', abbr: 'CF', description: 'Link midfield and attack, creative' },
    { value: 'st', label: 'Striker', abbr: 'ST', description: 'Goalscorer, press high, lead the line' },
  ],
}

const CATEGORY_COLORS: Record<PositionCategory, string> = {
  goalkeeper: '#7C3AED',
  defender: '#2563EB',
  midfielder: '#059669',
  forward: '#DC2626',
}

export default function StepPositionScreen() {
  const { positionCategory, position, setPositionCategory, setPosition } = useOnboardingStore()
  const [step, setStep] = useState<'category' | 'sub'>(positionCategory ? 'sub' : 'category')
  const router = useRouter()

  const handleCategorySelect = (cat: PositionCategory) => {
    setPositionCategory(cat)
    setPosition(null as unknown as Position)
    if (cat === 'goalkeeper') {
      // GK has only one sub-position — auto-select it
      setPosition('goalkeeper')
    }
    setStep('sub')
  }

  const canContinue = !!position

  const handleContinue = () => {
    if (!canContinue) return
    router.push('/onboarding/step-playing-style')
  }

  const selectedCat = positionCategory
  const accentColor = selectedCat ? CATEGORY_COLORS[selectedCat] : '#2563EB'

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <View className="flex-1 px-6 pt-4">
        {/* Progress */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => {
              if (step === 'sub') {
                setStep('category')
                setPositionCategory(null as unknown as PositionCategory)
                setPosition(null as unknown as Position)
              } else {
                router.back()
              }
            }}
            className="mr-3"
          >
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
            {step === 'category' ? 'Step 1 of 2 · Main position' : 'Step 2 of 2 · Exact position'}
          </Text>
        </View>

        <Text className="text-slate-900 text-3xl font-poppins-semibold mb-1">
          {step === 'category' ? 'What do you play?' : 'Pick your spot'}
        </Text>
        <Text className="text-slate-500 text-sm font-poppins mb-6">
          {step === 'category'
            ? 'This shapes your entire training path'
            : `Choose your exact position as a ${positionCategory}`}
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {step === 'category' ? (
            <View className="gap-3 pb-6">
              {MAIN_CATEGORIES.map((cat) => {
                const selected = positionCategory === cat.value
                return (
                  <TouchableOpacity
                    key={cat.value}
                    onPress={() => handleCategorySelect(cat.value)}
                    className={`rounded-2xl p-5 flex-row items-center border ${
                      selected ? 'border-brand-blue bg-brand-blue/5' : 'border-coach-border bg-coach-card'
                    }`}
                  >
                    <View
                      className="w-12 h-12 rounded-2xl items-center justify-center mr-4 flex-shrink-0"
                      style={{ backgroundColor: selected ? cat.color + '20' : '#F1F5F9' }}
                    >
                      <Ionicons name={cat.icon as any} size={24} color={selected ? cat.color : '#64748B'} />
                    </View>
                    <View className="flex-1">
                      <Text className={`font-poppins-bold text-base ${selected ? 'text-brand-blue' : 'text-slate-900'}`}>
                        {cat.label}
                      </Text>
                      <Text className={`text-xs mt-0.5 font-poppins ${selected ? 'text-blue-500' : 'text-slate-500'}`}>
                        {cat.description}
                      </Text>
                    </View>
                    {selected ? (
                      <Ionicons name="checkmark-circle" size={22} color="#2563EB" />
                    ) : (
                      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                    )}
                  </TouchableOpacity>
                )
              })}
            </View>
          ) : (
            <View className="gap-2 pb-6">
              {/* Category breadcrumb */}
              <TouchableOpacity
                onPress={() => setStep('category')}
                className="flex-row items-center gap-2 mb-2 py-1"
              >
                <Ionicons name="chevron-back" size={14} color="#64748B" />
                <Text className="text-slate-500 text-sm font-poppins">
                  {MAIN_CATEGORIES.find((c) => c.value === positionCategory)?.label}
                </Text>
              </TouchableOpacity>

              {(SUB_POSITIONS[positionCategory!] || []).map((sub) => {
                const selected = position === sub.value
                return (
                  <TouchableOpacity
                    key={sub.value}
                    onPress={() => setPosition(sub.value)}
                    className={`rounded-2xl px-5 py-4 flex-row items-center border ${
                      selected ? 'border-brand-blue bg-brand-blue/5' : 'border-coach-border bg-coach-card'
                    }`}
                  >
                    {/* Abbreviation badge */}
                    <View
                      className="w-10 h-10 rounded-xl items-center justify-center mr-4 flex-shrink-0"
                      style={{ backgroundColor: selected ? accentColor + '20' : '#F1F5F9' }}
                    >
                      <Text
                        className="text-xs font-poppins-bold"
                        style={{ color: selected ? accentColor : '#64748B' }}
                      >
                        {sub.abbr}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className={`font-poppins-bold text-sm ${selected ? 'text-brand-blue' : 'text-slate-900'}`}>
                        {sub.label}
                      </Text>
                      <Text className={`text-xs mt-0.5 font-poppins ${selected ? 'text-blue-500' : 'text-slate-500'}`}>
                        {sub.description}
                      </Text>
                    </View>
                    {selected && <Ionicons name="checkmark-circle" size={20} color="#2563EB" />}
                  </TouchableOpacity>
                )
              })}
            </View>
          )}
        </ScrollView>

        {step === 'sub' && (
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
        )}
      </View>
    </SafeAreaView>
  )
}
