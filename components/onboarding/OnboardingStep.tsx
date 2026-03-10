import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Props {
  step: number
  totalSteps: number
  title: string
  subtitle?: string
  children: React.ReactNode
  onNext?: () => void
  nextLabel?: string
  nextDisabled?: boolean
  onBack?: () => void
}

export default function OnboardingStep({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  onNext,
  nextLabel = 'Continue',
  nextDisabled = false,
  onBack,
}: Props) {
  const progress = (step / totalSteps) * 100

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <View className="px-6 pt-4 flex-1">
        {/* Progress bar */}
        <View className="flex-row items-center gap-3 mb-8">
          {onBack && (
            <TouchableOpacity onPress={onBack} className="mr-2">
              <Text className="text-brand-green text-lg">←</Text>
            </TouchableOpacity>
          )}
          <View className="flex-1 h-1.5 bg-slate-700 rounded-full">
            <View
              className="h-full bg-brand-green rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
          <Text className="text-slate-500 text-xs">{step}/{totalSteps}</Text>
        </View>

        <Text className="text-3xl font-bold text-white mb-2">{title}</Text>
        {subtitle && <Text className="text-slate-400 text-base mb-8">{subtitle}</Text>}

        <View className="flex-1">{children}</View>

        {onNext && (
          <View className="pb-4">
            <TouchableOpacity
              onPress={onNext}
              disabled={nextDisabled}
              className={`rounded-xl py-4 items-center ${
                nextDisabled ? 'bg-slate-700' : 'bg-brand-green'
              }`}
            >
              <Text
                className={`font-bold text-lg ${
                  nextDisabled ? 'text-slate-500' : 'text-white'
                }`}
              >
                {nextLabel}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}
