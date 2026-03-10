-- =============================================
-- Migration 002: Update profiles for sub-positions and new onboarding fields
-- =============================================

-- 1. Drop the old position constraint (it only allowed 5 generic values)
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_position_check;

-- 2. Add new position constraint that accepts all 15 sub-positions
ALTER TABLE profiles
  ADD CONSTRAINT profiles_position_check
  CHECK (position IN (
    'goalkeeper',
    'cb', 'lb', 'rb', 'lwb', 'rwb',
    'cdm', 'cm', 'lm', 'rm', 'cam',
    'lw', 'rw', 'cf', 'st'
  ));

-- 3. Add missing columns collected during onboarding
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS playing_style TEXT,
  ADD COLUMN IF NOT EXISTS where_plays_category TEXT,
  ADD COLUMN IF NOT EXISTS where_plays_specific TEXT,
  ADD COLUMN IF NOT EXISTS pro_player_slug TEXT,
  ADD COLUMN IF NOT EXISTS goals_text TEXT;
