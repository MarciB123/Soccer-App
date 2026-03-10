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
  ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'
import { useOnboardingStore } from '../../stores/onboarding'

export default function SignupScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const onboarding = useOnboardingStore()

  const emailRef = useRef<any>(null)
  const passwordRef = useRef<TextInput>(null)
  const confirmRef = useRef<TextInput>(null)

  // Reads actual DOM value on web (handles browser autofill)
  const getDOMValue = (nativeID: string, fallback: string) => {
    if (Platform.OS === 'web') {
      const el = document.getElementById(nativeID) as HTMLInputElement | null
      return el?.value || fallback
    }
    return fallback
  }

  const handleSignup = async () => {
    const emailVal = getDOMValue('signup-email', email).trim()
    const passwordVal = getDOMValue('signup-password', password)
    const confirmVal = getDOMValue('signup-confirm', confirmPassword)

    if (!emailVal || !passwordVal || !confirmVal) {
      Alert.alert('Missing Fields', 'Please fill in all fields.')
      return
    }
    if (passwordVal !== confirmVal) {
      Alert.alert('Password Mismatch', 'Passwords do not match.')
      return
    }
    if (passwordVal.length < 8) {
      Alert.alert('Password Too Short', 'Password must be at least 8 characters.')
      return
    }
    if (!/[A-Z]/.test(passwordVal) || !/[0-9]/.test(passwordVal)) {
      Alert.alert('Weak Password', 'Password must include at least one uppercase letter and one number.')
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: emailVal,
      password: passwordVal,
      options: { emailRedirectTo: 'socceraicoach://auth/callback' },
    })

    if (error) {
      setLoading(false)
      if (
        error.message.toLowerCase().includes('already registered') ||
        error.message.toLowerCase().includes('already exists') ||
        error.message.toLowerCase().includes('already')
      ) {
        Alert.alert(
          'Account Already Exists',
          'You already have an account with this email. Please sign in instead.',
          [
            { text: 'Sign In', onPress: () => router.replace('/auth/login') },
            { text: 'Cancel', style: 'cancel' },
          ]
        )
      } else {
        Alert.alert('Sign Up Failed', error.message)
      }
      return
    }

    // Save all onboarding data to profile
    const userId = data?.user?.id
    if (userId) {
      await supabase.from('profiles').upsert({
        id: userId,
        first_name: onboarding.firstName || null,
        age: onboarding.age || null,
        position: onboarding.position || null,
        body_type: onboarding.bodyType || null,
        skill_level: onboarding.skillLevel || null,
        training_days_per_week: onboarding.trainingDaysPerWeek || 3,
        goals: onboarding.goals || [],
        playing_style: onboarding.playingStyle || null,
        where_plays_category: onboarding.wherePlaysCategory || null,
        where_plays_specific: onboarding.wherePlaysSpecific || null,
        pro_player_slug: onboarding.proPlayerSlug || null,
        updated_at: new Date().toISOString(),
      })
    }

    setLoading(false)

    // If email confirmation is enabled, go to check-email
    // If disabled (dev mode), auth guard will redirect to home
    if (data?.user?.identities?.length === 0) {
      // User already exists but unconfirmed — treat as existing account
      Alert.alert(
        'Account Already Exists',
        'You already have an account with this email. Please sign in instead.',
        [{ text: 'Sign In', onPress: () => router.replace('/auth/login') }]
      )
    } else if (data?.session) {
      // Immediately authenticated (email confirmation disabled)
      router.replace('/onboarding/generating-plan')
    } else {
      // Email confirmation required
      router.push('/auth/check-email')
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 pt-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mb-8 w-12 h-12 items-center justify-center"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={22} color="#64748B" />
            </TouchableOpacity>

            <Text className="text-slate-900 text-3xl font-poppins-semibold mb-1">Create Account</Text>
            <Text className="text-slate-400 text-sm font-poppins mb-8">
              One last step — create your account to start training.
            </Text>

            <View className="gap-3 mb-6">
              <TouchableOpacity
                activeOpacity={1}
                className="bg-coach-card border border-coach-border rounded-2xl px-4 py-3 flex-row items-center"
                onPress={() => emailRef.current?.focus()}
              >
                <Ionicons name="mail-outline" size={18} color="#475569" style={{ marginRight: 10 }} />
                <TextInput
                  ref={emailRef}
                  nativeID="signup-email"
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
                  nativeID="signup-password"
                  className="text-slate-900 text-base font-poppins flex-1"
                  placeholder="Password (8+ chars, 1 uppercase, 1 number)"
                  placeholderTextColor="#475569"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmRef.current?.focus()}
                  blurOnSubmit={false}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={18} color="#475569" />
                </TouchableOpacity>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={1}
                className="bg-coach-card border border-coach-border rounded-2xl px-4 py-3 flex-row items-center"
                onPress={() => confirmRef.current?.focus()}
              >
                <Ionicons name="lock-closed-outline" size={18} color="#475569" style={{ marginRight: 10 }} />
                <TextInput
                  ref={confirmRef}
                  nativeID="signup-confirm"
                  className="text-slate-900 text-base font-poppins flex-1"
                  placeholder="Confirm password"
                  placeholderTextColor="#475569"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                  returnKeyType="done"
                  onSubmitEditing={handleSignup}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={18} color="#475569" />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>

            <Text className="text-slate-600 text-xs font-poppins text-center mb-6 leading-5">
              By creating an account, you agree to our{' '}
              <Text className="text-brand-blue">Terms of Service</Text> and{' '}
              <Text className="text-brand-blue">Privacy Policy</Text>.
            </Text>

            <TouchableOpacity
              onPress={handleSignup}
              disabled={loading}
              className="bg-brand-blue rounded-2xl py-4 items-center mb-4"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-poppins-semibold text-base">Create Account</Text>
              )}
            </TouchableOpacity>

            <View className="flex-1" />

            <View className="flex-row justify-center pb-6">
              <Text className="text-slate-500 font-poppins">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace('/auth/login')}>
                <Text className="text-brand-blue font-poppins-semibold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
