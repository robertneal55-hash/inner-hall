/*
  # Remove Unused Indexes

  1. Changes
    - Drop unused indexes on journal_entries table
    - Drop unused indexes on ocean_entries table
    
  2. Note
    - These indexes were flagged as unused by Supabase
    - As the application scales and queries increase, consider re-adding:
      - user_id indexes if query performance degrades on user-specific queries
      - created_at indexes if chronological ordering becomes slow
    - RLS policies will still function correctly without these indexes
*/

-- Drop unused indexes on journal_entries
DROP INDEX IF EXISTS journal_entries_user_id_idx;
DROP INDEX IF EXISTS journal_entries_created_at_idx;

-- Drop unused indexes on ocean_entries
DROP INDEX IF EXISTS ocean_entries_user_id_idx;
DROP INDEX IF EXISTS ocean_entries_created_at_idx;