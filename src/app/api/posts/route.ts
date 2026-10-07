import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await createServiceClient();
  const { data: posts, error } = await db.from("posts").select("*, post_media(*), post_likes(user_id), post_comments(*, profiles(full_name, avatar_url))").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const ids = [...new Set((posts || []).map((post) => post.user_id))];
  const { data: authors } = ids.length ? await db.from("profiles").select("id, full_name, avatar_url").in("id", ids) : { data: [] };
  const authorById = Object.fromEntries((authors || []).map((author) => [author.id, author]));
  return NextResponse.json({ currentUserId: user.id, posts: (posts || []).map((post) => ({ ...post, author: authorById[post.user_id], liked: post.post_likes.some((like: { user_id: string }) => like.user_id === user.id), like_count: post.post_likes.length, comments: post.post_comments || [] })) });
}

export async function DELETE(request: NextRequest) {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Post id is required." }, { status: 400 });
  const db = await createServiceClient();
  const { data: post } = await db.from("posts").select("user_id").eq("id", id).maybeSingle();
  if (!post || post.user_id !== user.id) return NextResponse.json({ error: "You can only delete your own posts." }, { status: 403 });
  const { error } = await db.from("posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest) {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const caption = String(form.get("caption") || "").trim();
  const files = form.getAll("photos").filter((item): item is File => item instanceof File && item.size > 0);
  if (!caption && !files.length) return NextResponse.json({ error: "Add a caption or photo." }, { status: 400 });
  if (files.length > 10) return NextResponse.json({ error: "You can add up to 10 photos." }, { status: 400 });
  const db = await createServiceClient();
  const { data: post, error } = await db.from("posts").insert({ user_id: user.id, caption }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const media = [];
  for (const [index, file] of files.entries()) {
    if (!file.type.startsWith("image/")) continue;
    const path = `posts/${user.id}/${post.id}-${index}-${Date.now()}.jpg`;
    const { error: uploadError } = await db.storage.from("daan-media").upload(path, file, { contentType: file.type });
    if (!uploadError) media.push({ post_id: post.id, url: db.storage.from("daan-media").getPublicUrl(path).data.publicUrl, display_order: index });
  }
  if (media.length) await db.from("post_media").insert(media);
  return NextResponse.json({ success: true });
}
