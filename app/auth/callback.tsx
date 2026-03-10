import { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'

export default function AuthCallbackScreen() {
  const { token_hash, type } = useLocalSearchParams<{ token_hash: string; type: string }>()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!token_hash || !type) {
      setStatus('error')
      setErrorMessage('Invalid or expired verification link. Please request a new one.')
      return
    }

    supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    }).then(({ error }) => {
      if (error) {
        setStatus('error')
        setErrorMessage(error.message)
      } else {
        setStatus('success')
        // onAuthStateChange in _layout.tsx picks up the session and redirects to home
      }
    })
  }, [token_hash, type])

  if (status === 'loading') {
    return (
      <SafeAreaView className="flex-1 bg-coach-bg justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-slate-500 font-poppins mt-4">Verifying your email...</Text>
      </SafeAreaView>
    )
  }

  if (status === 'error') {
    return (
      <SafeAreaView className="flex-1 bg-coach-bg justify-center items-center px-6">
        <View className="w-20 h-20 bg-red-100 rounded-3xl items-center justify-center mb-6">
          <Ionicons name="close-circle" size={40} color="#EF4444" />
        </View>
        <Text className="text-slate-900 text-2xl font-poppins-semibold text-center mb-3">
          Verification Failed
        </Text>
        <Text className="text-slate-400 text-center text-sm mb-8 leading-6">
          {errorMessage}
        </Text>
        <TouchableOpacity
          onPress={() => router.replace('/auth/login')}
          className="bg-brand-blue rounded-2xl py-4 px-10"
        >
          <Text className="text-white font-poppins-bold text-base">Go to Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-coach-bg justify-center items-center px-6">
      <View className="w-20 h-20 bg-green-100 rounded-3xl items-center justify-center mb-6">
        <Ionicons name="checkmark-circle" size={40} color="#16A34A" />
      </View>
      <Text className="text-slate-900 text-2xl font-poppins-semibold text-center mb-3">
        Email Verified!
      </Text>
      <Text className="text-slate-400 text-center text-sm leading-6">
        You're all set. Taking you to your training...
      </Text>
    </SafeAreaView>
  )
}
