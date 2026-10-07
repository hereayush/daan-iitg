import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await createClient(); const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = String((await request.json()).body || "").trim();
  if (!body) return NextResponse.json({ error: "Comment cannot be empty." }, { status: 400 });
  const { id } = await params; const db = await createServiceClient();
  const { error } = await db.from("post_comments").insert({ post_id: id, user_id: user.id, body });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
