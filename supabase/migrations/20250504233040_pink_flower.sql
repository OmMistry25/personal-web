/*
  # Configure storage for video uploads
  
  1. Changes
    - Create videos bucket with 400MB file size limit
    - Enable RLS on storage objects
    - Add policies for public access and authenticated uploads
    
  2. Security
    - Public read access for videos
    - Authenticated users can upload videos up to 400MB
*/

-- Create videos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  true,
  419430400, -- 400MB in bytes
  ARRAY['video/mp4', 'video/quicktime', 'video/x-m4v']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policies
CREATE POLICY "Videos are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'videos' 
  AND (CAST(metadata->>'size' AS bigint) <= 419430400)
);