import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../../stores/auth'

export default function COPPAPendingScreen() {
  const signOut = useAuthStore((s) => s.signOut)

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <View className="flex-1 px-6 pt-16 items-center">
        {/* Icon */}
        <View className="w-20 h-20 bg-brand-blue/10 border border-brand-blue/30 rounded-3xl items-center justify-center mb-8">
          <Ionicons name="time-outline" size={40} color="#2563EB" />
        </View>

        <Text className="text-slate-900 text-2xl font-poppins-semibold text-center mb-3">
          Waiting for Parent Approval
        </Text>
        <Text className="text-slate-400 text-sm text-center leading-6 mb-8">
          We sent a consent email to your parent or guardian. Ask them to check their inbox and click the approval link.
        </Text>

        {/* Steps */}
        <View className="bg-coach-card border border-coach-border rounded-2xl p-5 w-full mb-8">
          <Text className="text-slate-600 text-sm font-poppins-semibold mb-4">What happens next:</Text>
          {[
            { icon: 'mail-outline', text: 'Parent receives consent email' },
            { icon: 'checkmark-circle-outline', text: 'Parent clicks the approval link' },
            { icon: 'football-outline', text: 'You can log in and start training!' },
          ].map((item, idx) => (
            <View key={idx} className="flex-row items-center gap-3 mb-3 last:mb-0">
              <View className="w-8 h-8 bg-brand-blue/10 rounded-full items-center justify-center">
                <Ionicons name={item.icon as any} size={16} color="#2563EB" />
              </View>
              <Text className="text-slate-400 text-sm flex-1">{item.text}</Text>
            </View>
          ))}
        </View>

        <View className="flex-1" />

        <TouchableOpacity
          onPress={signOut}
          className="border border-coach-border rounded-2xl py-3 px-8 mb-6"
        >
          <Text className="text-slate-500">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
