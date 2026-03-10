import { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Purchases from 'react-native-purchases'

const FEATURES = [
  {
    icon: 'videocam',
    iconColor: '#2563EB',
    iconBg: '#1E3A6E',
    title: 'AI Video Analysis',
    description: 'Upload match footage and get instant AI-powered technique breakdowns with personalized improvement suggestions.',
  },
  {
    icon: 'brain',
    iconColor: '#7C3AED',
    iconBg: '#2D1B69',
    title: '24/7 AI Soccer Coach',
    description: 'Chat with your personal AI coach trained on elite soccer expertise. Get answers to technique questions anytime.',
  },
  {
    icon: 'locate',
    iconColor: '#059669',
    iconBg: '#064E3B',
    title: 'Personalized Training Plans',
    description: 'Custom drill programs built specifically for your position, skill level, and soccer goals.',
  },
  {
    icon: 'trending-up',
    iconColor: '#D97706',
    iconBg: '#451A03',
    title: 'Performance Analytics',
    description: 'Track your progress with detailed metrics, improvement trends, and achievement milestones.',
  },
  {
    icon: 'trophy',
    iconColor: '#DC2626',
    iconBg: '#450A0A',
    title: 'Daily Challenges',
    description: 'Complete soccer challenges, earn points, build streaks, and share your victories.',
  },
]

const REVIEWS = [
  {
    name: 'Marcus T.',
    rating: 5,
    text: 'Soccer AI changed the way I train. The drill plans are actually built for my position — not just generic stuff. My first touch has improved massively.',
  },
  {
    name: 'Sofia R.',
    rating: 5,
    text: 'The AI coach feels like a real conversation. I asked about striker movement and got a full breakdown with drills. Worth every penny.',
  },
  {
    name: 'Jake M.',
    rating: 5,
    text: 'Went from JV to starting varsity in one season. The nutrition guidance and weekly plans made the difference.',
  },
]

export default function PaywallScreen() {
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual')
  const [loading, setLoading] = useState(false)
  const [reviewIdx, setReviewIdx] = useState(0)
  const router = useRouter()

  const handlePurchase = async () => {
    setLoading(true)
    try {
      const offerings = await Purchases.getOfferings()
      const offering = offerings.current
      if (!offering) {
        Alert.alert('Error', 'No offerings available. Please try again.')
        return
      }

      const pkg = offering.availablePackages.find((p) =>
        selectedPlan === 'annual' ? p.packageType === '$rc_annual' : p.packageType === '$rc_monthly'
      ) || offering.availablePackages[0]

      await Purchases.purchasePackage(pkg)
      // After subscription, user creates their account
      router.replace('/auth/signup')
    } catch (error: any) {
      if (error?.userCancelled) return
      // Show discount screen instead of just failing
      router.replace('/paywall-discount')
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async () => {
    setLoading(true)
    try {
      const info = await Purchases.restorePurchases()
      if (info.entitlements.active['premium']) {
        router.replace('/(tabs)/home')
      } else {
        Alert.alert('No Active Subscription', 'We could not find an active subscription to restore.')
      }
    } catch (e: any) {
      Alert.alert('Error', e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <ScrollView contentContainerStyle={{ paddingBottom: 220 }}>
        {/* Header */}
        <View className="px-6 pt-5 pb-4">
          <Text className="text-slate-400 text-sm">Unlock Your Potential</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-slate-900 text-3xl font-poppins-semibold tracking-tight">SOCCER AI</Text>
            <View className="bg-brand-blue px-3 py-1 rounded-full flex-row items-center gap-1">
              <Ionicons name="flash" size={12} color="white" />
              <Text className="text-white text-xs font-poppins-bold">PRO</Text>
            </View>
          </View>
        </View>

        {/* Hero */}
        <View className="mx-6 bg-brand-blue rounded-2xl p-6 mb-6">
          <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center mb-3">
            <Ionicons name="football-outline" size={28} color="white" />
          </View>
          <Text className="text-white text-2xl font-poppins-semibold mb-1">Dominate the Pitch</Text>
          <Text className="text-blue-100 text-sm leading-5">
            Join elite soccer players using AI to perfect their technique and crush the competition
          </Text>
        </View>

        {/* Features */}
        <View className="px-6 mb-5">
          <Text className="text-slate-900 text-xl font-poppins-bold mb-4">Premium Features</Text>
          {FEATURES.map((f) => (
            <View key={f.title} className="bg-coach-card border border-coach-border rounded-2xl p-4 mb-3 flex-row items-start">
              <View className="w-10 h-10 rounded-xl items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: f.iconBg }}>
                <Ionicons name={f.icon as any} size={20} color={f.iconColor} />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 font-poppins-bold text-sm mb-1">{f.title}</Text>
                <Text className="text-slate-500 text-xs leading-4">{f.description}</Text>
              </View>
              <Ionicons name="checkmark-circle" size={20} color="#16A34A" style={{ marginLeft: 8 }} />
            </View>
          ))}
        </View>

        {/* Social Proof */}
        <View className="px-6 mb-5">
          <Text className="text-slate-900 text-xl font-poppins-bold text-center mb-3">Trusted by Champions</Text>
          <View className="bg-coach-card border border-coach-border rounded-2xl p-4 flex-row justify-around mb-4">
            <View className="items-center">
              <Text className="text-brand-blue text-xl font-poppins-semibold">15K+</Text>
              <Text className="text-slate-400 text-xs text-center">Active Players</Text>
            </View>
            <View className="w-px bg-coach-border" />
            <View className="items-center">
              <Text className="text-brand-blue text-xl font-poppins-semibold">98%</Text>
              <Text className="text-slate-400 text-xs text-center">See Improvement</Text>
            </View>
            <View className="w-px bg-coach-border" />
            <View className="items-center">
              <View className="flex-row items-center gap-1">
                <Text className="text-yellow-400 text-xl font-poppins-semibold">4.9</Text>
                <Ionicons name="star" size={14} color="#FACC15" />
              </View>
              <Text className="text-slate-400 text-xs text-center">Rating</Text>
            </View>
          </View>

          {/* Review */}
          <View className="bg-coach-card border border-coach-border rounded-2xl p-5">
            <View className="flex-row mb-2 gap-0.5">
              {[1,2,3,4,5].map((s) => <Ionicons key={s} name="star" size={16} color="#FACC15" />)}
            </View>
            <Text className="text-slate-900 font-poppins-bold text-sm mb-2">{REVIEWS[reviewIdx].name}</Text>
            <Text className="text-slate-400 text-sm leading-5">{REVIEWS[reviewIdx].text}</Text>
            <View className="flex-row justify-center gap-2 mt-4">
              {REVIEWS.map((_, i) => (
                <TouchableOpacity key={i} onPress={() => setReviewIdx(i)}>
                  <View className={`w-2 h-2 rounded-full ${i === reviewIdx ? 'bg-brand-blue' : 'bg-slate-600'}`} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Pricing */}
        <View className="px-6">
          <Text className="text-slate-900 text-xl font-poppins-bold text-center mb-4">Start Your Journey</Text>

          {/* Annual */}
          <TouchableOpacity
            onPress={() => setSelectedPlan('annual')}
            className={`rounded-2xl p-4 mb-3 border-2 relative ${
              selectedPlan === 'annual' ? 'border-brand-blue bg-brand-blue/10' : 'border-coach-border bg-coach-card'
            }`}
          >
            <View className="absolute -top-3 right-4 bg-brand-blue rounded-full px-3 py-1">
              <Text className="text-white text-xs font-poppins-bold">50% OFF</Text>
            </View>
            <View className="flex-row items-center">
              <View className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                selectedPlan === 'annual' ? 'border-brand-blue bg-brand-blue' : 'border-slate-600'
              }`}>
                {selectedPlan === 'annual' && <Ionicons name="checkmark" size={12} color="white" />}
              </View>
              <View>
                <Text className="text-slate-900 font-poppins-bold">Year</Text>
                <Text className="text-slate-400 text-xs">$59.99</Text>
              </View>
              <View className="flex-1" />
              <Text className="text-slate-900 font-poppins-bold">$4.99/mo</Text>
            </View>
          </TouchableOpacity>

          {/* Monthly */}
          <TouchableOpacity
            onPress={() => setSelectedPlan('monthly')}
            className={`rounded-2xl p-4 border-2 ${
              selectedPlan === 'monthly' ? 'border-brand-blue bg-brand-blue/10' : 'border-coach-border bg-coach-card'
            }`}
          >
            <View className="flex-row items-center">
              <View className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                selectedPlan === 'monthly' ? 'border-brand-blue bg-brand-blue' : 'border-slate-600'
              }`}>
                {selectedPlan === 'monthly' && <Ionicons name="checkmark" size={12} color="white" />}
              </View>
              <View>
                <Text className="text-slate-900 font-poppins-bold">Month</Text>
                <Text className="text-slate-400 text-xs">Billed monthly</Text>
              </View>
              <View className="flex-1" />
              <Text className="text-slate-900 font-poppins-bold">$12.99/mo</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Fixed Bottom */}
      <View className="absolute bottom-0 left-0 right-0 bg-coach-bg border-t border-coach-border px-6 pt-4 pb-8">
        <TouchableOpacity
          onPress={handlePurchase}
          disabled={loading}
          className="bg-brand-blue rounded-2xl py-4 items-center mb-3"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-poppins-semibold text-base">
              Start 7-Day Free Trial →
            </Text>
          )}
        </TouchableOpacity>

        {/* Web dev bypass — hidden in production native build */}
        {Platform.OS === 'web' && (
          <TouchableOpacity
            onPress={() => router.replace('/auth/signup')}
            className="items-center py-2 mb-1"
          >
            <Text className="text-slate-500 text-xs font-poppins">
              [Testing] Skip subscription →
            </Text>
          </TouchableOpacity>
        )}

        <View className="flex-row justify-center gap-6">
          <TouchableOpacity onPress={handleRestore}>
            <Text className="text-slate-500 text-xs font-poppins">Restore Purchases</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://socceraicoach.app/terms')}>
            <Text className="text-slate-500 text-xs font-poppins">Terms</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://socceraicoach.app/privacy')}>
            <Text className="text-slate-500 text-xs font-poppins">Privacy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
