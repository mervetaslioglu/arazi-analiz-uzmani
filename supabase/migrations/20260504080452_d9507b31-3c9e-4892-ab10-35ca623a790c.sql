-- Create private bucket for project documents (imar, plan notu, tapu vb.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-documents', 'project-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS: users can read their own files (path: {user_id}/...)
CREATE POLICY "Users can view their own project documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own project documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own project documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own project documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);