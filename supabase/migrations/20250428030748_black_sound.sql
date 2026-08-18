/*
  # Add sort order to notes table

  1. Changes
    - Add sort_order column to notes table
    - Set default value to 0
    - Update existing notes to have sequential order
*/

-- Add sort_order column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'notes' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE notes ADD COLUMN sort_order integer NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Update existing notes to have sequential order based on date
WITH numbered_notes AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY date DESC) - 1 as new_order
  FROM notes
)
UPDATE notes
SET sort_order = numbered_notes.new_order
FROM numbered_notes
WHERE notes.id = numbered_notes.id;