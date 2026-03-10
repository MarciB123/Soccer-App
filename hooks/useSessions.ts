import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'
import { Session } from '../types'

export function useTodaySession() {
  const { user } = useAuthStore()
  const today = new Date().toISOString().split('T')[0]

  return useQuery({
    queryKey: ['session-today', user?.id, today],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('scheduled_date', today)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error
      return data as Session | null
    },
    enabled: !!user,
  })
}

export function useWeekSessions() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['sessions-week', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated')
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)

      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('scheduled_date', weekAgo.toISOString().split('T')[0])
        .order('scheduled_date', { ascending: false })

      if (error) throw error
      return (data || []) as Session[]
    },
    enabled: !!user,
  })
}

export function useCompleteSession() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async ({
      sessionId,
      drillsCompleted,
      durationMinutes,
      rating,
    }: {
      sessionId: string
      drillsCompleted: number
      durationMinutes: number
      rating: number
    }) => {
      const { error } = await supabase
        .from('sessions')
        .update({
          completed_at: new Date().toISOString(),
          drills_completed: drillsCompleted,
          duration_minutes: durationMinutes,
          user_rating: rating,
        })
        .eq('id', sessionId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-today', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['sessions-week', user?.id] })
    },
  })
}
