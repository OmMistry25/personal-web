/*
  # Create about_video table and policies
  
  1. New Tables
    - about_video (url, created_at, updated_at)
  
  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for authenticated user management
*/

-- Create about_video table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.about_video (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.about_video ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow public read access" ON public.about_video;
    DROP POLICY IF EXISTS "Enable full access for authenticated users" ON public.about_video;
EXCEPTION
    WHEN undefined_object THEN 
        NULL;
END $$;

-- Create policies
CREATE POLICY "Allow public read access" ON public.about_video
  FOR SELECT USING (true);

CREATE POLICY "Enable full access for authenticated users" ON public.about_video
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');