/*
  # Initial schema setup
  
  1. New Tables
    - projects (title, description, tags, url, etc.)
    - notes (title, slug, content, etc.)
    - work_experience (company, role, period, etc.)
    - about_items (title, sort_order)
    - now_items (activity, sort_order)
    - contact_methods (label, value, type, sort_order)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated user management
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  url TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  year TEXT NOT NULL,
  achievements TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notes Table
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  date TEXT NOT NULL,
  reading_time INTEGER NOT NULL,
  excerpt TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Work Experience Table
CREATE TABLE IF NOT EXISTS public.work_experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT NOT NULL,
  achievements TEXT[] NOT NULL DEFAULT '{}',
  technologies TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- About Items Table
CREATE TABLE IF NOT EXISTS public.about_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Now Items Table
CREATE TABLE IF NOT EXISTS public.now_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contact Methods Table
CREATE TABLE IF NOT EXISTS public.contact_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'social', 'other')),
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.now_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_methods ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
CREATE POLICY "Allow public read access" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage" ON public.projects FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON public.notes FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage" ON public.notes FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON public.work_experience FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage" ON public.work_experience FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON public.about_items FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage" ON public.about_items FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON public.now_items FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage" ON public.now_items FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON public.contact_methods FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage" ON public.contact_methods FOR ALL USING (auth.role() = 'authenticated');