import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AlumniClient from "./AlumniClient";
import type { Metadata } from "next";

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
      <div className="mb-8">
        <h1 className="section-heading">Alumni Directory</h1>
        <p className="font-nunito text-navy/70 mt-4 text-base max-w-xl">
          Find and connect with Dakshana scholars across all batches.
        </p>
      </div>
      <AlumniClient alumni={alumni || []} batches={batches} />
    </div>
  );
}
