-- Run once in Supabase SQL Editor before deploying the community feed.
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  caption text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.post_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS public.post_likes (
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);
CREATE TABLE IF NOT EXISTS public.post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read posts" ON public.posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "members create posts" ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "members read media" ON public.post_media FOR SELECT TO authenticated USING (true);
CREATE POLICY "members read likes" ON public.post_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "members like" ON public.post_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "members unlike" ON public.post_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "members read comments" ON public.post_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "members comment" ON public.post_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "members remove own comments" ON public.post_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "daan-media members post images" ON storage.objects;
CREATE POLICY "daan-media members post images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'daan-media' AND name LIKE 'posts/' || auth.uid()::text || '/%');
