import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useOnboardingStore } from '../../stores/onboarding'
import { matchProPlayers } from '../../data/pro-players'

const TOTAL = 10
const STEP = 9

export default function StepProPlayerScreen() {
  const { position, playingStyle, bodyType, proPlayerSlug, setProPlayerSlug } = useOnboardingStore()
  const router = useRouter()

  const matchedPlayers = matchProPlayers(position, playingStyle, bodyType)

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <View className="flex-1 px-6 pt-4">
        {/* Progress */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="arrow-back" size={20} color="#64748B" />
          </TouchableOpacity>
          <View className="flex-1 h-1 bg-coach-border rounded-full mx-3">
            <View className="h-full bg-brand-gold rounded-full" style={{ width: `${(STEP / TOTAL) * 100}%` }} />
          </View>
          <Text className="text-slate-500 text-xs font-poppins">{STEP}/{TOTAL}</Text>
        </View>

        <View className="flex-row items-center gap-2 mb-1">
          <View className="w-2 h-2 bg-brand-gold rounded-full" />
          <Text className="text-brand-gold text-xs font-poppins-semibold uppercase tracking-wider">
            AI Player Match
          </Text>
        </View>

        <Text className="text-slate-900 text-3xl font-poppins-semibold mb-1">You play like...</Text>
        <Text className="text-slate-400 text-sm font-poppins mb-5">
          Based on your position, style, and build — pick who you identify with most.
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="gap-3 pb-4">
            {matchedPlayers.map((player) => {
              const selected = proPlayerSlug === player.slug
              return (
                <TouchableOpacity
                  key={player.slug}
                  onPress={() => setProPlayerSlug(player.slug)}
                  className={`rounded-2xl p-4 border ${
                    selected
                      ? 'border-brand-gold bg-brand-gold/10'
                      : 'border-coach-border bg-coach-card'
                  }`}
                >
                  <View className="flex-row items-start mb-3">
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2 mb-0.5 flex-wrap">
                        <Text className={`text-lg font-poppins-semibold ${selected ? 'text-slate-900' : 'text-slate-800'}`}>
                          {player.name}
                        </Text>
                        <View className="bg-slate-100 px-2 py-0.5 rounded-full">
                          <Text className="text-slate-500 text-xs font-poppins-medium">{player.nationality}</Text>
                        </View>
                        {player.isAcademy && (
                          <View className="bg-brand-gold/20 px-2 py-0.5 rounded-full flex-row items-center gap-1">
                            <Ionicons name="star" size={10} color="#FBBF24" />
                            <Text className="text-brand-gold text-xs font-poppins-bold">Rising Star</Text>
                          </View>
                        )}
                      </View>
                      <Text className={`text-xs font-poppins-medium ${selected ? 'text-brand-gold' : 'text-slate-500'}`}>
                        {player.club}
                      </Text>
                    </View>
                    {selected && (
                      <Ionicons name="checkmark-circle" size={22} color="#FBBF24" />
                    )}
                  </View>

                  {/* Attributes */}
                  <View className="flex-row flex-wrap gap-2 mb-3">
                    {player.attributes.map((attr) => (
                      <View
                        key={attr}
                        className={`px-2 py-0.5 rounded-full border ${
                          selected
                            ? 'border-brand-gold/50 bg-brand-gold/10'
                            : 'border-coach-border bg-coach-bg'
                        }`}
                      >
                        <Text className={`text-xs font-poppins-medium ${selected ? 'text-brand-gold' : 'text-slate-400'}`}>
                          {attr}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Why they match */}
                  <Text className={`text-sm font-poppins leading-5 ${selected ? 'text-slate-700' : 'text-slate-500'}`}>
                    {player.matchReason}
                  </Text>
                </TouchableOpacity>
              )
            })}

            {matchedPlayers.length === 0 && (
              <View className="bg-coach-card border border-coach-border rounded-2xl p-6 items-center">
                <Ionicons name="star-outline" size={40} color="#FBBF24" style={{ marginBottom: 12 }} />
                <Text className="text-slate-900 font-poppins-bold text-center">You're one of a kind!</Text>
                <Text className="text-slate-400 text-sm font-poppins text-center mt-1">
                  Your combination of style and position is unique. Coach Alex will build your plan from scratch.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <TouchableOpacity
          onPress={() => proPlayerSlug && router.push('/onboarding/step-health')}
          disabled={!proPlayerSlug && matchedPlayers.length > 0}
          className={`rounded-2xl py-4 items-center flex-row justify-center gap-2 mb-4 ${
            proPlayerSlug || matchedPlayers.length === 0 ? 'bg-brand-blue' : 'bg-coach-card border border-coach-border'
          }`}
        >
          <Text className={`font-poppins-bold text-base ${proPlayerSlug || matchedPlayers.length === 0 ? 'text-white' : 'text-slate-600'}`}>
            {matchedPlayers.length === 0 ? 'Continue' : 'This is me →'}
          </Text>
          {(proPlayerSlug || matchedPlayers.length === 0) && (
            <Ionicons name="arrow-forward" size={18} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
