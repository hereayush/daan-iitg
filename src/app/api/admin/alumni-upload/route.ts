import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import * as XLSX from "xlsx";

// Normalise a header: lower case, letters and digits only
const norm = (v: unknown) =>
  String(v ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const clean = (v: unknown): string => {
  if (v === null || v === undefined) return "";
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

type Rec = {
  drn: string | null;
  scholar_name: string;
  coe: string | null;
  parent_school: string | null;
  batch: string | null;
  phone: string | null;
  email: string | null;
};

const firstNonEmpty = (row: unknown[], idxs: number[]) => {
  for (const i of idxs) {
    const v = clean(row[i]);
    if (v) return v;
  }
  return "";
};

// Parse one sheet. Uses the header row if there is one, otherwise the fixed column order
// DRN, Name, (note), Batch, Gender, Phone, Phone 2, (blank), Email, Email 2, Parent School, COE
function parseSheet(grid: unknown[][]): { recs: Rec[]; mode: "header" | "positional" | "none" } {
  const recs: Rec[] = [];

  let headerIdx = -1;
  for (let r = 0; r < Math.min(grid.length, 30); r++) {
    const cells = (grid[r] || []).map(norm);
    const hasName = cells.some((c) => ALIASES.scholar_name.includes(c));
    const hasOther = cells.some((c) => ALIASES.drn.includes(c) || ALIASES.phone.includes(c));
    if (hasName && hasOther) { headerIdx = r; break; }
  }

  if (headerIdx >= 0) {
    const headerCells = (grid[headerIdx] || []).map(norm);
    const cols: Record<string, number[]> = {};
    for (const [field, names] of Object.entries(ALIASES)) {
      cols[field] = headerCells.map((c, i) => (names.includes(c) ? i : -1)).filter((i) => i >= 0);
    }
    // Unlabelled columns right after Phone / Email are extra numbers / emails
    const extras = (field: "phone" | "email") => {
      const main = cols[field][0];
      if (main === undefined) return [] as number[];
      const out: number[] = [];
      for (let i = main + 1; i <= headerCells.length; i++) {
        if (headerCells[i]) break;
        out.push(i);
      }
      return out;
    };
    const phoneCols = [...cols.phone, ...extras("phone")];
    const emailCols = [...cols.email, ...extras("email")];

    for (let r = headerIdx + 1; r < grid.length; r++) {
      const row = grid[r] || [];
      const drn = firstNonEmpty(row, cols.drn);
      const name = firstNonEmpty(row, cols.scholar_name);
      if (!name) continue;
      recs.push({
        drn: drn || null,
        scholar_name: name,
        coe: firstNonEmpty(row, cols.coe) || null,
        parent_school: firstNonEmpty(row, cols.parent_school) || null,
        batch: firstNonEmpty(row, cols.batch) || null,
        phone: firstNonEmpty(row, phoneCols) || null,
        email: firstNonEmpty(row, emailCols) || null,
      });
    }
    return { recs, mode: "header" };
  }

  // No header: fixed column order, only rows that start with a numeric DRN
  for (const row of grid) {
    const drn = clean(row[0]);
    const name = clean(row[1]);
    if (!/^\d{6,}$/.test(drn) || !name) continue;
    recs.push({
      drn,
      scholar_name: name,
      coe: clean(row[11]) || clean(row[2]) || null,
      parent_school: clean(row[10]) || null,
      batch: clean(row[3]) || null,
      phone: firstNonEmpty(row, [5, 6, 7]) || null,
      email: firstNonEmpty(row, [8, 9]) || null,
    });
  }
  return { recs, mode: recs.length ? "positional" : "none" };
}

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

  const wb = XLSX.read(await file.arrayBuffer());

  const errors: string[] = [];
  const withDrn = new Map<string, Rec>();
  const withoutDrn: Rec[] = [];

  // Read every sheet in the workbook
  for (const sheetName of wb.SheetNames) {
    const grid = XLSX.utils.sheet_to_json<unknown[]>(wb.Sheets[sheetName], {
      header: 1,
      defval: "",
      raw: false,
    });
    const { recs, mode } = parseSheet(grid);
    if (mode === "none") {
      errors.push(`Sheet "${sheetName}": no alumni rows found, skipped.`);
      continue;
    }
    for (const rec of recs) {
      if (rec.drn) withDrn.set(rec.drn, rec);
      else withoutDrn.push(rec);
    }
  }

  const total = withDrn.size + withoutDrn.length;
  if (total === 0) {
    return NextResponse.json(
      { error: "No alumni rows found. Check that the file has Scholar Name and DRN / Phone columns." },
      { status: 400 }
    );
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
      errors.push(`Records ${i + 1} to ${i + chunk.length}: ${error.message}`);
    } else {
      chunk.forEach((c) => (existing.has(c.drn as string) ? updated++ : inserted++));
    }
  }

  for (let i = 0; i < withoutDrn.length; i += 200) {
    const chunk = withoutDrn.slice(i, i + 200);
    const { error } = await supabase.from("alumni").insert(chunk);
    if (error) errors.push(`Records without DRN: ${error.message}`);
    else inserted += chunk.length;
  }

  return NextResponse.json({ inserted, updated, errors, total });
}
