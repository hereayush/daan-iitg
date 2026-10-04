import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import * as XLSX from "xlsx";

// Normalise a header or cell: lower case, letters and digits only
const norm = (v: unknown) =>
  String(v ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const clean = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  if (typeof v === "number") return Number.isInteger(v) ? String(v) : String(v);
  return String(v).replace(/\s+/g, " ").trim();
};

const ALIASES: Record<string, string[]> = {
  drn: ["drn", "dakshanarollnumber", "rollnumber", "rollno", "dakshanarollno"],
  scholar_name: ["scholarname", "name", "studentname", "fullname"],
  coe: ["coe", "centreofexcellence", "centerofexcellence"],
  parent_school: ["parentschool", "school", "schoolname", "jnv", "parentschoolname"],
  batch: ["batch", "year", "jeebatch"],
  phone: ["phonenumber", "phone", "mobile", "mobilenumber", "contactnumber", "contact"],
  email: ["email", "emailid", "emailaddress", "mail"],
};

export async function POST(req: NextRequest) {
  const supabase = await createServiceClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const grid = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: "", raw: false });

  // Find the header row: first row (within the first 30) that has a name column and a DRN or phone column
  let headerIdx = -1;
  for (let r = 0; r < Math.min(grid.length, 30); r++) {
    const cells = (grid[r] || []).map(norm);
    const hasName = cells.some((c) => ALIASES.scholar_name.includes(c));
    const hasOther = cells.some((c) => ALIASES.drn.includes(c) || ALIASES.phone.includes(c));
    if (hasName && hasOther) { headerIdx = r; break; }
  }
  if (headerIdx === -1) {
    return NextResponse.json(
      { error: "Could not find a header row with Scholar Name and DRN / Phone Number columns." },
      { status: 400 }
    );
  }

  // Map each field to ALL columns that match (so extra phone / email columns are kept as fallbacks)
  const headerCells = (grid[headerIdx] || []).map(norm);
  const cols: Record<string, number[]> = {};
  for (const [field, names] of Object.entries(ALIASES)) {
    cols[field] = headerCells.map((c, i) => (names.includes(c) ? i : -1)).filter((i) => i >= 0);
  }

  // Columns after the main phone / email column that have an empty header are treated as extra numbers / emails
  const extraCols = (field: "phone" | "email") => {
    const main = cols[field][0];
    if (main === undefined) return [];
    const extras: number[] = [];
    for (let i = main + 1; i < headerCells.length + 1; i++) {
      if (headerCells[i]) break;
      extras.push(i);
    }
    return extras;
  };
  const phoneCols = [...cols.phone, ...extraCols("phone")];
  const emailCols = [...cols.email, ...extraCols("email")];

  const pick = (row: unknown[], idxs: number[]) => {
    for (const i of idxs) {
      const v = clean(row[i]);
      if (v) return v;
    }
    return "";
  };

  type Rec = {
    drn: string | null;
    scholar_name: string;
    coe: string | null;
    parent_school: string | null;
    batch: string | null;
    phone: string | null;
    email: string | null;
  };

  const errors: string[] = [];
  const withDrn = new Map<string, Rec>();
  const withoutDrn: Rec[] = [];

  for (let r = headerIdx + 1; r < grid.length; r++) {
    const row = grid[r] || [];
    const drn = pick(row, cols.drn);
    const scholar_name = pick(row, cols.scholar_name);

    // Completely empty or decorative rows are skipped silently
    if (!drn && !scholar_name) continue;
    if (!scholar_name) {
      errors.push(`Row ${r + 1}: Missing scholar name`);
      continue;
    }

    const rec: Rec = {
      drn: drn || null,
      scholar_name,
      coe: pick(row, cols.coe) || null,
      parent_school: pick(row, cols.parent_school) || null,
      batch: pick(row, cols.batch) || null,
      phone: pick(row, phoneCols) || null,
      email: pick(row, emailCols) || null,
    };

    if (rec.drn) withDrn.set(rec.drn, rec);
    else withoutDrn.push(rec);
  }

  // Work out which DRNs already exist so we can report new vs updated
  const drns = Array.from(withDrn.keys());
  const existing = new Set<string>();
  for (let i = 0; i < drns.length; i += 200) {
    const { data } = await supabase.from("alumni").select("drn").in("drn", drns.slice(i, i + 200));
    (data || []).forEach((d) => d.drn && existing.add(d.drn));
  }

  let inserted = 0;
  let updated = 0;

  const withDrnList = Array.from(withDrn.values());
  for (let i = 0; i < withDrnList.length; i += 200) {
    const chunk = withDrnList.slice(i, i + 200);
    const { error } = await supabase.from("alumni").upsert(chunk, { onConflict: "drn" });
    if (error) {
      errors.push(`Rows ${i + 1} to ${i + chunk.length} (with DRN): ${error.message}`);
    } else {
      chunk.forEach((c) => (existing.has(c.drn as string) ? updated++ : inserted++));
    }
  }

  for (let i = 0; i < withoutDrn.length; i += 200) {
    const chunk = withoutDrn.slice(i, i + 200);
    const { error } = await supabase.from("alumni").insert(chunk);
    if (error) errors.push(`Rows without DRN: ${error.message}`);
    else inserted += chunk.length;
  }

  return NextResponse.json({
    inserted,
    updated,
    errors,
    total: withDrn.size + withoutDrn.length,
  });
}
