import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Zap, CalendarDays } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Stay updated with events from the Dakshana Alumni Network at IIT Guwahati.",
};

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  const today = new Date().toISOString().split("T")[0];
  const upcoming = events?.filter((e) => e.event_date && e.event_date >= today) || [];
  const past = events?.filter((e) => !e.event_date || e.event_date < today) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-heading">Events</h1>
        <p className="font-nunito text-navy/70 mt-4 text-base max-w-xl">
          Upcoming and past events from the DAAN community.
        </p>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="mb-12">
          <h2 className="font-fredoka font-600 text-navy text-xl mb-4 flex items-center gap-2">
            <Zap size={20} className="text-coral" /> Upcoming Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} highlight />
            ))}
          </div>
        </section>
      )}

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h2 className="font-fredoka font-600 text-navy text-xl mb-4 flex items-center gap-2">
            <CalendarDays size={20} className="text-navy/50" /> Past Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {past.map((event) => (
              <EventCard key={event.id} event={event} highlight={false} />
            ))}
          </div>
        </section>
      )}

      {(!events || events.length === 0) && (
        <div className="card-cartoon bg-white p-16 text-center">
          <Zap size={56} className="text-navy/20 mx-auto mb-4" />
          <h3 className="font-fredoka font-600 text-navy text-xl">No events posted yet</h3>
          <p className="font-nunito text-navy/50 mt-2">Events will appear here when posted by admins.</p>
        </div>
      )}
    </div>
  );
}

function EventCard({ event, highlight }: { event: { id: string; title: string; description: string | null; photo_url: string | null; event_date: string | null; created_at: string }; highlight: boolean }) {
  return (
    <div className={`card-cartoon overflow-hidden flex flex-col ${highlight ? "bg-white" : "bg-light-gray"}`}>
      {event.photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.photo_url}
          alt={event.title}
          className="w-full aspect-video object-cover border-b-2 border-navy"
        />
      ) : (
        <div className={`w-full aspect-video ${highlight ? "bg-yellow" : "bg-navy/10"} border-b-2 border-navy flex items-center justify-center`}>
          <Zap size={40} className="text-navy/30" />
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
        {event.event_date && (
          <span className="badge-cartoon bg-coral text-white text-xs mb-2 w-fit">
            {new Date(event.event_date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        )}
        <h3 className="font-fredoka font-600 text-navy text-lg">{event.title}</h3>
        {event.description && (
          <p className="font-nunito text-sm text-navy/70 mt-2 leading-relaxed line-clamp-3 flex-1">
            {event.description}
          </p>
        )}
        <p className="font-nunito text-xs text-navy/40 mt-4">
          Posted {new Date(event.created_at).toLocaleDateString("en-IN")}
        </p>
      </div>
    </div>
  );
}
