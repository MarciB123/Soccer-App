-- Migration 003: Add onboarding_complete, session_duration, equipment, cardio_goal

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS session_duration_minutes INT DEFAULT 60,
  ADD COLUMN IF NOT EXISTS equipment TEXT[] DEFAULT '{}';

ALTER TABLE training_plans
  ADD COLUMN IF NOT EXISTS cardio_goal TEXT;
