import { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, ScrollView, FlatList } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useOnboardingStore } from '../../stores/onboarding'
import {
  PLAY_CATEGORIES,
  searchClubs,
  type ClubCategory,
} from '../../data/us-clubs'

const TOTAL = 10
const STEP = 8

export default function StepWherePlayScreen() {
  const { wherePlaysCategory, wherePlaysSpecific, setWherePlaysCategory, setWherePlaysSpecific } = useOnboardingStore()
  const [query, setQuery] = useState(wherePlaysSpecific)
  const router = useRouter()

  const needsSearch = ['mls', 'youth_club', 'college'].includes(wherePlaysCategory)
  const noSearchNeeded = ['recreational', 'street', 'fun'].includes(wherePlaysCategory)

  const searchResults = needsSearch
    ? searchClubs(query, wherePlaysCategory as ClubCategory)
    : []

  const canContinue =
    wherePlaysCategory !== '' &&
    (noSearchNeeded || wherePlaysSpecific !== '' || query !== '')

  const handleContinue = () => {
    if (!canContinue) return
    // Save free-text if no match was selected
    if (needsSearch && wherePlaysSpecific === '' && query !== '') {
      setWherePlaysSpecific(query)
    }
    router.push('/onboarding/step-pro-player')
  }

  const handleSelectClub = (name: string) => {
    setWherePlaysSpecific(name)
    setQuery(name)
  }

  const handleCategorySelect = (value: string) => {
    setWherePlaysCategory(value)
    setWherePlaysSpecific('')
    setQuery('')
  }

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <View className="flex-1 px-6 pt-4">
        {/* Progress */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="arrow-back" size={20} color="#64748B" />
          </TouchableOpacity>
          <View className="flex-1 h-1 bg-coach-border rounded-full mx-3">
            <View className="h-full bg-brand-blue rounded-full" style={{ width: `${(STEP / TOTAL) * 100}%` }} />
          </View>
          <Text className="text-slate-500 text-xs font-poppins">{STEP}/{TOTAL}</Text>
        </View>

        <View className="flex-row items-center gap-2 mb-1">
          <View className="w-2 h-2 bg-brand-blue rounded-full" />
          <Text className="text-brand-blue text-xs font-poppins-semibold uppercase tracking-wider">
            Building your soccer DNA profile...
          </Text>
        </View>

        <Text className="text-slate-900 text-3xl font-poppins-semibold mb-1">Where do you play?</Text>
        <Text className="text-slate-400 text-sm font-poppins mb-5">Select your playing environment</Text>

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Category Selection */}
          <View className="gap-2 mb-5">
            {PLAY_CATEGORIES.map((cat) => {
              const selected = wherePlaysCategory === cat.value
              return (
                <TouchableOpacity
                  key={cat.value}
                  onPress={() => handleCategorySelect(cat.value)}
                  className={`rounded-2xl px-4 py-3 flex-row items-center border ${
                    selected ? 'border-brand-blue bg-brand-blue/10' : 'border-coach-border bg-coach-card'
                  }`}
                >
                  <Ionicons name={cat.icon as any} size={22} color={selected ? '#2563EB' : '#64748B'} style={{ marginRight: 12 }} />
                  <View className="flex-1">
                    <Text className={`font-poppins-bold text-base ${selected ? 'text-brand-blue' : 'text-slate-700'}`}>
                      {cat.label}
                    </Text>
                    <Text className={`text-xs font-poppins mt-0.5 ${selected ? 'text-blue-600' : 'text-slate-500'}`}>
                      {cat.description}
                    </Text>
                  </View>
                  {selected && <Ionicons name="checkmark-circle" size={20} color="#2563EB" />}
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Search (shown for club, high school, college) */}
          {needsSearch && (
            <View className="mb-4">
              <Text className="text-slate-400 text-sm font-poppins-medium mb-2">
                Search for your {wherePlaysCategory === 'mls' ? 'club' : wherePlaysCategory === 'college' ? 'school' : 'team'}
              </Text>
              <View className="bg-coach-card border border-coach-border rounded-2xl px-4 py-3 flex-row items-center mb-2">
                <Ionicons name="search" size={16} color="#475569" style={{ marginRight: 8 }} />
                <TextInput
                  className="text-slate-900 text-base font-poppins flex-1"
                  placeholder="Type to search..."
                  placeholderTextColor="#475569"
                  value={query}
                  onChangeText={(t) => { setQuery(t); setWherePlaysSpecific('') }}
                  autoCapitalize="words"
                />
                {query !== '' && (
                  <TouchableOpacity onPress={() => { setQuery(''); setWherePlaysSpecific('') }}>
                    <Ionicons name="close-circle" size={16} color="#475569" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Results */}
              {searchResults.length > 0 && (
                <View className="bg-coach-card border border-coach-border rounded-2xl overflow-hidden">
                  {searchResults.map((club, idx) => (
                    <TouchableOpacity
                      key={club.name}
                      onPress={() => handleSelectClub(club.name)}
                      className={`px-4 py-3 flex-row items-center ${idx < searchResults.length - 1 ? 'border-b border-coach-border' : ''}`}
                    >
                      <Ionicons name="location-outline" size={14} color="#475569" style={{ marginRight: 8 }} />
                      <View className="flex-1">
                        <Text className={`font-poppins-medium text-sm ${wherePlaysSpecific === club.name ? 'text-brand-blue' : 'text-brand-blue'}`}>
                          {club.name}
                        </Text>
                        {club.city && (
                          <Text className="text-slate-500 text-xs font-poppins">{club.city}</Text>
                        )}
                      </View>
                      {wherePlaysSpecific === club.name && (
                        <Ionicons name="checkmark" size={16} color="#2563EB" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {query.length > 1 && searchResults.length === 0 && (
                <TouchableOpacity
                  onPress={() => setWherePlaysSpecific(query)}
                  className="bg-coach-card border border-coach-border rounded-2xl px-4 py-3 flex-row items-center"
                >
                  <Ionicons name="add-circle-outline" size={16} color="#2563EB" style={{ marginRight: 8 }} />
                  <Text className="text-brand-blue font-poppins-medium text-sm">Use "{query}"</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        <TouchableOpacity
          onPress={handleContinue}
          disabled={!canContinue}
          className={`rounded-2xl py-4 items-center flex-row justify-center gap-2 mb-4 ${
            canContinue ? 'bg-brand-blue' : 'bg-slate-100 border border-slate-200'
          }`}
        >
          <Text className={`font-poppins-bold text-base ${canContinue ? 'text-white' : 'text-slate-400'}`}>
            Continue
          </Text>
          {canContinue && <Ionicons name="arrow-forward" size={18} color="white" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
