/*
  # Optimize RLS Policies for Journal Entries

  1. Changes
    - Drop existing RLS policies on journal_entries if they exist
    - Recreate policies with optimized auth.uid() calls using SELECT
    - This prevents re-evaluation of auth.uid() for each row, improving query performance at scale

  2. Performance Impact
    - Previous: auth.uid() called once per row
    - New: auth.uid() called once per query
    - Significant performance improvement for queries returning many rows
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can create own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can update own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can delete own journal entries" ON journal_entries;

-- Ensure table exists
CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT (select auth.uid()),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ensure RLS is enabled
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Create optimized policies
CREATE POLICY "Users can view own journal entries"
  ON journal_entries
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create own journal entries"
  ON journal_entries
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own journal entries"
  ON journal_entries
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own journal entries"
  ON journal_entries
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS journal_entries_user_id_idx ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS journal_entries_created_at_idx ON journal_entries(created_at DESC);