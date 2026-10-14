-- Migration: Add is_current and batch_year to council_members
-- Run this in the Supabase SQL editor

ALTER TABLE council_members
  ADD COLUMN IF NOT EXISTS is_current  BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS batch_year  INTEGER;

-- All existing members are assumed to be current
UPDATE council_members SET is_current = TRUE WHERE is_current IS NULL;
