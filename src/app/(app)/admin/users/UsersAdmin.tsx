"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Users, Shield, UserCheck, UserX } from "lucide-react";
import type { Profile, Role } from "@/lib/types";

interface Props { users: Profile[]; currentUserId: string; }

export default function UsersAdmin({ users: initial, currentUserId }: Props) {
  const [users, setUsers] = useState(initial);
  const supabase = createClient();

  const changeRole = async (userId: string, role: Role) => {
    if (userId === currentUserId) { toast.error("Cannot change your own role."); return; }
    const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
    if (error) { toast.error("Failed to update role."); return; }
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u));
    toast.success(`Role updated to ${role}.`);
  };

  const roleBadgeColor: Record<Role, string> = {
    admin: "bg-coral text-white",
    sub_admin: "bg-yellow text-navy",
    user: "bg-cream text-navy",
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-fredoka font-700 text-navy text-2xl flex items-center gap-2 mb-1">
          <Users size={22} className="text-coral" /> User Management
        </h2>
        <p className="font-nunito text-sm text-navy/60">
          Manage roles for all registered users. You can assign up to 2 sub-admins.
        </p>
      </div>

      {/* Sub-admin count warning */}
      {users.filter((u) => u.role === "sub_admin").length >= 2 && (
        <div className="card-cartoon bg-yellow/40 p-4 mb-4">
          <p className="font-nunito text-sm text-navy font-600">
            You already have 2 sub-admins. Remove one before adding another.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {users.map((u) => (
          <div key={u.id} className="card-cartoon bg-white p-4 flex items-center gap-4 flex-wrap">
            <div className="w-10 h-10 bg-yellow border-2 border-navy rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="font-fredoka font-700 text-navy text-base">
                {u.full_name?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-fredoka font-600 text-navy text-base truncate">{u.full_name || "No name"}</p>
              <p className="font-nunito text-xs text-navy/50 truncate">{u.email}</p>
            </div>
            <span className={`badge-cartoon text-xs ${roleBadgeColor[u.role]}`}>{u.role}</span>
            {u.id !== currentUserId && (
              <div className="flex gap-2 flex-shrink-0">
                {u.role !== "sub_admin" && (
                  <button
                    onClick={() => changeRole(u.id, "sub_admin")}
                    disabled={users.filter((x) => x.role === "sub_admin").length >= 2}
                    className="btn-cartoon btn-yellow text-xs px-2 py-1 disabled:opacity-40"
                    title="Make Sub-Admin"
                  >
                    <Shield size={12} /> Sub-Admin
                  </button>
                )}
                {u.role !== "user" && u.role !== "admin" && (
                  <button
                    onClick={() => changeRole(u.id, "user")}
                    className="btn-cartoon btn-white text-xs px-2 py-1"
                    title="Demote to User"
                  >
                    <UserX size={12} /> Demote
                  </button>
                )}
              </div>
            )}
            {u.id === currentUserId && (
              <span className="font-nunito text-xs text-navy/40 italic">You</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
