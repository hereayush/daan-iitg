import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { parseAcademicCalendar } from "@/lib/calendarParser";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = await createServiceClient();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "sub_admin"].includes(profile.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const file = (await req.formData()).get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  let text: string;
  try { text = (await pdfParse(Buffer.from(await file.arrayBuffer()))).text; }
  catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown PDF parsing error";
    return NextResponse.json({ error: `Failed to parse PDF: ${message}` }, { status: 400 });
  }

  const events = parseAcademicCalendar(text);
  const inserted: string[] = [];
  for (const event of events) {
    // The schema has no title/date unique constraint, so lookup first.
    const { data: existing, error: lookupError } = await supabase.from("calendar_events").select("id").eq("title", event.title).eq("event_date", event.event_date).maybeSingle();
    if (lookupError) continue;
    const { error } = existing
      ? await supabase.from("calendar_events").update(event).eq("id", existing.id)
      : await supabase.from("calendar_events").insert(event);
    if (!error) inserted.push(event.title);
  }
  return NextResponse.json({ parsed: events.length, inserted: inserted.length, events });
}
