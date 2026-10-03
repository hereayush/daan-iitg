import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AlumniUploadClient from "./AlumniUploadClient";

export default async function AdminAlumniPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") redirect("/dashboard");
  const { count } = await supabase.from("alumni").select("*", { count: "exact", head: true });
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AlumniUploadClient currentCount={count ?? 0} />
    </div>
  );
}
