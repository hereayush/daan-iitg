import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Trophy, Users, Calendar, Star, Zap } from "lucide-react";

// Decorative doodle SVG
function DoodleStar({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L14.4 9.2H22L16.1 13.8L18.5 21L12 16.4L5.5 21L7.9 13.8L2 9.2H9.6L12 2Z" fill="#FF6B35" stroke="#1a1a2e" strokeWidth="1.5"/>
    </svg>
  );
}

function DoodleDot({ className }: { className?: string }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" fill="#FFD60A" stroke="#1a1a2e" strokeWidth="1.5"/>
    </svg>
  );
}

const quickLinks = [
  { href: "/achievements", label: "Achievements", icon: Trophy, color: "bg-coral", desc: "Scholar milestones & victories" },
  { href: "/alumni", label: "Alumni Directory", icon: Users, color: "bg-yellow", desc: "Find your fellow Dakshana scholars" },
  { href: "/council", label: "DAAN Council", icon: Star, color: "bg-sage", desc: "Current council members" },
  { href: "/events", label: "Events", icon: Zap, color: "bg-coral", desc: "Upcoming & past events" },
  { href: "/calendar", label: "Calendar", icon: Calendar, color: "bg-yellow", desc: "Academic calendar & holidays" },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  // Latest achievements
  const { data: recentAchievements } = await supabase
    .from("achievements")
    .select("id, title, caption, photo_url")
    .order("created_at", { ascending: false })
    .limit(3);

  // Upcoming events
  const { data: upcomingEvents } = await supabase
    .from("events")
    .select("id, title, event_date, description")
    .gte("event_date", new Date().toISOString().split("T")[0])
    .order("event_date", { ascending: true })
    .limit(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero greeting */}
      <div className="relative mb-10 overflow-hidden">
        <DoodleStar className="absolute top-0 right-8 animate-float opacity-70" />
        <div className="absolute bottom-2 right-32 animate-float" style={{ animationDelay: "1s" }}>
          <DoodleStar />
        </div>
        <DoodleDot className="absolute top-4 right-48 opacity-60" />
        <div className="card-cartoon bg-white p-8 sm:p-10">
          <h1 className="font-fredoka font-700 text-3xl sm:text-4xl text-navy">
            Welcome back, {profile?.full_name?.split(" ")[0] || "Scholar"}! 
          </h1>
          <p className="font-nunito text-navy/70 mt-2 text-lg">
            You are part of the Dakshana Alumni Network at IIT Guwahati.
          </p>
          {profile?.role && profile.role !== "user" && (
            <span className="badge-cartoon bg-yellow mt-3 inline-block">
              {profile.role === "admin" ? "Super Admin" : "Sub Admin"}
            </span>
          )}
        </div>
      </div>

      {/* Quick navigation cards */}
      <section className="mb-12">
        <h2 className="section-heading mb-6">Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickLinks.map((link) => {
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
                  <p className="font-nunito text-sm text-navy/60 mt-0.5">
                    {link.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Achievements */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-heading">Recent Achievements</h2>
            <Link href="/achievements" className="font-nunito text-sm text-coral font-600 hover:underline">
              View all
            </Link>
          </div>
          {recentAchievements && recentAchievements.length > 0 ? (
            <div className="flex flex-col gap-4">
              {recentAchievements.map((a) => (
                <div key={a.id} className="card-cartoon bg-white p-4 flex gap-4 items-center">
                  {a.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.photo_url}
                      alt={a.title}
                      className="w-16 h-16 object-cover rounded-lg border-2 border-navy flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-yellow border-2 border-navy rounded-lg flex items-center justify-center flex-shrink-0">
                      <Trophy size={24} className="text-navy" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-fredoka font-600 text-navy text-base">{a.title}</h4>
                    {a.caption && (
                      <p className="font-nunito text-sm text-navy/60 mt-0.5 line-clamp-1">{a.caption}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-cartoon bg-white p-8 text-center">
              <Trophy size={36} className="text-navy/30 mx-auto mb-2" />
              <p className="font-nunito text-navy/50">No achievements posted yet.</p>
            </div>
          )}
        </section>

        {/* Upcoming Events */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-heading">Upcoming Events</h2>
            <Link href="/events" className="font-nunito text-sm text-coral font-600 hover:underline">
              View all
            </Link>
          </div>
          {upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="flex flex-col gap-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="card-cartoon bg-white p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-coral border-2 border-navy rounded-lg px-2.5 py-1 flex-shrink-0 text-center min-w-14">
                      <p className="font-fredoka font-700 text-white text-sm leading-none">
                        {event.event_date
                          ? new Date(event.event_date).toLocaleDateString("en-IN", { day: "2-digit" })
                          : "TBD"}
                      </p>
                      <p className="font-nunito text-white/80 text-xs">
                        {event.event_date
                          ? new Date(event.event_date).toLocaleDateString("en-IN", { month: "short" })
                          : ""}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-fredoka font-600 text-navy text-base">{event.title}</h4>
                      {event.description && (
                        <p className="font-nunito text-sm text-navy/60 mt-0.5 line-clamp-2">{event.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-cartoon bg-white p-8 text-center">
              <Zap size={36} className="text-navy/30 mx-auto mb-2" />
              <p className="font-nunito text-navy/50">No upcoming events.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
