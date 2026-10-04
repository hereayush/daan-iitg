import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  const supabase = await createServiceClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "sub_admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  
  let text = "";
  try {
    const parsed = await pdfParse(buffer);
    text = parsed.text;
  } catch (e: any) {
    console.error("PDF parse error:", e);
    return NextResponse.json({ error: `Failed to parse PDF: ${e.message}` }, { status: 400 });
  }

  // Parse calendar events from text
  const events = parseCalendarText(text);

  // Insert into DB (skip duplicates by title+date)
  const inserted: string[] = [];
  for (const ev of events) {
    const { error } = await supabase
      .from("calendar_events")
      .upsert(ev, { onConflict: "title,event_date" } as { onConflict: string })
      .select();
    if (!error) inserted.push(ev.title);
  }

  return NextResponse.json({ parsed: events.length, inserted: inserted.length, events });
}

// Simple heuristic parser for academic calendar PDFs
function parseCalendarText(text: string) {
  const events: Array<{
    title: string;
    event_date: string;
    type: "holiday" | "event" | "exam" | "deadline" | "other";
    color: string;
    is_manual: boolean;
  }> = [];

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // Date patterns: "15 Aug 2024", "15-08-2024", "August 15, 2024"
  const datePatterns = [
    /(\d{1,2})\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{4})/i,
    /(\d{1,2})[/-](\d{1,2})[/-](\d{4})/,
    /(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})[,\s]+(\d{4})/i,
  ];

  const monthMap: Record<string, string> = {
    jan: "01", january: "01", feb: "02", february: "02",
    mar: "03", march: "03", apr: "04", april: "04",
    may: "05", jun: "06", june: "06", jul: "07", july: "07",
    aug: "08", august: "08", sep: "09", september: "09",
    oct: "10", october: "10", nov: "11", november: "11",
    dec: "12", december: "12",
  };

  const typeKeywords: Record<string, "holiday" | "exam" | "deadline"> = {
    holiday: "holiday", vacation: "holiday", break: "holiday",
    examination: "exam", exam: "exam", test: "exam", quiz: "exam",
    deadline: "deadline", submission: "deadline", result: "deadline",
  };

  for (const line of lines) {
    let date: string | null = null;

    for (const pattern of datePatterns) {
      const match = line.match(pattern);
      if (match) {
        if (/\d{1,2}[/-]\d{1,2}[/-]\d{4}/.test(match[0])) {
          const parts = match[0].split(/[/-]/);
          date = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
        } else if (/^\d{1,2}/.test(match[1])) {
          const day = match[1].padStart(2, "0");
          const month = monthMap[match[2].toLowerCase().substring(0, 3)];
          const year = match[3];
          if (month) date = `${year}-${month}-${day}`;
        } else {
          const month = monthMap[match[1].toLowerCase().substring(0, 3)];
          const day = match[2].padStart(2, "0");
          const year = match[3];
          if (month) date = `${year}-${month}-${day}`;
        }
        break;
      }
    }

    if (!date) continue;

    // Remove date from line to get title
    const title = line
      .replace(/\d{1,2}\s+\w+\s+\d{4}/g, "")
      .replace(/\d{1,2}[/-]\d{1,2}[/-]\d{4}/g, "")
      .replace(/\w+\s+\d{1,2}[,\s]+\d{4}/g, "")
      .replace(/[:\-–]/g, "")
      .trim();

    if (!title || title.length < 3) continue;

    // Detect type
    let type: "holiday" | "event" | "exam" | "deadline" | "other" = "event";
    const lower = title.toLowerCase();
    for (const [kw, t] of Object.entries(typeKeywords)) {
      if (lower.includes(kw)) { type = t; break; }
    }

    const colorMap = { holiday: "#FF6B35", event: "#FFD60A", exam: "#1a1a2e", deadline: "#EF4444", other: "#8DB48E" };

    events.push({ title, event_date: date, type, color: colorMap[type], is_manual: false });
  }

  return events;
}
