import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Purchases from 'react-native-purchases'

export default function PaywallDiscountScreen() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePurchase = async () => {
    setLoading(true)
    try {
      const offerings = await Purchases.getOfferings()
      const pkg = offerings.current?.availablePackages[0]
      if (pkg) {
        await Purchases.purchasePackage(pkg)
        router.replace('/(tabs)/home')
      }
    } catch (error: any) {
      if (!error?.userCancelled) {
        Alert.alert('Purchase Failed', 'Please try again or restore a previous purchase.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-coach-bg justify-between px-6">
      {/* Close */}
      <View className="flex-row justify-end pt-4">
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/home')}
          className="w-9 h-9 bg-coach-card border border-coach-border rounded-full items-center justify-center"
        >
          <Ionicons name="close" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center items-center">
        {/* Header */}
        <Text className="text-slate-900 text-3xl font-poppins-semibold text-center mb-2">
          You've been selected
        </Text>

        {/* Stars */}
        <View className="flex-row mb-1 gap-1">
          {[1,2,3,4,5].map((s) => <Ionicons key={s} name="star" size={22} color="#FACC15" />)}
        </View>
        <Text className="text-slate-900 text-2xl font-poppins-semibold mb-1">4.8</Text>
        <Text className="text-slate-400 text-xs mb-8">Based on over 1,500 reviews</Text>

        {/* App icon */}
        <View className="w-40 h-40 bg-coach-card border-4 border-white rounded-[32px] items-center justify-center mb-8">
          <Ionicons name="football" size={80} color="#2563EB" />
        </View>

        {/* Discount message */}
        <Text className="text-slate-600 text-sm text-center leading-6 mb-6 px-4">
          Based on your answers, we would like to give you a{' '}
          <Text className="text-white font-poppins-bold">75% discount</Text>. We're offering this
          discount to encourage winners to use our platform.{' '}
          <Text className="text-white font-poppins-bold">Train Smarter, Play Harder.</Text>
        </Text>

        {/* Price */}
        <View className="items-center mb-8">
          <Text className="text-slate-500 text-base line-through">$59.99/Year</Text>
          <Text className="text-slate-900 text-4xl font-poppins-semibold">$14.99</Text>
          <Text className="text-slate-400 text-sm">/Year · $1.25 per month</Text>
        </View>
      </View>

      {/* Bottom */}
      <View className="pb-6">
        <TouchableOpacity
          onPress={handlePurchase}
          disabled={loading}
          className="bg-brand-blue rounded-2xl py-4 items-center mb-4"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-poppins-semibold text-base">Continue</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center gap-6">
          <TouchableOpacity onPress={async () => {
            setLoading(true)
            try {
              const info = await Purchases.restorePurchases()
              if (info.entitlements.active['premium']) {
                router.replace('/(tabs)/home')
              }
            } catch (e) {}
            setLoading(false)
          }}>
            <Text className="text-slate-500 text-xs">Restore Purchases</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://socceraicoach.app/terms')}>
            <Text className="text-slate-500 text-xs">Terms</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://socceraicoach.app/privacy')}>
            <Text className="text-slate-500 text-xs">Privacy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
