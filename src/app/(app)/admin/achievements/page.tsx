import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AchievementsAdmin from "./AchievementsAdmin";

export default async function AdminAchievementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: profile }, { data: achievements }] = await Promise.all([
    supabase.from("profiles").select("role").eq("id", user.id).single(),
    supabase.from("achievements").select("*").order("created_at", { ascending: false }),
  ]);
  if (!profile || !["admin", "sub_admin"].includes(profile.role)) redirect("/dashboard");
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AchievementsAdmin achievements={achievements || []} isAdmin={profile.role === "admin"} />
    </div>
  );
}
