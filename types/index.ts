// Sub-position slugs (specific positions)
export type Position =
  | 'goalkeeper'
  | 'cb' | 'lb' | 'rb' | 'lwb' | 'rwb'
  | 'cdm' | 'cm' | 'lm' | 'rm' | 'cam'
  | 'lw' | 'rw' | 'cf' | 'st'

// Main category (used for grouping in UI)
export type PositionCategory = 'goalkeeper' | 'defender' | 'midfielder' | 'forward'

export type BodyType = 'lean' | 'athletic' | 'stocky' | 'tall_lean' | 'tall_athletic'
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'competitive'
export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled'
export type SubscriptionTier = 'monthly' | 'annual'
export type MessageRole = 'user' | 'assistant'
export type CVStatus = 'pending' | 'processing' | 'complete' | 'failed'

export interface Profile {
  id: string
  age: number | null
  position: Position | null
  body_type: BodyType | null
  skill_level: SkillLevel | null
  goals: string[]
  training_days_per_week: number | null
  first_name: string | null
  push_token: string | null
  created_at: string
  updated_at: string
}

export interface Drill {
  id: string
  name: string
  duration_minutes: number
  description: string
  instructions: string[]
  equipment: string[]
  difficulty: SkillLevel
  video_url?: string
}

export interface TrainingPlan {
  id: string
  user_id: string
  generated_at: string
  week_number: number
  drills: Drill[]
  nutrition_guidance: string
  ai_notes: string
  is_active: boolean
}

export interface Session {
  id: string
  user_id: string
  plan_id: string
  scheduled_date: string
  completed_at: string | null
  duration_minutes: number | null
  drills_completed: number
  drills_total: number
  user_rating: number | null
}

export interface ChatMessage {
  id: string
  user_id: string
  role: MessageRole
  content: string
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  revenuecat_user_id: string
  status: SubscriptionStatus
  tier: SubscriptionTier | null
  expires_at: string | null
}

export interface ParentConsent {
  id: string
  child_user_id: string
  parent_email: string
  consent_given_at: string | null
  consent_type: string
  ip_address: string
}
