import { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useOnboardingStore } from '../../stores/onboarding'

const TOTAL = 10
const STEP = 7

export default function StepGoalsInputScreen() {
  const { goalsText, setGoalsText } = useOnboardingStore()
  const router = useRouter()
  const MAX = 500

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-4">
          {/* Progress */}
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <Ionicons name="arrow-back" size={20} color="#64748B" />
            </TouchableOpacity>
            <View className="flex-1 h-1 bg-coach-border rounded-full mr-3">
              <View className="h-full bg-brand-blue rounded-full" style={{ width: `${(STEP / TOTAL) * 100}%` }} />
            </View>
            <Text className="text-slate-500 text-xs">{STEP}/{TOTAL}</Text>
          </View>

          <Text className="text-slate-900 text-3xl font-poppins-semibold mb-1">YOUR GOALS</Text>

          {/* Icon */}
          <View className="w-12 h-12 bg-brand-blue/20 rounded-2xl items-center justify-center mb-4">
            <Ionicons name="locate" size={24} color="#2563EB" />
          </View>

          <Text className="text-slate-900 text-2xl font-poppins-semibold mb-2">What's Your Goal?</Text>
          <Text className="text-slate-400 text-sm mb-6 leading-5">
            Tell us what you want to achieve in soccer. Be specific — our AI uses this to build your roadmap.
          </Text>

          {/* Text input */}
          <View className="bg-coach-card border border-coach-border rounded-2xl p-4 flex-1 mb-4">
            <TextInput
              className="text-slate-900 text-base flex-1"
              placeholder="I want to make the varsity team this season and improve my first touch and dribbling under pressure..."
              placeholderTextColor="#94A3B8"
              value={goalsText}
              onChangeText={(t) => t.length <= MAX && setGoalsText(t)}
              multiline
              textAlignVertical="top"
              style={{ minHeight: 120 }}
            />
          </View>

          <Text className="text-slate-600 text-xs text-right mb-6">
            {goalsText.length}/{MAX}
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/onboarding/step-where-play')}
            disabled={goalsText.length < 10}
            className={`rounded-2xl py-4 items-center flex-row justify-center gap-2 mb-4 ${
              goalsText.length >= 10 ? 'bg-brand-blue' : 'bg-slate-100 border border-slate-200'
            }`}
          >
            <Ionicons
              name="sparkles"
              size={18}
              color={goalsText.length >= 10 ? 'white' : '#475569'}
            />
            <Text className={`font-poppins-bold text-base ${goalsText.length >= 10 ? 'text-white' : 'text-slate-600'}`}>
              Analyze My Goals
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
