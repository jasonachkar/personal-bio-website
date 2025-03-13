/*
  # Set up storage bucket and policies

  1. New Bucket
    - Create 'publicbucket' for storing public files
    - Enable public access

  2. Security
    - Add policies for public read access
    - Add policies for authenticated users to upload/delete
*/

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('publicbucket', 'publicbucket', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public access to files in the bucket
CREATE POLICY "Give public access to all files" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'publicbucket');

-- Policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'publicbucket'
    AND auth.role() = 'authenticated'
  );

-- Policy to allow authenticated users to update their files
CREATE POLICY "Allow authenticated users to update files" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'publicbucket'
    AND auth.role() = 'authenticated'
  );

-- Policy to allow authenticated users to delete their files
CREATE POLICY "Allow authenticated users to delete files" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'publicbucket'
    AND auth.role() = 'authenticated'
  );