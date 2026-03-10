import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const router = useRouter()

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'socceraicoach://auth/reset-password',
    })
    setLoading(false)
    if (error) {
      Alert.alert('Error', error.message)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <SafeAreaView className="flex-1 bg-coach-bg justify-center items-center px-6">
        <View className="w-20 h-20 bg-brand-blue/10 border border-brand-blue/30 rounded-3xl items-center justify-center mb-6">
          <Ionicons name="mail-outline" size={40} color="#2563EB" />
        </View>
        <Text className="text-slate-900 text-2xl font-poppins-semibold text-center mb-3">Check Your Email</Text>
        <Text className="text-slate-400 text-center text-sm mb-8 leading-6">
          We sent a password reset link to {email}
        </Text>
        <TouchableOpacity
          onPress={() => router.replace('/auth/login')}
          className="bg-brand-blue rounded-2xl py-4 px-10"
        >
          <Text className="text-white font-poppins-bold text-base">Back to Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <View className="flex-1 px-6 pt-4">
        <TouchableOpacity onPress={() => router.back()} className="mb-8 w-10 h-10 items-center justify-center">
          <Ionicons name="arrow-back" size={22} color="#64748B" />
        </TouchableOpacity>

        <Text className="text-slate-900 text-3xl font-poppins-semibold mb-1">Reset Password</Text>
        <Text className="text-slate-400 text-sm mb-8">Enter your email and we'll send you a reset link.</Text>

        <View className="bg-coach-card border border-coach-border rounded-2xl px-4 py-4 mb-6">
          <Text className="text-slate-500 text-xs mb-1">EMAIL</Text>
          <TextInput
            className="text-slate-900 text-base"
            placeholder="your@email.com"
            placeholderTextColor="#475569"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity
          onPress={handleReset}
          disabled={loading}
          className="bg-brand-blue rounded-2xl py-4 items-center"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-poppins-bold text-base">Send Reset Link</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
