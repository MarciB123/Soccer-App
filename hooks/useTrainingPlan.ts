import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'
import { TrainingPlan } from '../types'

export function useTrainingPlan() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['training-plan', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('training_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('generated_at', { ascending: false })
        .limit(1)
        .single()

      if (error) throw error
      return data as TrainingPlan
    },
    enabled: !!user,
  })
}
