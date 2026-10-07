-- Run once in Supabase SQL Editor. These indexes preserve all features while
-- making the feed, dashboard, alumni directory, and interactions faster.
CREATE INDEX IF NOT EXISTS posts_created_at_desc_idx ON public.posts (created_at DESC);
CREATE INDEX IF NOT EXISTS post_media_post_id_order_idx ON public.post_media (post_id, display_order);
CREATE INDEX IF NOT EXISTS post_likes_post_id_idx ON public.post_likes (post_id);
CREATE INDEX IF NOT EXISTS post_comments_post_id_created_at_idx ON public.post_comments (post_id, created_at);
CREATE INDEX IF NOT EXISTS alumni_batch_name_idx ON public.alumni (batch DESC, scholar_name ASC);
CREATE INDEX IF NOT EXISTS achievements_created_at_desc_idx ON public.achievements (created_at DESC);
CREATE INDEX IF NOT EXISTS events_date_idx ON public.events (event_date ASC);
CREATE INDEX IF NOT EXISTS council_display_order_idx ON public.council_members (display_order ASC);
