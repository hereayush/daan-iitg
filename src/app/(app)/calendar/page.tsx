import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CalendarClient from "./CalendarClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academic Calendar",
  description: "DAAN IITG academic calendar with events, holidays, and exam schedules.",
};

export default async function CalendarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const { data: calendarEvents } = await supabase
    .from("calendar_events")
    .select("*")
    .order("event_date", { ascending: true });

  const isAdmin = profile?.role === "admin" || profile?.role === "sub_admin";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-heading">Academic Calendar</h1>
        <p className="font-nunito text-navy/70 mt-4 text-base max-w-xl">
          Holidays, exams, events, and important dates at a glance.
        </p>
      </div>
      <CalendarClient events={calendarEvents || []} isAdmin={isAdmin} />
    </div>
  );
}
