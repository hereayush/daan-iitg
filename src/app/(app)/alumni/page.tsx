import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AlumniClient from "./AlumniClient";
import type { Metadata } from "next";
import { UsersRound } from "lucide-react";
import PageIntro from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Alumni Directory",
  description: "Browse and search the Dakshana Scholars alumni directory at IIT Guwahati.",
};

export default async function AlumniPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: alumni } = await supabase
    .from("alumni")
    .select("*")
    .order("batch", { ascending: false })
    .order("scholar_name", { ascending: true });

  // Get unique batches for filter
  const batches: string[] = [];
  if (alumni) {
    alumni.forEach((a) => {
      if (a.batch && !batches.includes(a.batch)) batches.push(a.batch);
    });
    batches.sort((a, b) => b.localeCompare(a));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageIntro eyebrow="Your people, within reach" title="Alumni Directory" description="Find and reconnect with Dakshana scholars across batches, schools, and centres." icon={UsersRound} tone="yellow" />
      <AlumniClient alumni={alumni || []} batches={batches} />
    </div>
  );
}
