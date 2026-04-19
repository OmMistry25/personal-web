/*
  # Update about_video table for YouTube URLs
  
  1. Changes
    - Drop existing about_video table
    - Recreate about_video table with video_id field for YouTube
    
  2. Security
    - Maintain existing RLS policies
    - Keep public read access
    - Keep authenticated user management
*/

DROP TABLE IF EXISTS public.about_video;

CREATE TABLE public.about_video (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.about_video ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON public.about_video
  FOR SELECT USING (true);

CREATE POLICY "Enable full access for authenticated users" ON public.about_video
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');