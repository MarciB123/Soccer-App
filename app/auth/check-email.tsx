import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

export default function CheckEmailScreen() {
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-coach-bg justify-center items-center px-6">
      <View className="w-20 h-20 bg-brand-blue/10 border border-brand-blue/30 rounded-3xl items-center justify-center mb-6">
        <Ionicons name="mail-outline" size={40} color="#2563EB" />
      </View>
      <Text className="text-slate-900 text-2xl font-poppins-semibold text-center mb-3">Check Your Email</Text>
      <Text className="text-slate-400 text-center text-sm mb-8 leading-6">
        We sent you a verification link. Click it to activate your account, then come back to sign in.
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
