-- Storage permissions for the daan-media bucket.
-- Without these, photo uploads from the admin panel fail silently.
-- Run once in Supabase -> SQL Editor.

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'sub_admin')
  );
$$;

DROP POLICY IF EXISTS "daan-media public read" ON storage.objects;
DROP POLICY IF EXISTS "daan-media staff insert" ON storage.objects;
DROP POLICY IF EXISTS "daan-media staff update" ON storage.objects;
DROP POLICY IF EXISTS "daan-media admin delete" ON storage.objects;

CREATE POLICY "daan-media public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'daan-media');

CREATE POLICY "daan-media staff insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'daan-media' AND public.is_staff());

CREATE POLICY "daan-media staff update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'daan-media' AND public.is_staff());

CREATE POLICY "daan-media admin delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'daan-media' AND public.is_admin());
