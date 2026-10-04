import type { CalendarEventType } from "@/lib/types";

export interface ImportedCalendarEvent { title: string; event_date: string; end_date: string | null; type: CalendarEventType; color: string; is_manual: false; }

const MONTHS = { jan: "01", january: "01", feb: "02", february: "02", mar: "03", march: "03", apr: "04", april: "04", may: "05", jun: "06", june: "06", jul: "07", july: "07", aug: "08", august: "08", sep: "09", september: "09", oct: "10", october: "10", nov: "11", november: "11", dec: "12", december: "12" } as const;
const MONTH_NAME = "Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?";
const DATE = `(\\d{1,2}\\s+(?:${MONTH_NAME})\\s+\\d{4})`;
const WEEKDAY = "(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)";
const DATE_RANGE = new RegExp(`${DATE}(?:\\s*,?\\s*${WEEKDAY})?(?:\\s+to\\s+${DATE}(?:\\s*,?\\s*${WEEKDAY})?)?`, "gi");
const COLORS: Record<CalendarEventType, string> = { holiday: "#FF6B35", event: "#FFD60A", exam: "#1a1a2e", deadline: "#EF4444", other: "#8DB48E" };

function toIsoDate(value: string) {
  const [, day, month, year] = value.match(new RegExp(`^(\\d{1,2})\\s+(${MONTH_NAME})\\s+(\\d{4})$`, "i")) ?? [];
  const monthNumber = month ? MONTHS[month.toLowerCase() as keyof typeof MONTHS] : undefined;
  return day && monthNumber && year ? `${year}-${monthNumber}-${day.padStart(2, "0")}` : null;
}
function cleanTitle(value: string) {
  return value.replace(/\s+/g, " ").replace(/^Indian Institute of Technology Guwahati Academic Calendar for the Year \d{4}\s*/i, "").replace(/^(?:Winter Semester(?:\s*&\s*Summer Term)?|Summer Term|Monsoon Semester)(?:\s+of)?\s+AY\s+\d{4}-\d{4}\s*/i, "").replace(/^Commencement Dates of Winter Semester of AY \d{4}-\d{4}\s*/i, "").replace(/\b(?:Evening of|First Week of|Second Week of|Third Week of)\s*$/i, "").trim();
}
function eventType(title: string): CalendarEventType {
  const lower = title.toLowerCase();
  if (/holiday|vacation|no class|no exam day/.test(lower)) return "holiday";
  if (/exam|examination/.test(lower)) return "exam";
  if (/last date|deadline|submission|registration|appeal/.test(lower)) return "deadline";
  return "event";
}

/** Extract narrative schedule pages; month-grid pages have no reliable text order. */
export function parseAcademicCalendar(text: string): ImportedCalendarEvent[] {
  const pages = text.split(/\n\s*\d+\s*\|\s*\d+\s*\n/).slice(1);
  const events: ImportedCalendarEvent[] = [];
  const seen = new Set<string>();
  for (const page of pages) {
    if (/\bMonth\s+Monday\s+Tuesday\s+Wednesday\s+Thursday\s+Friday\s+Saturday\s+Sunday\b/i.test(page)) continue;
    const content = page.replace(/\s+/g, " ").trim(); let cursor = 0;
    for (const match of content.matchAll(DATE_RANGE)) {
      const title = cleanTitle(content.slice(cursor, match.index)); const event_date = toIsoDate(match[1]); const end_date = match[2] ? toIsoDate(match[2]) : null; cursor = (match.index ?? 0) + match[0].length;
      if (!title || !event_date || title.length < 3) continue;
      const type = eventType(title); const key = `${title.toLowerCase()}|${event_date}`;
      if (seen.has(key)) continue; seen.add(key); events.push({ title, event_date, end_date, type, color: COLORS[type], is_manual: false });
    }
  }
  return events;
}
