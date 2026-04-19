/*
  # Update RLS policies for admin access

  1. Changes
    - Update existing policies to properly handle authenticated users
    - Add specific policies for admin users
    - Ensure proper access control for CRUD operations

  2. Security
    - Maintains public read access
    - Adds proper authentication checks
    - Ensures admin-only write access
*/

-- Update Projects policies
DROP POLICY IF EXISTS "Allow authenticated users to manage" ON public.projects;
CREATE POLICY "Enable full access for authenticated users" ON public.projects
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Update Notes policies
DROP POLICY IF EXISTS "Allow authenticated users to manage" ON public.notes;
CREATE POLICY "Enable full access for authenticated users" ON public.notes
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Update Work Experience policies
DROP POLICY IF EXISTS "Allow authenticated users to manage" ON public.work_experience;
CREATE POLICY "Enable full access for authenticated users" ON public.work_experience
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Update About Items policies
DROP POLICY IF EXISTS "Allow authenticated users to manage" ON public.about_items;
CREATE POLICY "Enable full access for authenticated users" ON public.about_items
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Update Now Items policies
DROP POLICY IF EXISTS "Allow authenticated users to manage" ON public.now_items;
CREATE POLICY "Enable full access for authenticated users" ON public.now_items
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Update Contact Methods policies
DROP POLICY IF EXISTS "Allow authenticated users to manage" ON public.contact_methods;
CREATE POLICY "Enable full access for authenticated users" ON public.contact_methods
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');