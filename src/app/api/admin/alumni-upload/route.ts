import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  const supabase = await createServiceClient();

  // Auth check
  const authHeader = req.headers.get("cookie") || "";
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
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: "" });

  const inserted: number[] = [];
  const updated: number[] = [];
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // Flexible column header matching
    const drn =
      row["DRN"] || row["drn"] || row["Dakshana Roll Number"] || null;
    const scholar_name =
      row["Scholar Name"] || row["Name"] || row["name"] || "";
    const coe = row["COE"] || row["coe"] || null;
    const parent_school =
      row["Parent School"] || row["School"] || row["school"] || null;
    const batch = row["Batch"] || row["batch"] || null;
    const phone =
      row["Phone Number"] || row["Phone"] || row["phone"] || null;
    const email = row["Email"] || row["email"] || null;

    if (!scholar_name) {
      errors.push(`Row ${i + 2}: Missing scholar name`);
      continue;
    }

    try {
      if (drn) {
        // Upsert by DRN
        const { error } = await supabase
          .from("alumni")
          .upsert(
            { drn, scholar_name, coe, parent_school, batch, phone, email },
            { onConflict: "drn" }
          );
        if (error) {
          errors.push(`Row ${i + 2}: ${error.message}`);
        } else {
          inserted.push(i);
        }
      } else {
        // Insert without DRN
        const { error } = await supabase
          .from("alumni")
          .insert({ scholar_name, coe, parent_school, batch, phone, email });
        if (error) {
          errors.push(`Row ${i + 2}: ${error.message}`);
        } else {
          inserted.push(i);
        }
      }
    } catch (err) {
      errors.push(`Row ${i + 2}: Unexpected error`);
    }
  }

  return NextResponse.json({
    inserted: inserted.length,
    updated: updated.length,
    errors,
    total: rows.length,
  });
}
