"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Upload, Trash2, Plus, Star, X, Pencil, Users, Clock } from "lucide-react";
import type { CouncilMember } from "@/lib/types";
import ImageCropper from "@/components/ImageCropper";

interface Props { members: CouncilMember[]; isAdmin: boolean; }

const CURRENT_YEAR = new Date().getFullYear();

const defaultForm = {
  name: "",
  designation: "",
  phone: "",
  email: "",
  linkedin_url: "",
  display_order: "0",
  is_current: true,
  batch_year: String(CURRENT_YEAR),
};

export default function CouncilAdmin({ members: initial, isAdmin }: Props) {
  const [members, setMembers] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CouncilMember | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const resetForm = () => {
    setEditing(null);
    setForm(defaultForm);
    setFile(null);
    setPreview(null);
    setCropSrc(null);
    setShowForm(false);
  };

  const openEdit = (member: CouncilMember) => {
    setEditing(member);
    setForm({
      name: member.name,
      designation: member.designation,
      phone: member.phone || "",
      email: member.email || "",
      linkedin_url: member.linkedin_url || "",
      display_order: String(member.display_order),
      is_current: member.is_current,
      batch_year: member.batch_year ? String(member.batch_year) : String(CURRENT_YEAR),
    });
    setFile(null);
    setPreview(member.photo_url);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.designation) { toast.error("Name and designation required."); return; }
    setLoading(true);
    let photo_url: string | null = editing?.photo_url || null;
    if (file) {
      const ext = file.name.split(".").pop();
      const path = `council/${Date.now()}.${ext}`;
      const { error: ue } = await supabase.storage.from("daan-media").upload(path, file, { upsert: true });
      if (ue) { toast.error(`Photo upload failed: ${ue.message}`); setLoading(false); return; }
      const { data } = supabase.storage.from("daan-media").getPublicUrl(path);
      photo_url = data.publicUrl;
    }
    const { data: user } = await supabase.auth.getUser();
    const payload = {
      name: form.name,
      designation: form.designation,
      phone: form.phone || null,
      email: form.email || null,
      linkedin_url: form.linkedin_url || null,
      display_order: parseInt(form.display_order),
      photo_url,
      is_current: form.is_current,
      batch_year: form.is_current ? null : parseInt(form.batch_year),
    };
    const query = editing
      ? supabase.from("council_members").update(payload).eq("id", editing.id)
      : supabase.from("council_members").insert({ ...payload, created_by: user.user?.id });
    const { data, error } = await query.select().single();
    if (error) { toast.error("Failed to save."); } else {
      toast.success(editing ? "Council member updated!" : "Council member added!");
      setMembers((p) =>
        (editing ? p.map((item) => item.id === data.id ? data : item) : [...p, data])
          .sort((a, b) => a.display_order - b.display_order)
      );
      resetForm();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) { toast.error("Only admin can delete council members."); return; }
    if (!confirm("Delete this member?")) return;
    const { error } = await supabase.from("council_members").delete().eq("id", id);
    if (!error) { setMembers((p) => p.filter((m) => m.id !== id)); toast.success("Deleted."); }
    else toast.error("Could not delete this member.");
  };

  // Group members for display
  const currentMembers = members.filter((m) => m.is_current);
  const pastMembers = members.filter((m) => !m.is_current);
  const pastYears = [...new Set(pastMembers.map((m) => m.batch_year))].sort((a, b) => (b ?? 0) - (a ?? 0));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-fredoka font-700 text-navy text-2xl">Council Members</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-cartoon btn-coral text-sm px-4 py-2 flex items-center gap-2">
          <Plus size={16} /> Add Member
        </button>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="card-cartoon bg-white w-full max-w-lg p-6 relative my-4">
            <button onClick={resetForm} className="absolute top-4 right-4 text-navy/40 hover:text-navy"><X size={20} /></button>
            <h3 className="font-fredoka font-700 text-navy text-xl mb-5">{editing ? "Edit Council Member" : "Add Council Member"}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Text fields */}
              {([["name","Name *","text"],["designation","Designation *","text"],["phone","Phone","tel"],["email","Email","email"],["linkedin_url","LinkedIn URL","url"]] as [string,string,string][]).map(([key,label,type]) => (
                <div key={key}>
                  <label className="font-nunito font-600 text-sm text-navy mb-1 block">{label}</label>
                  <input type={type} className="input-cartoon" value={(form as unknown as Record<string, string>)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}

              {/* Display order */}
              <div>
                <label className="font-nunito font-600 text-sm text-navy mb-1 block">Display Order</label>
                <input type="number" className="input-cartoon" value={form.display_order}
                  onChange={(e) => setForm((f) => ({ ...f, display_order: e.target.value }))} />
              </div>

              {/* Present / Past toggle */}
              <div>
                <label className="font-nunito font-600 text-sm text-navy mb-2 block">Council Status</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, is_current: true }))}
                    className={`flex-1 py-2.5 rounded-xl border-2 font-fredoka font-600 text-sm transition-all ${form.is_current ? "bg-coral border-navy text-white shadow-[3px_3px_0_#1a1a2e]" : "bg-white border-navy/30 text-navy/60 hover:border-navy/60"}`}
                  >
                    <Users size={14} className="inline mr-1.5" />Present Council
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, is_current: false }))}
                    className={`flex-1 py-2.5 rounded-xl border-2 font-fredoka font-600 text-sm transition-all ${!form.is_current ? "bg-navy border-navy text-white shadow-[3px_3px_0_#1a1a2e]" : "bg-white border-navy/30 text-navy/60 hover:border-navy/60"}`}
                  >
                    <Clock size={14} className="inline mr-1.5" />Past Council
                  </button>
                </div>
              </div>

              {/* Year field — only when Past is selected */}
              {!form.is_current && (
                <div>
                  <label className="font-nunito font-600 text-sm text-navy mb-1 block">Batch Year <span className="text-navy/50 font-normal">(e.g. 2025 for "DAAN Council 2025")</span></label>
                  <input
                    type="number"
                    className="input-cartoon"
                    min="2020"
                    max={CURRENT_YEAR + 1}
                    value={form.batch_year}
                    onChange={(e) => setForm((f) => ({ ...f, batch_year: e.target.value }))}
                  />
                </div>
              )}

              {/* Photo */}
              <div>
                <label className="font-nunito font-600 text-sm text-navy mb-1 block">Photo</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-navy rounded-lg cursor-pointer bg-cream hover:bg-yellow/20">
                  {preview ? <img src={preview} alt="preview" className="h-full object-contain rounded-lg" /> : <><Upload size={24} className="text-navy/40 mb-1" /><span className="font-nunito text-sm text-navy/50">Upload photo</span></>}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) { setCropSrc(URL.createObjectURL(f)); }
                    e.target.value = "";
                  }} />
                </label>
              </div>

              <button type="submit" disabled={loading} className="btn-cartoon btn-coral w-full mt-2 disabled:opacity-60">
                {loading ? "Saving..." : editing ? "Save Changes" : "Add Member"}
              </button>
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

      {/* ---- Present Council ---- */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-coral border-2 border-navy flex items-center justify-center shadow-[2px_2px_0_#1a1a2e]">
            <Users size={14} className="text-white" />
          </div>
          <h3 className="font-fredoka font-700 text-navy text-lg">Present Council</h3>
          <span className="text-xs font-nunito font-600 bg-coral/10 text-coral border border-coral/30 rounded-full px-2.5 py-0.5">{currentMembers.length}</span>
        </div>
        {currentMembers.length === 0 ? (
          <div className="card-cartoon bg-white p-8 text-center">
            <Star size={32} className="text-navy/20 mx-auto mb-2" />
            <p className="font-nunito text-navy/50 text-sm">No current council members added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentMembers.map((m) => <MemberCard key={m.id} m={m} isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} />)}
          </div>
        )}
      </div>

      {/* ---- Past Councils by year ---- */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-navy border-2 border-navy flex items-center justify-center shadow-[2px_2px_0_#1a1a2e]">
            <Clock size={14} className="text-white" />
          </div>
          <h3 className="font-fredoka font-700 text-navy text-lg">Past Councils</h3>
          <span className="text-xs font-nunito font-600 bg-navy/10 text-navy border border-navy/20 rounded-full px-2.5 py-0.5">{pastMembers.length}</span>
        </div>

        {pastYears.length === 0 ? (
          <div className="card-cartoon bg-white p-8 text-center">
            <Clock size={32} className="text-navy/20 mx-auto mb-2" />
            <p className="font-nunito text-navy/50 text-sm">No past council members added yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {pastYears.map((year) => {
              const yearMembers = pastMembers.filter((m) => m.batch_year === year);
              return (
                <div key={year} className="card-cartoon bg-white p-4">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-navy/10">
                    <span className="font-fredoka font-700 text-navy text-base">DAAN Council {year}</span>
                    <span className="text-xs font-nunito font-600 bg-yellow border border-navy/20 rounded-full px-2.5 py-0.5 text-navy">{yearMembers.length} members</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {yearMembers.map((m) => <MemberCard key={m.id} m={m} isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} />)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function MemberCard({ m, isAdmin, onEdit, onDelete }: { m: CouncilMember; isAdmin: boolean; onEdit: (m: CouncilMember) => void; onDelete: (id: string) => void; }) {
  return (
    <div className="card-cartoon bg-cream p-4 flex items-center gap-4">
      <div className="w-14 h-14 border-2 border-navy rounded-xl overflow-hidden flex-shrink-0 bg-yellow flex items-center justify-center">
        {m.photo_url ? <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" /> : <Star size={22} className="text-navy/40" />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-fredoka font-600 text-navy text-base truncate">{m.name}</h4>
        <p className="font-nunito text-sm text-coral truncate">{m.designation}</p>
      </div>
      {isAdmin && (
        <div className="flex gap-2">
          <button onClick={() => onEdit(m)} aria-label={`Edit ${m.name}`} className="btn-cartoon btn-white text-sm px-3 py-1.5 flex-shrink-0"><Pencil size={14} /></button>
          <button onClick={() => onDelete(m.id)} aria-label={`Delete ${m.name}`} className="btn-cartoon bg-white text-red-500 border-red-400 shadow-[2px_2px_0_#ef4444] text-sm px-3 py-1.5 flex-shrink-0"><Trash2 size={14} /></button>
        </div>
      )}
    </div>
  );
}
