import '../global.css'
import { useEffect } from 'react'
import { Stack, useRouter, useSegments, usePathname } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins'
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
})

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, isLoading, profile } = useAuthStore()
  const segments = useSegments()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.getState().setSession(session)
      if (session) useAuthStore.getState().fetchProfile()
    })
    supabase.auth.getSession().then(({ data: { session } }) => {
      useAuthStore.getState().setSession(session)
      if (session) useAuthStore.getState().fetchProfile()
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === 'auth'
    const inOnboarding = segments[0] === 'onboarding'
    const isLanding = pathname === '/'
    const isPaywall = pathname === '/paywall' || pathname === '/paywall-discount'

    if (!session) {
      // Onboarding happens BEFORE account creation, so allow these without a session
      if (!isLanding && !inAuthGroup && !inOnboarding && !isPaywall) {
        router.replace('/')
      }
    } else if (session) {
      // reset-password needs an active session to call updateUser — don't redirect it
      const isResetPassword = pathname === '/auth/reset-password'
      if ((inAuthGroup || isLanding) && !isResetPassword) {
        // Signed in — go to home (onboarding data already saved at signup)
        router.replace('/(tabs)/home')
      }
    }
  }, [session, isLoading, profile, segments, pathname])

  return <>{children}</>
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  })

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="paywall" />
          <Stack.Screen name="paywall-discount" />
        </Stack>
      </AuthGuard>
    </QueryClientProvider>
  )
}
