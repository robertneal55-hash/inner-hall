/*
  # Ocean Room Journal Entries

  1. New Tables
    - `ocean_entries`
      - `id` (uuid, primary key) - Unique identifier for each entry
      - `user_id` (uuid) - Reference to auth.users
      - `prompt` (text) - The selected writing prompt
      - `content` (text) - The written content by the user
      - `created_at` (timestamptz) - When the entry was created
      - `updated_at` (timestamptz) - When the entry was last updated

  2. Security
    - Enable RLS on `ocean_entries` table
    - Add policy for authenticated users to create their own entries
    - Add policy for authenticated users to read their own entries
    - Add policy for authenticated users to update their own entries
    - Add policy for authenticated users to delete their own entries

  3. Indexes
    - Add index on user_id for faster queries
    - Add index on created_at for chronological ordering
*/

CREATE TABLE IF NOT EXISTS ocean_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prompt text NOT NULL,
  content text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ocean_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create own ocean entries"
  ON ocean_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own ocean entries"
  ON ocean_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own ocean entries"
  ON ocean_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ocean entries"
  ON ocean_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS ocean_entries_user_id_idx ON ocean_entries(user_id);
CREATE INDEX IF NOT EXISTS ocean_entries_created_at_idx ON ocean_entries(created_at DESC);