import { useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../lib/supabase'
import { useOnboardingStore } from '../stores/onboarding'

// Apple Sign In — only available on iOS native builds (not Expo Go or web)
// Required by App Store when offering any social login
// TODO: Before App Store submission, enable Sign In with Apple capability in
//       App Store Connect and configure Supabase Auth > Apple provider with:
//       - Service ID (com.yourapp.signin)
//       - Apple Key ID + private key
import * as AppleAuthentication from 'expo-apple-authentication'

const FEATURES = [
  {
    icon: 'flash',
    iconColor: '#FBBF24',
    iconBg: '#451A03',
    title: 'AI-Powered Coaching',
    description: 'Your personal coach available 24/7. Get position-specific advice, drill breakdowns, and real-time motivation.',
  },
  {
    icon: 'locate',
    iconColor: '#2563EB',
    iconBg: '#1E3A6E',
    title: 'Personalized Training Plans',
    description: 'Custom weekly drill programs built for your position, body type, and skill level. Adapts as you improve.',
  },
  {
    icon: 'trending-up',
    iconColor: '#FBBF24',
    iconBg: '#3B2000',
    title: 'Performance Analytics',
    description: 'Track sessions, monitor your streak, and measure real improvement over weeks and months.',
  },
  {
    icon: 'nutrition',
    iconColor: '#16A34A',
    iconBg: '#052e16',
    title: 'Nutrition Guidance',
    description: 'Pre and post-training fuel plans optimized for your position, body type, and training intensity.',
  },
  {
    icon: 'trophy',
    iconColor: '#FBBF24',
    iconBg: '#3B2000',
    title: 'Daily Challenges',
    description: 'Complete daily soccer challenges, build streaks, and level up your game one session at a time.',
  },
]

export default function LandingScreen() {
  const router = useRouter()
  const { position } = useOnboardingStore()

  // Fresh app open (no onboarding data) → start at step 1
  // After onboarding (position is set) → show this sales page
  useEffect(() => {
    if (!position) {
      router.replace('/onboarding/step-preview-1')
    }
  }, [])

  const handleGetStarted = () => {
    router.push('/auth/signup')
  }

  const handleSignIn = () => {
    router.push('/auth/login')
  }

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken!,
        nonce: credential.user,
      })
      if (error) throw error
      // Auth guard in _layout.tsx handles redirect automatically
    } catch (e: any) {
      if (e.code === 'ERR_REQUEST_CANCELED') return
      Alert.alert('Apple Sign In Failed', e.message || 'Something went wrong. Try signing in with email.')
    }
  }

  const isAppleAvailable = Platform.OS === 'ios'

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <ScrollView
        contentContainerStyle={{ paddingBottom: isAppleAvailable ? 180 : 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-slate-400 text-sm font-poppins-medium">Unlock Your Potential</Text>
          <View className="flex-row items-center justify-between mt-1">
            <Text className="text-slate-900 text-3xl font-poppins-semibold tracking-tight">SOCCER AI</Text>
            <View className="bg-brand-gold px-3 py-1 rounded-full flex-row items-center gap-1">
              <Ionicons name="flash" size={12} color="#000" />
              <Text className="text-black text-xs font-poppins-bold">PRO</Text>
            </View>
          </View>
        </View>

        {/* Hero Card */}
        <View className="mx-6 mb-6 rounded-3xl overflow-hidden bg-brand-blue p-6">
          <View className="w-16 h-16 bg-white/20 rounded-2xl items-center justify-center mb-4">
            <Ionicons name="trophy" size={32} color="white" />
          </View>
          <Text className="text-white text-2xl font-poppins-semibold mb-2">Dominate the Pitch</Text>
          <Text className="text-blue-100 text-sm font-poppins leading-6">
            Join elite players using AI to perfect technique, build fitness, and crush the competition
          </Text>
        </View>

        {/* Features */}
        <View className="px-6 mb-6">
          <Text className="text-slate-900 text-xl font-poppins-bold mb-4">What You Get</Text>
          {FEATURES.map((feature) => (
            <View
              key={feature.title}
              className="bg-coach-card rounded-2xl p-4 mb-3 flex-row items-start"
            >
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mr-3 mt-0.5 flex-shrink-0"
                style={{ backgroundColor: feature.iconBg }}
              >
                <Ionicons name={feature.icon as any} size={20} color={feature.iconColor} />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 font-poppins-bold text-sm mb-1">{feature.title}</Text>
                <Text className="text-slate-400 text-xs font-poppins leading-4">{feature.description}</Text>
              </View>
              <Ionicons name="checkmark-circle" size={20} color="#FBBF24" style={{ marginLeft: 8, marginTop: 2 }} />
            </View>
          ))}
        </View>

        {/* Social Proof */}
        <View className="px-6 mb-6">
          <Text className="text-slate-900 text-xl font-poppins-bold text-center mb-3">Built for Serious Players</Text>
          <View className="bg-coach-card rounded-2xl p-4 flex-row justify-around">
            <View className="items-center">
              <Text className="text-brand-blue text-xl font-poppins-semibold">15+</Text>
              <Text className="text-slate-400 text-xs font-poppins text-center">Positions</Text>
            </View>
            <View className="w-px bg-coach-border" />
            <View className="items-center">
              <Text className="text-brand-blue text-xl font-poppins-semibold">98%</Text>
              <Text className="text-slate-400 text-xs font-poppins text-center">See Improvement</Text>
            </View>
            <View className="w-px bg-coach-border" />
            <View className="items-center">
              <Text className="text-brand-gold text-xl font-poppins-semibold">7-Day</Text>
              <Text className="text-slate-400 text-xs font-poppins text-center">Free Trial</Text>
            </View>
          </View>
        </View>

        {/* Pricing */}
        <View className="px-6 mb-4">
          <Text className="text-slate-900 text-xl font-poppins-bold text-center mb-3">Start Your Journey</Text>
          <View className="bg-coach-card border-2 border-brand-blue rounded-2xl p-5">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-slate-900 font-poppins-bold text-lg">Soccer AI Pro</Text>
              <View className="bg-brand-gold px-3 py-1 rounded-full">
                <Text className="text-black text-xs font-poppins-bold">MOST POPULAR</Text>
              </View>
            </View>
            <Text className="text-brand-blue text-4xl font-poppins-semibold mb-1">
              $12.99<Text className="text-xl font-poppins-semibold text-slate-400">/month</Text>
            </Text>
            <Text className="text-brand-gold text-sm font-poppins-medium mb-4">7-day free trial · Cancel anytime</Text>
            {[
              'Unlimited AI coach conversations',
              'Personalized weekly training plans',
              'Position-specific nutrition guidance',
              'Performance analytics & streaks',
              'Daily challenges & achievements',
            ].map((item) => (
              <View key={item} className="flex-row items-center mb-2">
                <Ionicons name="checkmark-circle" size={16} color="#FBBF24" />
                <Text className="text-slate-600 text-sm font-poppins ml-2">{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-coach-bg border-t border-coach-border px-6 pt-4 pb-8">
        <TouchableOpacity
          onPress={handleGetStarted}
          className="bg-brand-blue rounded-2xl py-4 flex-row items-center justify-center gap-2 mb-3"
        >
          <Text className="text-white font-poppins-bold text-base">Get Started — It's Free</Text>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignIn} className="items-center py-2">
          <Text className="text-slate-400 text-sm font-poppins">
            Already have an account? <Text className="text-brand-blue font-poppins-semibold">Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
