/*
  # Optimize RLS Policies for Ocean Entries

  1. Changes
    - Drop existing RLS policies on ocean_entries
    - Recreate policies with optimized auth.uid() calls using SELECT
    - This prevents re-evaluation of auth.uid() for each row, improving query performance at scale

  2. Performance Impact
    - Previous: auth.uid() called once per row
    - New: auth.uid() called once per query
    - Significant performance improvement for queries returning many rows
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create own ocean entries" ON ocean_entries;
DROP POLICY IF EXISTS "Users can read own ocean entries" ON ocean_entries;
DROP POLICY IF EXISTS "Users can update own ocean entries" ON ocean_entries;
DROP POLICY IF EXISTS "Users can delete own ocean entries" ON ocean_entries;

-- Recreate policies with optimized auth.uid() calls
CREATE POLICY "Users can create own ocean entries"
  ON ocean_entries
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can read own ocean entries"
  ON ocean_entries
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own ocean entries"
  ON ocean_entries
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own ocean entries"
  ON ocean_entries
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);