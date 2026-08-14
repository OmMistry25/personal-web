/*
  # Add order columns to now_items and contact_methods tables

  1. Changes
    - Add `sort_order` column to `now_items` table
    - Add `sort_order` column to `contact_methods` table
    - Update column references in existing policies
*/

-- Add sort_order column to now_items
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'now_items' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE now_items ADD COLUMN sort_order integer NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Add sort_order column to contact_methods
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contact_methods' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE contact_methods ADD COLUMN sort_order integer NOT NULL DEFAULT 0;
  END IF;
END $$;