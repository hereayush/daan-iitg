"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Upload, Trash2, Plus, Trophy, X } from "lucide-react";
import type { Achievement } from "@/lib/types";
import { useRouter } from "next/navigation";

interface Props {
  achievements: Achievement[];
  isAdmin: boolean;
}

export default function AchievementsAdmin({ achievements: initial, isAdmin }: Props) {
  const [achievements, setAchievements] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) { toast.error("Title is required."); return; }
    setLoading(true);

    let photo_url: string | null = null;

    if (file) {
      const ext = file.name.split(".").pop();
      const path = `achievements/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("daan-media")
        .upload(path, file, { upsert: true });
      if (uploadError) {
        toast.error("Image upload failed.");
        setLoading(false);
        return;
      }
      const { data } = supabase.storage.from("daan-media").getPublicUrl(path);
      photo_url = data.publicUrl;
    }

    const { data: user } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("achievements")
      .insert({ title, caption: caption || null, description: description || null, photo_url, created_by: user.user?.id })
      .select()
      .single();

    if (error) {
      toast.error("Failed to post achievement.");
    } else {
      toast.success("Achievement posted!");
      setAchievements((prev) => [data, ...prev]);
      setShowForm(false);
      setTitle(""); setCaption(""); setDescription(""); setFile(null); setPreview(null);
      // Trigger push notification
      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Achievement!", body: data.title, url: "/achievements" }),
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) { toast.error("Only admin can delete."); return; }
    if (!confirm("Delete this achievement?")) return;
    const { error } = await supabase.from("achievements").delete().eq("id", id);
    if (!error) {
      setAchievements((prev) => prev.filter((a) => a.id !== id));
      toast.success("Deleted.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-fredoka font-700 text-navy text-2xl">Achievements</h2>
        <button onClick={() => setShowForm(true)} className="btn-cartoon btn-coral text-sm px-4 py-2">
          <Plus size={16} /> New Achievement
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="card-cartoon bg-white w-full max-w-lg p-6 relative my-4">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-navy/40 hover:text-navy">
              <X size={20} />
            </button>
            <h3 className="font-fredoka font-700 text-navy text-xl mb-5">Post Achievement</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="font-nunito font-600 text-sm text-navy mb-1 block">Title *</label>
                <input required className="input-cartoon" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Achievement title" />
              </div>
              <div>
                <label className="font-nunito font-600 text-sm text-navy mb-1 block">Caption</label>
                <input className="input-cartoon" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Short caption" />
              </div>
              <div>
                <label className="font-nunito font-600 text-sm text-navy mb-1 block">Description</label>
                <textarea className="input-cartoon" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Full description..." />
              </div>
              <div>
                <label className="font-nunito font-600 text-sm text-navy mb-1 block">Photo</label>
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-navy rounded-lg cursor-pointer bg-cream hover:bg-yellow/30 transition-colors">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload size={28} className="text-navy/40 mb-2" />
                      <span className="font-nunito text-sm text-navy/50">Click to upload image</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                </label>
              </div>
              <button type="submit" disabled={loading} className="btn-cartoon btn-coral w-full mt-2 disabled:opacity-60">
                {loading ? "Posting..." : "Post Achievement"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex flex-col gap-4">
        {achievements.length === 0 && (
          <div className="card-cartoon bg-white p-12 text-center">
            <Trophy size={40} className="text-navy/20 mx-auto mb-3" />
            <p className="font-nunito text-navy/50">No achievements yet. Post your first one!</p>
          </div>
        )}
        {achievements.map((a) => (
          <div key={a.id} className="card-cartoon bg-white p-4 flex items-center gap-4">
            <div className="w-16 h-16 border-2 border-navy rounded-lg overflow-hidden flex-shrink-0 bg-yellow flex items-center justify-center">
              {a.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.photo_url} alt={a.title} className="w-full h-full object-cover" />
              ) : (
                <Trophy size={24} className="text-navy/40" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-fredoka font-600 text-navy text-base truncate">{a.title}</h4>
              {a.caption && <p className="font-nunito text-sm text-coral truncate">{a.caption}</p>}
              <p className="font-nunito text-xs text-navy/40">{new Date(a.created_at).toLocaleDateString("en-IN")}</p>
            </div>
            {isAdmin && (
              <button onClick={() => handleDelete(a.id)} className="btn-cartoon bg-white text-red-500 border-red-400 shadow-[2px_2px_0_#ef4444] text-sm px-3 py-1.5 flex-shrink-0">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
