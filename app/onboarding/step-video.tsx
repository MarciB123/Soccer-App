import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const TOTAL = 20
const STEP = 19

export default function StepVideoScreen() {
  const router = useRouter()

  const handleSelectVideo = () => {
    Alert.alert(
      'Select Video',
      'Choose a source for your match footage.',
      [
        { text: 'Camera Roll', onPress: () => router.replace('/onboarding/profile-ready') },
        { text: 'Record Now', onPress: () => router.replace('/onboarding/profile-ready') },
        { text: 'Cancel', style: 'cancel' },
      ]
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <View className="flex-1 px-6 pt-4">
        {/* Progress */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={20} color="#64748B" />
          </TouchableOpacity>
          <View className="flex-1 h-1 bg-coach-border rounded-full mr-3">
            <View className="h-full bg-brand-blue rounded-full" style={{ width: `${(STEP / TOTAL) * 100}%` }} />
          </View>
          <Text className="text-slate-500 text-xs">{STEP}/{TOTAL}</Text>
        </View>

        <Text className="text-slate-900 text-3xl font-poppins-semibold mb-5">VIDEO ANALYSIS</Text>

        {/* Video upload card */}
        <View className="bg-coach-card border border-coach-border rounded-2xl p-8 items-center mb-6">
          <View className="w-16 h-16 bg-coach-bg border border-coach-border rounded-2xl items-center justify-center mb-4">
            <Ionicons name="scan" size={32} color="#64748B" />
          </View>
          <Text className="text-slate-900 text-xl font-poppins-semibold text-center mb-2">
            Submit Your Latest Match
          </Text>
          <Text className="text-slate-400 text-sm text-center mb-1">
            So we can finalize your training program
          </Text>
          <Text className="text-slate-600 text-xs text-center mb-5">
            (Don't worry, you can set this up later)
          </Text>
          <TouchableOpacity
            onPress={handleSelectVideo}
            className="bg-white rounded-full px-8 py-3"
          >
            <Text className="text-black font-poppins-bold">Select Video</Text>
          </TouchableOpacity>
        </View>

        {/* How it works */}
        <View className="bg-coach-card border border-coach-border rounded-2xl p-5">
          <View className="flex-row items-center gap-2 mb-4">
            <View className="w-8 h-8 bg-brand-blue/20 rounded-lg items-center justify-center">
              <Ionicons name="sparkles" size={16} color="#2563EB" />
            </View>
            <Text className="text-white font-poppins-bold">How It Works</Text>
          </View>

          {[
            { num: '1', title: 'Upload', sub: 'Select your match or training footage' },
            { num: '2', title: 'AI Analysis', sub: 'Frame-by-frame technique breakdown' },
            { num: '3', title: 'Get Insights', sub: 'Personalized improvement recommendations' },
          ].map((item, idx) => (
            <View key={item.num} className="flex-row items-start">
              <View className="items-center mr-3">
                <View className="w-7 h-7 bg-brand-blue rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-poppins-bold">{item.num}</Text>
                </View>
                {idx < 2 && <View className="w-px h-6 bg-coach-border mt-1" />}
              </View>
              <View className="pb-4">
                <Text className="text-white font-poppins-semibold text-sm">{item.title}</Text>
                <Text className="text-slate-500 text-xs">{item.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="flex-1" />

        <TouchableOpacity
          onPress={handleSelectVideo}
          className="bg-brand-blue rounded-2xl py-4 items-center flex-row justify-center gap-2 mb-3"
        >
          <Ionicons name="cloud-upload-outline" size={18} color="white" />
          <Text className="text-white font-poppins-bold text-base">Upload Video</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace('/onboarding/profile-ready')}
          className="items-center py-2 mb-4"
        >
          <Text className="text-slate-500 text-sm">Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
