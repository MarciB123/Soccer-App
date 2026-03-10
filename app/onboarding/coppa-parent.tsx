import { useState } from 'react'
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
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useOnboardingStore } from '../../stores/onboarding'
import { useAuthStore } from '../../stores/auth'
import { supabase } from '../../lib/supabase'

export default function COPPAParentScreen() {
  const [loading, setLoading] = useState(false)
  const { parentEmail, setParentEmail } = useOnboardingStore()
  const { user } = useAuthStore()
  const router = useRouter()

  const handleSubmit = async () => {
    if (!parentEmail || !parentEmail.includes('@')) {
      Alert.alert('Error', 'Please enter a valid parent email address.')
      return
    }
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase.from('parent_consents').insert({
        child_user_id: user.id,
        parent_email: parentEmail,
        consent_type: 'coppa_initial',
      })
      if (error) throw error

      await supabase.functions.invoke('coppa-consent-confirm', {
        body: { action: 'send_consent_email', childUserId: user.id, parentEmail },
      })

      router.replace('/onboarding/coppa-pending')
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-4">
          <TouchableOpacity onPress={() => router.back()} className="mb-8 w-10 h-10 items-center justify-center">
            <Ionicons name="arrow-back" size={22} color="#64748B" />
          </TouchableOpacity>

          <View className="w-16 h-16 bg-brand-blue/10 border border-brand-blue/30 rounded-3xl items-center justify-center mb-6">
            <Ionicons name="hand-right-outline" size={32} color="#2563EB" />
          </View>

          <Text className="text-slate-900 text-3xl font-poppins-semibold mb-3">Parent Approval Needed</Text>
          <Text className="text-slate-400 text-sm mb-6 leading-6">
            Since you're under 13, a parent or guardian must approve your account before you can start training.
          </Text>

          {/* What we collect */}
          <View className="bg-coach-card border border-coach-border rounded-2xl p-4 mb-6">
            <Text className="text-slate-600 text-sm font-poppins-semibold mb-2">We will collect:</Text>
            <Text className="text-slate-400 text-xs mb-1">• Your soccer position &amp; skill level</Text>
            <Text className="text-slate-400 text-xs mb-1">• Training progress and session data</Text>
            <Text className="text-slate-400 text-xs mb-1">• AI coach chat messages</Text>
            <Text className="text-slate-500 text-xs mt-2">
              We never sell your data or share it with third parties.
            </Text>
          </View>

          <Text className="text-slate-400 text-xs font-poppins-semibold uppercase tracking-wider mb-2">
            Parent/Guardian Email
          </Text>
          <View className="bg-coach-card border border-coach-border rounded-2xl px-4 py-4 mb-8">
            <TextInput
              className="text-white text-base"
              placeholder="parent@email.com"
              placeholderTextColor="#475569"
              value={parentEmail}
              onChangeText={setParentEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View className="flex-1" />

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className="bg-brand-blue rounded-2xl py-4 items-center mb-4"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-poppins-bold text-base">Send Consent Request</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
