import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Trophy, Users, Star, Zap, Calendar, Upload, Bell, Settings } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Panel" };

const adminLinks = [
  { href: "/admin/achievements", label: "Achievements", icon: Trophy, color: "bg-yellow", desc: "Post achievement updates" },
  { href: "/admin/alumni", label: "Alumni Upload", icon: Upload, color: "bg-coral", desc: "Upload Excel with alumni data" },
  { href: "/admin/council", label: "Council Members", icon: Star, color: "bg-sage", desc: "Manage council member profiles" },
  { href: "/admin/events", label: "Events", icon: Zap, color: "bg-yellow", desc: "Post new events" },
  { href: "/admin/calendar", label: "Calendar", icon: Calendar, color: "bg-coral", desc: "Upload PDF or edit calendar" },
  { href: "/admin/notifications", label: "Notifications", icon: Bell, color: "bg-navy", desc: "Send push notifications" },
];

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "sub_admin"].includes(profile.role)) {
    redirect("/dashboard");
  }

  const isAdmin = profile.role === "admin";

  // Stats
  const [{ count: achievementsCount }, { count: alumniCount }, { count: eventsCount }] =
    await Promise.all([
      supabase.from("achievements").select("*", { count: "exact", head: true }),
      supabase.from("alumni").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }),
    ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="section-heading">Admin Panel</h1>
          <p className="font-nunito text-navy/70 mt-3 text-base">
            Welcome, {profile.full_name?.split(" ")[0]}. You are logged in as{" "}
            <span className="badge-cartoon bg-yellow">{isAdmin ? "Super Admin" : "Sub Admin"}</span>
          </p>
        </div>
        {isAdmin && (
          <Link href="/admin/users" className="btn-cartoon btn-navy text-sm px-4 py-2">
            <Settings size={14} /> Manage Users
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {[
          { label: "Achievements", value: achievementsCount ?? 0, color: "bg-yellow" },
          { label: "Alumni Records", value: alumniCount ?? 0, color: "bg-coral" },
          { label: "Events", value: eventsCount ?? 0, color: "bg-sage" },
        ].map((s) => (
          <div key={s.label} className={`card-cartoon ${s.color} p-6`}>
            <p className="font-fredoka font-700 text-navy text-4xl">{s.value}</p>
            <p className="font-nunito text-navy/70 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Action links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {adminLinks.map((link) => {
          // Sub admins can't access notifications (admin-only)
          if (!isAdmin && link.href === "/admin/notifications") return null;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="card-cartoon bg-white p-6 flex items-start gap-4 group"
            >
              <div className={`w-12 h-12 ${link.color} border-2 border-navy rounded-xl flex items-center justify-center flex-shrink-0 shadow-cartoon`}>
                <Icon size={22} className="text-navy" />
              </div>
              <div>
                <h3 className="font-fredoka font-600 text-navy text-lg group-hover:text-coral transition-colors">
                  {link.label}
                </h3>
                <p className="font-nunito text-sm text-navy/60 mt-0.5">{link.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
