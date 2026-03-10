-- =============================================
-- Soccer AI Coach — Initial Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES (extends Supabase auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  age INT CHECK (age >= 8 AND age <= 100),
  position TEXT CHECK (position IN ('goalkeeper', 'defender', 'midfielder', 'winger', 'striker')),
  body_type TEXT CHECK (body_type IN ('lean', 'athletic', 'stocky', 'tall_lean', 'tall_athletic')),
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'competitive')),
  goals TEXT[] DEFAULT '{}',
  training_days_per_week INT CHECK (training_days_per_week BETWEEN 1 AND 7),
  push_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- TRAINING PLANS
-- =============================================
CREATE TABLE IF NOT EXISTS training_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  week_number INT,
  drills JSONB DEFAULT '[]',
  nutrition_guidance TEXT,
  ai_notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_training_plans_user_id ON training_plans(user_id);
CREATE INDEX idx_training_plans_active ON training_plans(user_id, is_active) WHERE is_active = TRUE;

-- =============================================
-- SESSIONS (individual training sessions)
-- =============================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES training_plans(id) ON DELETE SET NULL,
  scheduled_date DATE NOT NULL,
  completed_at TIMESTAMPTZ,
  duration_minutes INT,
  drills_completed INT DEFAULT 0,
  drills_total INT DEFAULT 0,
  user_rating INT CHECK (user_rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_date ON sessions(user_id, scheduled_date);

-- =============================================
-- CHAT MESSAGES (AI Coach conversation)
-- =============================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(user_id, created_at);

-- =============================================
-- SUBSCRIPTIONS
-- =============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  revenuecat_user_id TEXT,
  status TEXT CHECK (status IN ('trial', 'active', 'expired', 'cancelled')) NOT NULL DEFAULT 'trial',
  tier TEXT CHECK (tier IN ('monthly', 'annual')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- PARENT CONSENTS (COPPA — under 13 users)
-- =============================================
CREATE TABLE IF NOT EXISTS parent_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  parent_email TEXT NOT NULL,
  consent_given_at TIMESTAMPTZ,
  consent_type TEXT NOT NULL DEFAULT 'coppa_initial',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_parent_consents_child ON parent_consents(child_user_id);

-- =============================================
-- VIDEO SUBMISSIONS (Phase 2 — Computer Vision)
-- =============================================
CREATE TABLE IF NOT EXISTS video_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  cv_status TEXT CHECK (cv_status IN ('pending', 'processing', 'complete', 'failed')) DEFAULT 'pending',
  cv_results JSONB,
  drill_type TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_video_submissions_user_id ON video_submissions(user_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_submissions ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- TRAINING PLANS policies
CREATE POLICY "Users can view own training plans"
  ON training_plans FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training plans"
  ON training_plans FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own training plans"
  ON training_plans FOR UPDATE USING (auth.uid() = user_id);

-- SESSIONS policies
CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON sessions FOR UPDATE USING (auth.uid() = user_id);

-- CHAT MESSAGES policies
CREATE POLICY "Users can view own messages"
  ON chat_messages FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- SUBSCRIPTIONS policies
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- PARENT CONSENTS policies
CREATE POLICY "Users can view own consent"
  ON parent_consents FOR SELECT USING (auth.uid() = child_user_id);

CREATE POLICY "Users can insert own consent"
  ON parent_consents FOR INSERT WITH CHECK (auth.uid() = child_user_id);

-- VIDEO SUBMISSIONS policies
CREATE POLICY "Users can view own videos"
  ON video_submissions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own videos"
  ON video_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- SUPABASE STORAGE BUCKET (for videos)
-- Run in Supabase dashboard or via CLI
-- =============================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('training-videos', 'training-videos', false)
-- ON CONFLICT DO NOTHING;

-- CREATE POLICY "Users can upload own videos"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'training-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can view own videos"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'training-videos' AND auth.uid()::text = (storage.foldername(name))[1]);
