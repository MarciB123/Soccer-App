import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert, Switch, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import Constants from 'expo-constants'
import { useAuthStore } from '../../stores/auth'

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-center py-3 border-b border-coach-border">
      <Text className="text-slate-400 text-sm">{label}</Text>
      <Text className="text-slate-900 text-sm font-poppins-medium capitalize">{value}</Text>
    </View>
  )
}

function SettingsRow({ label, onPress, rightElement, destructive }: {
  label: string
  onPress?: () => void
  rightElement?: React.ReactNode
  destructive?: boolean
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress && !rightElement}
      className="flex-row justify-between items-center py-4 border-b border-coach-border"
    >
      <Text className={`text-base ${destructive ? 'text-red-500' : 'text-slate-900'}`}>{label}</Text>
      {rightElement || (onPress ? <Ionicons name="chevron-forward" size={16} color="#475569" /> : null)}
    </TouchableOpacity>
  )
}

export default function ProfileScreen() {
  const { profile, signOut, user } = useAuthStore()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure? This will permanently delete your account and all training data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => Alert.alert('Request Submitted', 'Your account deletion request has been submitted. We will process it within 30 days per our Privacy Policy.'),
        },
      ]
    )
  }

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      "Your subscription can be managed through your device's app store settings.",
      [
        { text: 'OK' },
        { text: 'Open App Store Settings', onPress: () => Linking.openURL('https://apps.apple.com/account/subscriptions') },
      ]
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        {/* Avatar */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-brand-blue rounded-full items-center justify-center mb-3">
            <Text className="text-white text-3xl font-poppins-semibold">
              {profile?.first_name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
          <Text className="text-slate-900 text-xl font-poppins-semibold">{profile?.first_name || 'Player'}</Text>
          <Text className="text-slate-400 text-sm">{user?.email}</Text>
        </View>

        {/* Profile Section */}
        <Text className="text-slate-500 text-xs font-poppins-semibold mb-2 uppercase tracking-wider">Your Profile</Text>
        <View className="bg-coach-card border border-coach-border rounded-2xl px-4 mb-6">
          <ProfileRow label="Position" value={profile?.position || '—'} />
          <ProfileRow label="Body Type" value={profile?.body_type?.replace('_', ' ') || '—'} />
          <ProfileRow label="Skill Level" value={profile?.skill_level || '—'} />
          <ProfileRow label="Training Days" value={profile?.training_days_per_week ? `${profile.training_days_per_week} days/week` : '—'} />
          <ProfileRow label="Goals" value={profile?.goals?.join(', ').replace(/_/g, ' ') || '—'} />
        </View>

        {/* Subscription */}
        <Text className="text-slate-500 text-xs font-poppins-semibold mb-2 uppercase tracking-wider">Subscription</Text>
        <View className="bg-coach-card border border-coach-border rounded-2xl px-4 mb-6">
          <SettingsRow label="Manage Subscription" onPress={handleCancelSubscription} />
          <SettingsRow label="Restore Purchases" onPress={() => Alert.alert('Restoring purchases...')} />
        </View>

        {/* Settings */}
        <Text className="text-slate-500 text-xs font-poppins-semibold mb-2 uppercase tracking-wider">Settings</Text>
        <View className="bg-coach-card border border-coach-border rounded-2xl px-4 mb-6">
          <SettingsRow
            label="Push Notifications"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#1A2744', true: '#2563EB' }}
                thumbColor="white"
              />
            }
          />
          <SettingsRow label="Privacy Policy" onPress={() => Linking.openURL('https://socceraicoach.app/privacy')} />
          <SettingsRow label="Terms of Service" onPress={() => Linking.openURL('https://socceraicoach.app/terms')} />
        </View>

        {/* Account */}
        <Text className="text-slate-500 text-xs font-poppins-semibold mb-2 uppercase tracking-wider">Account</Text>
        <View className="bg-coach-card border border-coach-border rounded-2xl px-4 mb-6">
          <SettingsRow
            label="Sign Out"
            onPress={() => Alert.alert('Sign Out', 'Are you sure?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Out', onPress: signOut },
            ])}
          />
          <SettingsRow label="Delete Account" destructive onPress={handleDeleteAccount} />
        </View>

        <Text className="text-slate-600 text-xs text-center">
          Soccer AI Coach v{Constants.expoConfig?.version || '1.0.0'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}
