import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UsersAdmin from "./UsersAdmin";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") redirect("/dashboard");
  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <UsersAdmin users={users || []} currentUserId={user.id} />
    </div>
  );
}
