"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Upload, Trash2, Plus, Star, X } from "lucide-react";
import type { CouncilMember } from "@/lib/types";
import ImageCropper from "@/components/ImageCropper";

interface Props { members: CouncilMember[]; isAdmin: boolean; }

export default function CouncilAdmin({ members: initial, isAdmin }: Props) {
  const [members, setMembers] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", designation: "", phone: "", email: "", linkedin_url: "", display_order: "0" });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.designation) { toast.error("Name and designation required."); return; }
    setLoading(true);
    let photo_url: string | null = null;
    if (file) {
      const ext = file.name.split(".").pop();
      const path = `council/${Date.now()}.${ext}`;
      const { error: ue } = await supabase.storage.from("daan-media").upload(path, file, { upsert: true });
      if (ue) {
        toast.error(`Photo upload failed: ${ue.message}`);
        setLoading(false);
        return;
      }
      const { data } = supabase.storage.from("daan-media").getPublicUrl(path);
      photo_url = data.publicUrl;
    }
    const { data: user } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("council_members").insert({
      name: form.name, designation: form.designation, phone: form.phone || null,
      email: form.email || null, linkedin_url: form.linkedin_url || null,
      display_order: parseInt(form.display_order), photo_url, created_by: user.user?.id,
    }).select().single();
    if (error) { toast.error("Failed to add."); } else {
      toast.success("Council member added!");
      setMembers((p) => [...p, data].sort((a, b) => a.display_order - b.display_order));
      setShowForm(false);
      setForm({ name: "", designation: "", phone: "", email: "", linkedin_url: "", display_order: "0" });
      setFile(null); setPreview(null);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this member?")) return;
    const { error } = await supabase.from("council_members").delete().eq("id", id);
    if (!error) { setMembers((p) => p.filter((m) => m.id !== id)); toast.success("Deleted."); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-fredoka font-700 text-navy text-2xl">Council Members</h2>
        <button onClick={() => setShowForm(true)} className="btn-cartoon btn-coral text-sm px-4 py-2"><Plus size={16} /> Add Member</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="card-cartoon bg-white w-full max-w-lg p-6 relative my-4">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-navy/40 hover:text-navy"><X size={20} /></button>
            <h3 className="font-fredoka font-700 text-navy text-xl mb-5">Add Council Member</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {[["name","Name *","text"],["designation","Designation *","text"],["phone","Phone","tel"],["email","Email","email"],["linkedin_url","LinkedIn URL","url"]].map(([key,label,type]) => (
                <div key={key}>
                  <label className="font-nunito font-600 text-sm text-navy mb-1 block">{label}</label>
                  <input type={type} className="input-cartoon" value={(form as Record<string, string>)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label className="font-nunito font-600 text-sm text-navy mb-1 block">Display Order</label>
                <input type="number" className="input-cartoon" value={form.display_order}
                  onChange={(e) => setForm((f) => ({ ...f, display_order: e.target.value }))} />
              </div>
              <div>
                <label className="font-nunito font-600 text-sm text-navy mb-1 block">Photo</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-navy rounded-lg cursor-pointer bg-cream hover:bg-yellow/20">
                  {preview ? <img src={preview} alt="preview" className="h-full object-contain rounded-lg" /> : <><Upload size={24} className="text-navy/40 mb-1" /><span className="font-nunito text-sm text-navy/50">Upload photo</span></>}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { 
                    const f = e.target.files?.[0]; 
                    if(f){ setCropSrc(URL.createObjectURL(f)); } 
                    e.target.value = "";
                  }} />
                </label>
              </div>
              <button type="submit" disabled={loading} className="btn-cartoon btn-coral w-full mt-2 disabled:opacity-60">{loading ? "Saving..." : "Add Member"}</button>
            </form>
          </div>
        </div>
      )}

      {cropSrc && (
        <ImageCropper
          imageSrc={cropSrc}
          aspect={1}
          onCancel={() => setCropSrc(null)}
          onCropComplete={(blob) => {
            const f = new File([blob], "cropped.jpg", { type: "image/jpeg" });
            setFile(f);
            setPreview(URL.createObjectURL(blob));
            setCropSrc(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {members.length === 0 && <div className="col-span-2 card-cartoon bg-white p-12 text-center"><Star size={40} className="text-navy/20 mx-auto mb-3" /><p className="font-nunito text-navy/50">No members added yet.</p></div>}
        {members.map((m) => (
          <div key={m.id} className="card-cartoon bg-white p-4 flex items-center gap-4">
            <div className="w-14 h-14 border-2 border-navy rounded-xl overflow-hidden flex-shrink-0 bg-yellow flex items-center justify-center">
              {m.photo_url ? <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" /> : <Star size={22} className="text-navy/40" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-fredoka font-600 text-navy text-base truncate">{m.name}</h4>
              <p className="font-nunito text-sm text-coral truncate">{m.designation}</p>
            </div>
            <button onClick={() => handleDelete(m.id)} className="btn-cartoon bg-white text-red-500 border-red-400 shadow-[2px_2px_0_#ef4444] text-sm px-3 py-1.5 flex-shrink-0"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
