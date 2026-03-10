import { useState, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/auth'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { setShowWelcomeBanner } = useAuthStore()
  const passwordRef = useRef<TextInput>(null)

  // Reads actual DOM value on web (handles browser autofill)
  const getDOMValue = (nativeID: string, fallback: string) => {
    if (Platform.OS === 'web') {
      const el = document.getElementById(nativeID) as HTMLInputElement | null
      return el?.value || fallback
    }
    return fallback
  }

  const handleLogin = async () => {
    const emailVal = getDOMValue('login-email', email).trim()
    const passwordVal = getDOMValue('login-password', password)

    if (!emailVal || !passwordVal) {
      Alert.alert('Missing Fields', 'Please enter your email and password.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: emailVal,
      password: passwordVal,
    })
    setLoading(false)

    if (error) {
      if (error.message.toLowerCase().includes('invalid login') || error.message.toLowerCase().includes('invalid credentials')) {
        Alert.alert('Incorrect Details', 'Email or password is wrong. Please try again.')
      } else if (error.message.toLowerCase().includes('email not confirmed')) {
        Alert.alert(
          'Email Not Confirmed',
          'Please check your inbox and confirm your email before signing in.',
          [{ text: 'OK' }]
        )
      } else {
        Alert.alert('Sign In Failed', error.message)
      }
    } else {
      setShowWelcomeBanner(true)
      // Auth guard in _layout.tsx handles redirect to home
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          <TouchableOpacity
            onPress={() => router.replace('/')}
            className="absolute top-4 left-6 w-12 h-12 items-center justify-center"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#64748B" />
          </TouchableOpacity>

          <View className="items-center mb-10">
            <View className="w-14 h-14 bg-brand-blue/10 border border-brand-blue/30 rounded-2xl items-center justify-center mb-3">
              <Ionicons name="football-outline" size={28} color="#2563EB" />
            </View>
            <Text className="text-slate-900 text-2xl font-poppins-semibold">Welcome Back</Text>
            <Text className="text-slate-400 text-sm font-poppins mt-1">Sign in to continue training</Text>
          </View>

          <View className="gap-3">
            <TouchableOpacity
              activeOpacity={1}
              className="bg-coach-card border border-coach-border rounded-2xl px-4 py-3 flex-row items-center"
            >
              <Ionicons name="mail-outline" size={18} color="#475569" style={{ marginRight: 10 }} />
              <TextInput
                nativeID="login-email"
                className="text-slate-900 text-base font-poppins flex-1"
                placeholder="Email address"
                placeholderTextColor="#475569"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              className="bg-coach-card border border-coach-border rounded-2xl px-4 py-3 flex-row items-center"
              onPress={() => passwordRef.current?.focus()}
            >
              <Ionicons name="lock-closed-outline" size={18} color="#475569" style={{ marginRight: 10 }} />
              <TextInput
                ref={passwordRef}
                nativeID="login-password"
                className="text-slate-900 text-base font-poppins flex-1"
                placeholder="Password"
                placeholderTextColor="#475569"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="current-password"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={18} color="#64748B" />
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className="bg-brand-blue rounded-2xl py-4 items-center mt-1"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-poppins-semibold text-base">Sign In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/auth/forgot-password')}
              className="items-center py-2"
            >
              <Text className="text-slate-400 text-sm font-poppins">Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-10">
            <Text className="text-slate-400 text-sm font-poppins">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/onboarding/step-preview-1')}>
              <Text className="text-brand-blue font-poppins-semibold text-sm">Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
