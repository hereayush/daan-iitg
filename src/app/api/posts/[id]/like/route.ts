import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await createClient(); const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params; const db = await createServiceClient();
  const { data: existing } = await db.from("post_likes").select("post_id").eq("post_id", id).eq("user_id", user.id).maybeSingle();
  const result = existing ? await db.from("post_likes").delete().eq("post_id", id).eq("user_id", user.id) : await db.from("post_likes").insert({ post_id: id, user_id: user.id });
  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json({ liked: !existing });
}
