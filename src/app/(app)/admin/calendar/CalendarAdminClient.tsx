"use client";
import { useState } from "react";
import { Upload, FileText, CheckCircle, Loader, Plus, Calendar } from "lucide-react";
import toast from "react-hot-toast";

interface ParsedEvent { title: string; event_date: string; type: string; }

export default function CalendarAdminClient() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ parsed: number; inserted: number; events: ParsedEvent[] } | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/calendar-upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed"); } else {
        setResult(data);
        toast.success(`Extracted ${data.inserted} events from PDF!`);
        setFile(null);
      }
    } catch { toast.error("Upload failed."); }
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-fredoka font-700 text-navy text-2xl mb-2">Calendar Management</h2>
        <p className="font-nunito text-navy/60 text-sm">Upload a PDF academic calendar and the system will automatically extract events. You can also add events manually on the Calendar page.</p>
      </div>

      {/* PDF Upload */}
      <div className="card-cartoon bg-white p-6 mb-6">
        <h3 className="font-fredoka font-600 text-navy text-lg mb-4 flex items-center gap-2">
          <FileText size={18} className="text-coral" /> Upload PDF Calendar
        </h3>
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-navy rounded-lg cursor-pointer bg-cream hover:bg-yellow/20 transition-colors mb-4">
          {file ? (
            <div className="text-center">
              <FileText size={32} className="text-coral mx-auto mb-2" />
              <p className="font-fredoka font-600 text-navy">{file.name}</p>
              <p className="font-nunito text-xs text-navy/50">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
          ) : (
            <>
              <Upload size={32} className="text-navy/30 mb-2" />
              <p className="font-fredoka font-600 text-navy">Click to upload PDF</p>
              <p className="font-nunito text-xs text-navy/50">Academic calendar PDF</p>
            </>
          )}
          <input type="file" accept=".pdf" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
        </label>
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="btn-cartoon btn-coral w-full disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2"><Loader size={16} className="animate-spin" /> Extracting events...</span>
          ) : (
            <span className="flex items-center gap-2"><Upload size={16} /> Extract & Import Calendar</span>
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="card-cartoon bg-white p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={20} className="text-green-500" />
            <h3 className="font-fredoka font-600 text-navy text-lg">Import Complete</h3>
          </div>
          <div className="flex gap-8 mb-4">
            <div><p className="font-fredoka font-700 text-3xl text-coral">{result.parsed}</p><p className="font-nunito text-xs text-navy/60">Detected</p></div>
            <div><p className="font-fredoka font-700 text-3xl text-navy">{result.inserted}</p><p className="font-nunito text-xs text-navy/60">Imported</p></div>
          </div>
          {result.events.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-nunito">
                <thead className="bg-navy text-cream">
                  <tr>
                    <th className="px-3 py-2 text-left">Title</th>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {result.events.slice(0, 10).map((e, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-cream"}>
                      <td className="px-3 py-1.5 border-t border-navy/10">{e.title}</td>
                      <td className="px-3 py-1.5 border-t border-navy/10">{new Date(e.event_date).toLocaleDateString("en-IN")}</td>
                      <td className="px-3 py-1.5 border-t border-navy/10 capitalize">{e.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {result.events.length > 10 && <p className="font-nunito text-xs text-navy/50 mt-2">...and {result.events.length - 10} more events</p>}
            </div>
          )}
        </div>
      )}

      {/* Manual add reminder */}
      <div className="card-cartoon bg-yellow/30 p-5">
        <div className="flex items-center gap-2 mb-1">
          <Plus size={16} className="text-navy" />
          <p className="font-fredoka font-600 text-navy text-base">Manual Event Entry</p>
        </div>
        <p className="font-nunito text-sm text-navy/70">
          To add, edit, or delete individual calendar events manually, go to the{" "}
          <a href="/calendar" className="text-coral font-600 hover:underline">Calendar page</a> and click on any date.
        </p>
      </div>
    </div>
  );
}
