import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CouncilAdmin from "./CouncilAdmin";
export default async function AdminCouncilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: profile }, { data: members }] = await Promise.all([
    supabase.from("profiles").select("role").eq("id", user.id).single(),
    supabase.from("council_members").select("*").order("display_order"),
  ]);
  if (!profile || !["admin", "sub_admin"].includes(profile.role)) redirect("/dashboard");
  return <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"><CouncilAdmin members={members || []} isAdmin={profile.role === "admin"} /></div>;
}
