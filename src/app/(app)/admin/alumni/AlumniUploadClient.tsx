"use client";

import { useState } from "react";
import { Upload, Users, CheckCircle, AlertCircle, Loader } from "lucide-react";
import toast from "react-hot-toast";
import type { Alumni } from "@/lib/types";

interface UploadResult {
  inserted: number;
  updated: number;
  errors: string[];
}

export default function AlumniUploadClient({ currentCount }: { currentCount: number }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [preview, setPreview] = useState<Partial<Alumni>[]>([]);

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
    </div>
  );
}
