/*
  # Add about video table and storage configuration

  1. New Tables
    - about_video
      - id (uuid, primary key)
      - url (text)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on about_video table
    - Add policies for public read access
    - Add policies for authenticated user management
*/

-- Create about_video table
CREATE TABLE IF NOT EXISTS public.about_video (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.about_video ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON public.about_video
  FOR SELECT USING (true);

CREATE POLICY "Enable full access for authenticated users" ON public.about_video
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');