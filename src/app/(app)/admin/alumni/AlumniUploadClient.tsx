"use client";

import { useMemo, useState } from "react";
import { Upload, Users, CheckCircle, AlertCircle, Loader, Pencil, Trash2, Search, X } from "lucide-react";
import toast from "react-hot-toast";
import type { Alumni } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface UploadResult {
  inserted: number;
  updated: number;
  errors: string[];
}

export default function AlumniUploadClient({ currentCount, alumni: initial }: { currentCount: number; alumni: Alumni[] }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [preview, setPreview] = useState<Partial<Alumni>[]>([]);
  const [alumni, setAlumni] = useState(initial);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Alumni | null>(null);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const filteredAlumni = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return alumni;
    return alumni.filter((item) => [item.scholar_name, item.drn, item.email, item.batch, item.coe].some((value) => value?.toLowerCase().includes(query)));
  }, [alumni, search]);

  const updateField = (field: keyof Alumni, value: string) => setEditing((current) => current ? { ...current, [field]: value || null } : current);

  const saveAlumnus = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing || !editing.scholar_name.trim()) { toast.error("Scholar name is required."); return; }
    setSaving(true);
    const payload = {
      drn: editing.drn, scholar_name: editing.scholar_name, coe: editing.coe,
      parent_school: editing.parent_school, batch: editing.batch, phone: editing.phone,
      email: editing.email, photo_url: editing.photo_url,
    };
    const { data, error } = await supabase.from("alumni").update(payload).eq("id", editing.id).select().single();
    setSaving(false);
    if (error) { toast.error("Could not update this alumni record."); return; }
    setAlumni((current) => current.map((item) => item.id === editing.id ? data : item));
    setEditing(null); toast.success("Alumni record updated.");
  };

  const deleteAlumnus = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}'s alumni record?`)) return;
    const { error } = await supabase.from("alumni").delete().eq("id", id);
    if (error) { toast.error("Could not delete this alumni record."); return; }
    setAlumni((current) => current.filter((item) => item.id !== id));
    toast.success("Alumni record deleted.");
  };

  const handleFile = async (f: File) => {
    setFile(f);
    setResult(null);
    setPreview([]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/alumni-upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Upload failed.");
      } else {
        setResult(data);
        toast.success(`Uploaded: ${data.inserted} new, ${data.updated} updated.`);
        setFile(null);
        setPreview([]);
      }
    } catch {
      toast.error("Upload failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-fredoka font-700 text-navy text-2xl">Alumni Upload</h2>
        <div className="badge-cartoon bg-yellow">{currentCount} records</div>
      </div>

      {/* Instructions */}
      <div className="card-cartoon bg-yellow/30 p-5 mb-6">
        <h3 className="font-fredoka font-600 text-navy text-base mb-2">Excel Format</h3>
        <p className="font-nunito text-sm text-navy/70 mb-2">
          Your Excel file should have these column headers (case-insensitive):
        </p>
        <div className="flex flex-wrap gap-2">
          {["DRN", "Scholar Name", "COE", "Parent School", "Batch", "Phone Number", "Email"].map((col) => (
            <span key={col} className="badge-cartoon bg-white text-navy text-xs">{col}</span>
          ))}
        </div>
      </div>

      {/* Upload area */}
      <label className="block card-cartoon bg-white p-10 text-center cursor-pointer hover:shadow-cartoon-coral transition-all mb-4">
        <Upload size={40} className="text-navy/30 mx-auto mb-3" />
        <p className="font-fredoka font-600 text-navy text-lg mb-1">
          {file ? file.name : "Click to upload Excel file"}
        </p>
        <p className="font-nunito text-sm text-navy/50">.xlsx or .xls files only</p>
        <input
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </label>

      {/* Preview */}
      {file && (
        <div className="mb-6">
          {preview.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-nunito border-2 border-navy rounded-lg overflow-hidden">
              <thead className="bg-navy text-cream">
                <tr>
                  {["DRN", "Name", "COE", "School", "Batch", "Phone", "Email"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-cream"}>
                    <td className="px-3 py-2 border-t border-navy/10">{row.drn}</td>
                    <td className="px-3 py-2 border-t border-navy/10">{row.scholar_name}</td>
                    <td className="px-3 py-2 border-t border-navy/10">{row.coe}</td>
                    <td className="px-3 py-2 border-t border-navy/10">{row.parent_school}</td>
                    <td className="px-3 py-2 border-t border-navy/10">{row.batch}</td>
                    <td className="px-3 py-2 border-t border-navy/10">{row.phone}</td>
                    <td className="px-3 py-2 border-t border-navy/10">{row.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}

          <p className="font-nunito text-sm text-navy/70">Ready to upload: {file.name}</p>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="btn-cartoon btn-coral mt-4 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader size={16} className="animate-spin" /> Uploading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Users size={16} /> Upload All Records
              </span>
            )}
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="card-cartoon bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={20} className="text-green-500" />
            <h3 className="font-fredoka font-600 text-navy text-lg">Upload Complete</h3>
          </div>
          <div className="flex gap-6">
            <div><p className="font-fredoka font-700 text-3xl text-coral">{result.inserted}</p><p className="font-nunito text-xs text-navy/60">New records</p></div>
            <div><p className="font-fredoka font-700 text-3xl text-navy">{result.updated}</p><p className="font-nunito text-xs text-navy/60">Updated</p></div>
          </div>
          {result.errors.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={16} className="text-red-500" />
                <p className="font-nunito font-600 text-sm text-navy">Errors ({result.errors.length})</p>
              </div>
              <ul className="text-xs font-nunito text-red-600 flex flex-col gap-1">
                {result.errors.slice(0, 5).map((e, i) => <li key={i}>{e}</li>)}
                {result.errors.length > 5 && <li>...and {result.errors.length - 5} more</li>}
              </ul>
            </div>
          )}
        </div>
      )}

      <section className="mt-10 border-t-2 border-navy/15 pt-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><h3 className="font-fredoka text-xl font-700 text-navy">Manage Alumni Records</h3><p className="font-nunito text-sm text-navy/60">Edit or remove individual directory entries.</p></div>
          <div className="relative w-full sm:w-72"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search records" className="input-cartoon pl-9" /></div>
        </div>
        <p className="mb-3 font-nunito text-xs text-navy/50">Showing {filteredAlumni.length} of {alumni.length} records</p>
        <div className="overflow-x-auto card-cartoon bg-white">
          <table className="w-full min-w-[700px] text-left font-nunito text-sm"><thead className="border-b-2 border-navy bg-cream text-navy"><tr><th className="px-4 py-3">Scholar</th><th className="px-4 py-3">DRN</th><th className="px-4 py-3">Batch</th><th className="px-4 py-3">COE</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>
            {filteredAlumni.map((item) => <tr key={item.id} className="border-b border-navy/10 last:border-0"><td className="px-4 py-3 font-semibold text-navy">{item.scholar_name}</td><td className="px-4 py-3">{item.drn || "—"}</td><td className="px-4 py-3">{item.batch || "—"}</td><td className="px-4 py-3">{item.coe || "—"}</td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => setEditing(item)} aria-label={`Edit ${item.scholar_name}`} className="btn-cartoon btn-white px-3 py-1.5"><Pencil size={14} /></button><button onClick={() => deleteAlumnus(item.id, item.scholar_name)} aria-label={`Delete ${item.scholar_name}`} className="btn-cartoon border-red-400 bg-white px-3 py-1.5 text-red-500 shadow-[2px_2px_0_#ef4444]"><Trash2 size={14} /></button></div></td></tr>)}
            {filteredAlumni.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-navy/50">No alumni records found.</td></tr>}
          </tbody></table>
        </div>
      </section>

      {editing && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-navy/60 p-4 backdrop-blur-sm"><div className="card-cartoon relative my-4 w-full max-w-2xl bg-white p-6"><button onClick={() => setEditing(null)} className="absolute right-4 top-4 text-navy/40 hover:text-navy" aria-label="Close"><X size={20} /></button><h3 className="mb-5 font-fredoka text-xl font-700 text-navy">Edit Alumni Record</h3><form onSubmit={saveAlumnus} className="grid gap-4 sm:grid-cols-2">{([['scholar_name', 'Scholar Name *', 'text'], ['drn', 'DRN', 'text'], ['batch', 'Batch', 'text'], ['coe', 'COE', 'text'], ['parent_school', 'Parent School', 'text'], ['phone', 'Phone', 'tel'], ['email', 'Email', 'email'], ['photo_url', 'Photo URL', 'url']] as const).map(([field, label, type]) => <div key={field}><label className="mb-1 block font-nunito text-sm font-600 text-navy">{label}</label><input required={field === 'scholar_name'} type={type} value={editing[field] || ''} onChange={(event) => updateField(field, event.target.value)} className="input-cartoon" /></div>)}<button type="submit" disabled={saving} className="btn-cartoon btn-coral mt-2 sm:col-span-2 disabled:opacity-60">{saving ? 'Saving...' : 'Save Changes'}</button></form></div></div>}
    </div>
  );
}
