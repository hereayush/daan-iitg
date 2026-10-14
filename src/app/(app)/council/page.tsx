import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Phone, Mail, ExternalLink, Star, Users, Clock } from "lucide-react";
import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import CouncilTabs from "./CouncilTabs";

export const metadata: Metadata = {
  title: "DAAN Council",
  description: "Meet the current and past DAAN Council members at IIT Guwahati.",
};

export default async function CouncilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: members } = await supabase
    .from("council_members")
    .select("*")
    .order("display_order", { ascending: true });

  const all = members ?? [];
  const currentMembers = all.filter((m) => m.is_current !== false);
  const pastMembers = all.filter((m) => m.is_current === false);
  const pastYears = [...new Set(pastMembers.map((m: { batch_year: number | null }) => m.batch_year))]
    .filter(Boolean)
    .sort((a, b) => (b as number) - (a as number)) as number[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageIntro
        eyebrow="The people behind the work"
        title="DAAN Council"
        description="Meet the council members leading the Dakshana Alumni Network at IIT Guwahati."
        icon={Star}
        tone="sage"
      />

      <CouncilTabs
        currentMembers={currentMembers}
        pastMembers={pastMembers}
        pastYears={pastYears}
      />
    </div>
  );
}
