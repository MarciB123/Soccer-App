import { create } from 'zustand'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { Profile } from '../types'

interface AuthState {
  session: Session | null
  user: User | null
  profile: Profile | null
  isLoading: boolean
  showWelcomeBanner: boolean
  setSession: (session: Session | null) => void
  setProfile: (profile: Profile | null) => void
  setShowWelcomeBanner: (show: boolean) => void
  signOut: () => Promise<void>
  fetchProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  showWelcomeBanner: false,

  setSession: (session) => {
    set({ session, user: session?.user ?? null, isLoading: false })
  },

  setProfile: (profile) => set({ profile }),
  setShowWelcomeBanner: (showWelcomeBanner) => set({ showWelcomeBanner }),

  fetchProfile: async () => {
    const { user } = get()
    if (!user) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    if (data) set({ profile: data })
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ session: null, user: null, profile: null })
  },
}))
