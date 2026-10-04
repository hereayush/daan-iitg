"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Plus, Trash2, Zap, X, Upload } from "lucide-react";
import type { Event } from "@/lib/types";
import ImageCropper from "@/components/ImageCropper";

interface Props { events: Event[]; }
export default function EventsAdmin({ events: initial }: Props) {
  const [events, setEvents] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", event_date: "" });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) { toast.error("Title required."); return; }
    setLoading(true);
    let photo_url: string | null = null;
    if (file) {
      const ext = file.name.split(".").pop();
      const path = `events/${Date.now()}.${ext}`;
      const { error: ue } = await supabase.storage.from("daan-media").upload(path, file, { upsert: true });
      if (ue) { toast.error(`Photo upload failed: ${ue.message}`); setLoading(false); return; }
      const { data } = supabase.storage.from("daan-media").getPublicUrl(path); photo_url = data.publicUrl;
    }
    const { data: user } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("events").insert({
      title: form.title, description: form.description || null,
      event_date: form.event_date || null, photo_url, created_by: user.user?.id,
    }).select().single();
    if (error) { toast.error("Failed."); } else {
      toast.success("Event posted!");
      setEvents((p) => [data, ...p]);
      setShowForm(false);
      setForm({ title: "", description: "", event_date: "" }); setFile(null); setPreview(null);
      fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Event!", body: data.title, url: "/events" }) });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete event?")) return;
    await supabase.from("events").delete().eq("id", id);
    setEvents((p) => p.filter((e) => e.id !== id));
    toast.success("Deleted.");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-fredoka font-700 text-navy text-2xl">Events</h2>
        <button onClick={() => setShowForm(true)} className="btn-cartoon btn-coral text-sm px-4 py-2"><Plus size={16} /> New Event</button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="card-cartoon bg-white w-full max-w-lg p-6 relative my-4">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-navy/40 hover:text-navy"><X size={20} /></button>
            <h3 className="font-fredoka font-700 text-navy text-xl mb-5">Post Event</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div><label className="font-nunito font-600 text-sm text-navy mb-1 block">Title *</label><input required className="input-cartoon" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></div>
              <div><label className="font-nunito font-600 text-sm text-navy mb-1 block">Event Date</label><input type="date" className="input-cartoon" value={form.event_date} onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))} /></div>
              <div><label className="font-nunito font-600 text-sm text-navy mb-1 block">Description</label><textarea className="input-cartoon" rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></div>
              <div>
                <label className="font-nunito font-600 text-sm text-navy mb-1 block">Photo</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-navy rounded-lg cursor-pointer bg-cream hover:bg-yellow/20">
                  {preview ? <img src={preview} alt="p" className="h-full object-contain rounded-lg" /> : <><Upload size={24} className="text-navy/40 mb-1" /><span className="font-nunito text-sm text-navy/50">Upload photo</span></>}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { 
                    const f = e.target.files?.[0]; 
                    if(f){ setCropSrc(URL.createObjectURL(f)); } 
                    e.target.value = "";
                  }} />
                </label>
              </div>
              <button type="submit" disabled={loading} className="btn-cartoon btn-coral w-full mt-2 disabled:opacity-60">{loading ? "Posting..." : "Post Event"}</button>
            </form>
          </div>
        </div>
      )}

      {cropSrc && (
        <ImageCropper
          imageSrc={cropSrc}
          aspect={16/9}
          onCancel={() => setCropSrc(null)}
          onCropComplete={(blob) => {
            const f = new File([blob], "cropped.jpg", { type: "image/jpeg" });
            setFile(f);
            setPreview(URL.createObjectURL(blob));
            setCropSrc(null);
          }}
        />
      )}
      <div className="flex flex-col gap-4">
        {events.length === 0 && <div className="card-cartoon bg-white p-12 text-center"><Zap size={40} className="text-navy/20 mx-auto mb-3" /><p className="font-nunito text-navy/50">No events yet.</p></div>}
        {events.map((ev) => (
          <div key={ev.id} className="card-cartoon bg-white p-4 flex items-center gap-4">
            <div className="w-16 h-16 border-2 border-navy rounded-lg overflow-hidden flex-shrink-0 bg-yellow flex items-center justify-center">
              {ev.photo_url ? <img src={ev.photo_url} alt={ev.title} className="w-full h-full object-cover" /> : <Zap size={22} className="text-navy/40" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-fredoka font-600 text-navy text-base truncate">{ev.title}</h4>
              {ev.event_date && <p className="font-nunito text-sm text-coral">{new Date(ev.event_date).toLocaleDateString("en-IN")}</p>}
            </div>
            <button onClick={() => handleDelete(ev.id)} className="btn-cartoon bg-white text-red-500 border-red-400 shadow-[2px_2px_0_#ef4444] text-sm px-3 py-1.5 flex-shrink-0"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
