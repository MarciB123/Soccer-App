import { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'

type Status = 'verifying' | 'ready' | 'submitting' | 'success' | 'error'

export default function ResetPasswordScreen() {
  const { token_hash, type } = useLocalSearchParams<{ token_hash: string; type: string }>()
  const router = useRouter()
  const [status, setStatus] = useState<Status>('verifying')
  const [errorMessage, setErrorMessage] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const confirmRef = useRef<TextInput>(null)

  useEffect(() => {
    if (!token_hash || !type) {
      setStatus('error')
      setErrorMessage('Invalid or expired reset link. Please request a new one.')
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
        setStatus('ready')
      }
    })
  }, [token_hash, type])

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill in both fields.')
      return
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.')
      return
    }
    if (password.length < 8) {
      Alert.alert('Password Too Short', 'Password must be at least 8 characters.')
      return
    }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      Alert.alert('Weak Password', 'Password must include at least one uppercase letter and one number.')
      return
    }

    setStatus('submitting')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setStatus('ready')
      Alert.alert('Error', error.message)
    } else {
      // Sign out so the auth guard doesn't auto-redirect to home before user sees success
      await supabase.auth.signOut()
      setStatus('success')
    }
  }

  if (status === 'verifying') {
    return (
      <SafeAreaView className="flex-1 bg-coach-bg justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-slate-500 font-poppins mt-4">Verifying reset link...</Text>
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
          Link Expired
        </Text>
        <Text className="text-slate-400 text-center text-sm mb-8 leading-6">
          {errorMessage}
        </Text>
        <TouchableOpacity
          onPress={() => router.replace('/auth/forgot-password')}
          className="bg-brand-blue rounded-2xl py-4 px-10"
        >
          <Text className="text-white font-poppins-bold text-base">Request New Link</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  if (status === 'success') {
    return (
      <SafeAreaView className="flex-1 bg-coach-bg justify-center items-center px-6">
        <View className="w-20 h-20 bg-green-100 rounded-3xl items-center justify-center mb-6">
          <Ionicons name="checkmark-circle" size={40} color="#16A34A" />
        </View>
        <Text className="text-slate-900 text-2xl font-poppins-semibold text-center mb-3">
          Password Updated!
        </Text>
        <Text className="text-slate-400 text-center text-sm mb-8 leading-6">
          Your password has been changed successfully.
        </Text>
        <TouchableOpacity
          onPress={() => router.replace('/auth/login')}
          className="bg-brand-blue rounded-2xl py-4 px-10"
        >
          <Text className="text-white font-poppins-bold text-base">Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  // status === 'ready' or 'submitting' — show the password form
  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-4">
          <Text className="text-slate-900 text-3xl font-poppins-semibold mb-1">New Password</Text>
          <Text className="text-slate-400 text-sm font-poppins mb-8">
            Choose a strong password for your account.
          </Text>

          <View className="gap-3 mb-6">
            <TouchableOpacity
              activeOpacity={1}
              className="bg-coach-card border border-coach-border rounded-2xl px-4 py-3 flex-row items-center"
            >
              <Ionicons name="lock-closed-outline" size={18} color="#475569" style={{ marginRight: 10 }} />
              <TextInput
                className="text-slate-900 text-base font-poppins flex-1"
                placeholder="New password (8+ chars, 1 uppercase, 1 number)"
                placeholderTextColor="#475569"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
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
                className="text-slate-900 text-base font-poppins flex-1"
                placeholder="Confirm new password"
                placeholderTextColor="#475569"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={18} color="#475569" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={status === 'submitting'}
            className="bg-brand-blue rounded-2xl py-4 items-center"
          >
            {status === 'submitting' ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-poppins-semibold text-base">Update Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
