import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Compass,
  Crown,
  Sparkles,
  Star,
  Trophy,
  UsersRound,
  Zap,
  Image as ImageIcon,
} from "lucide-react";

const exploreLinks = [
  { href: "/achievements", label: "Achievements", description: "Stories worth celebrating", icon: Trophy, accent: "bg-coral" },
  { href: "/council", label: "DAAN Council", description: "Meet the people leading DAAN", icon: Star, accent: "bg-sage" },
  { href: "/events", label: "Events", description: "Gatherings, workshops and more", icon: Zap, accent: "bg-yellow" },
  { href: "/calendar", label: "Calendar", description: "Important dates at a glance", icon: CalendarDays, accent: "bg-white" },
];

function SectionTitle({ eyebrow, title, href }: { eyebrow: string; title: string; href: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="font-nunito text-xs font-bold uppercase tracking-[0.16em] text-coral">{eyebrow}</p>
        <h2 className="mt-1 font-fredoka text-3xl font-bold tracking-tight text-navy sm:text-4xl">{title}</h2>
      </div>
      <Link href={href} className="group mb-1 inline-flex shrink-0 items-center gap-1 font-fredoka text-sm font-semibold text-navy hover:text-coral">
        View all <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const [{ data: recentAchievements }, { data: upcomingEvents }, { data: recentPosts }] = await Promise.all([
    supabase.from("achievements").select("id, title, caption, photo_url").order("created_at", { ascending: false }).limit(3),
    supabase.from("events").select("id, title, event_date, description").gte("event_date", new Date().toISOString().split("T")[0]).order("event_date", { ascending: true }).limit(3),
    supabase.from("posts").select("id, caption, created_at, post_media(url, display_order)").order("created_at", { ascending: false }).limit(1),
  ]);

  const firstName = profile?.full_name?.split(" ")[0] || "Scholar";
  const today = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  const isAdmin = profile?.role && profile.role !== "user";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="relative isolate overflow-hidden rounded-2xl border-2 border-navy bg-navy px-6 py-8 text-cream shadow-cartoon-lg sm:px-10 sm:py-10 lg:px-12">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-coral/80 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-52 w-52 rounded-full bg-yellow/50 blur-3xl" />

        <div className="relative grid items-end gap-9 lg:grid-cols-[1.3fr_.7fr]">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-nunito text-xs font-bold uppercase tracking-[0.16em] text-cream/65">
              <span>DAAN / IIT Guwahati</span><span className="h-1 w-1 rounded-full bg-yellow" /><span>{today}</span>
            </div>
            <h1 className="mt-5 max-w-2xl font-fredoka text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">Good to see you, <span className="text-yellow">{firstName}.</span></h1>
            <p className="mt-4 max-w-xl font-nunito text-base leading-relaxed text-cream/80 sm:text-lg">Your community is here for the familiar faces, the next opportunity, and everything in between.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/alumni" className="btn-cartoon btn-yellow px-5 py-3 text-sm">Find an alumnus <ArrowRight size={17} /></Link>
              <Link href="/events" className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-cream/70 px-5 py-3 font-fredoka text-sm font-semibold text-cream transition-colors hover:bg-cream hover:text-navy">See what&apos;s on <ArrowUpRight size={17} /></Link>
            </div>
          </div>

          <aside className="border-t-2 border-cream/30 pt-6 lg:border-l-2 lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="font-nunito text-xs font-bold uppercase tracking-[0.16em] text-yellow">Your DAAN desk</p>
            <div className="mt-4 divide-y-2 divide-cream/15">
              {[
                { href: "/alumni", label: "Alumni directory", note: "Reconnect with your network", icon: UsersRound },
                { href: "/calendar", label: "Academic calendar", note: "Keep important dates close", icon: CalendarDays },
                { href: "/achievements", label: "Community wins", note: "See what scholars are doing", icon: Trophy },
              ].map(({ href, label, note, icon: Icon }) => (
                <Link key={href} href={href} className="group flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-cream/50 bg-cream/10 transition-colors group-hover:bg-yellow group-hover:text-navy"><Icon size={17} /></span>
                  <span className="min-w-0 flex-1"><span className="block font-fredoka text-base font-semibold">{label}</span><span className="block truncate font-nunito text-xs text-cream/65">{note}</span></span>
                  <ArrowUpRight size={17} className="shrink-0 text-yellow transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {isAdmin && (
        <Link href="/admin" className="mt-6 flex items-center justify-between gap-4 rounded-xl border-2 border-navy bg-yellow p-4 shadow-cartoon transition-transform hover:-translate-y-1">
          <span className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg border-2 border-navy bg-coral text-white"><Crown size={17} /></span><span><span className="block font-fredoka font-semibold text-navy">{profile.role === "admin" ? "Admin workspace" : "Sub-admin workspace"}</span><span className="block font-nunito text-sm text-navy/70">Manage updates, people, and community content.</span></span></span><ArrowRight size={19} className="shrink-0" />
        </Link>
      )}

      <section className="mt-14">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="font-nunito text-xs font-bold uppercase tracking-[0.16em] text-coral">Start exploring</p><h2 className="mt-1 font-fredoka text-3xl font-bold tracking-tight text-navy sm:text-4xl">Make DAAN useful today.</h2></div>
          <p className="max-w-sm font-nunito text-sm leading-relaxed text-navy/60">Pick up a conversation, celebrate a win, or stay one step ahead of the next date.</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
          <Link href="/alumni" className="group relative overflow-hidden rounded-2xl border-2 border-navy bg-coral p-7 text-white shadow-cartoon transition-transform duration-200 hover:-translate-y-1 sm:p-8">
            <div className="absolute -right-8 -top-7 h-40 w-40 rounded-full border-2 border-navy bg-yellow/90" />
            <div className="relative flex h-full flex-col justify-between gap-10"><div><span className="grid h-12 w-12 place-items-center rounded-xl border-2 border-navy bg-yellow text-navy shadow-cartoon"><UsersRound size={22} /></span><p className="mt-8 font-nunito text-xs font-bold uppercase tracking-[0.16em] text-white/75">People first</p><h3 className="mt-2 max-w-sm font-fredoka text-3xl font-bold leading-tight">Find someone from your DAAN story.</h3></div><span className="inline-flex items-center gap-2 font-fredoka font-semibold">Browse the directory <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></span></div>
          </Link>
          <div className="grid gap-3 sm:grid-cols-2">
            {exploreLinks.map(({ href, label, description, icon: Icon, accent }) => (
              <Link key={href} href={href} className="group flex min-h-40 flex-col justify-between rounded-xl border-2 border-navy bg-white p-5 shadow-cartoon transition-all duration-200 hover:-translate-y-1 hover:shadow-cartoon-lg">
                <span className={`grid h-10 w-10 place-items-center rounded-lg border-2 border-navy ${accent} text-navy`}><Icon size={18} /></span>
                <span><span className="flex items-center justify-between gap-2 font-fredoka text-lg font-semibold text-navy group-hover:text-coral">{label}<ArrowUpRight size={16} /></span><span className="mt-1 block font-nunito text-sm leading-snug text-navy/60">{description}</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <SectionTitle eyebrow="Latest from the community" title="Achievements" href="/achievements" />
          {recentAchievements && recentAchievements.length > 0 ? (
            <div className="overflow-hidden rounded-xl border-2 border-navy bg-white shadow-cartoon">
              {recentAchievements.map((achievement, index) => (
                <Link href="/achievements" key={achievement.id} className={`group flex gap-4 p-4 transition-colors hover:bg-cream ${index > 0 ? "border-t-2 border-navy/15" : ""}`}>
                  {achievement.photo_url ? <img src={achievement.photo_url} alt="" className="h-16 w-16 shrink-0 rounded-lg border-2 border-navy object-cover" /> : <span className="grid h-16 w-16 shrink-0 place-items-center rounded-lg border-2 border-navy bg-yellow"><Trophy size={24} /></span>}
                  <span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-3 font-fredoka text-lg font-semibold text-navy group-hover:text-coral"><span className="line-clamp-1">{achievement.title}</span><ArrowUpRight size={16} className="mt-1 shrink-0" /></span>{achievement.caption && <span className="mt-1 block line-clamp-1 font-nunito text-sm text-navy/60">{achievement.caption}</span>}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-navy/35 bg-white/65 p-8 text-center"><Trophy size={30} className="mx-auto text-coral" /><p className="mt-3 font-fredoka text-lg font-semibold text-navy">The next win could be yours.</p><p className="mt-1 font-nunito text-sm text-navy/60">Community achievements will appear here.</p></div>
          )}

          <div className="mt-10">
            <SectionTitle eyebrow="Fresh from your feed" title="Community post" href="/posts" />
            {recentPosts?.[0] ? (
              <Link href="/posts" className="group relative block min-h-72 overflow-hidden rounded-2xl border-2 border-navy bg-navy shadow-cartoon transition-transform hover:-translate-y-1">
                {recentPosts[0].post_media?.[0]?.url ? <img src={recentPosts[0].post_media[0].url} alt="Latest community post" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="absolute inset-0 bg-coral" />}
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/35 to-transparent" />
                <div className="relative flex min-h-72 flex-col justify-end p-6 text-white"><span className="mb-3 grid h-11 w-11 place-items-center rounded-xl border-2 border-navy bg-yellow text-navy shadow-cartoon"><ImageIcon size={20} /></span><p className="line-clamp-2 font-fredoka text-2xl font-bold leading-tight">{recentPosts[0].caption || "A new moment from the DAAN community."}</p><span className="mt-3 inline-flex items-center gap-2 font-fredoka text-sm font-semibold text-yellow">Open community posts <ArrowRight size={17} /></span></div>
              </Link>
            ) : (
              <Link href="/posts" className="group block rounded-2xl border-2 border-navy bg-coral p-7 text-white shadow-cartoon transition-transform hover:-translate-y-1"><span className="grid h-12 w-12 place-items-center rounded-xl border-2 border-navy bg-yellow text-navy shadow-cartoon"><ImageIcon size={22} /></span><h3 className="mt-7 font-fredoka text-2xl font-bold">Share the next DAAN moment.</h3><p className="mt-2 font-nunito text-sm text-white/80">Post photos and updates for the community to see.</p><span className="mt-6 inline-flex items-center gap-2 font-fredoka font-semibold">Create a post <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></span></Link>
            )}
          </div>
        </div>
        <div>
          <SectionTitle eyebrow="Save the date" title="Upcoming events" href="/events" />
          {upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="overflow-hidden rounded-xl border-2 border-navy bg-white shadow-cartoon">
              {upcomingEvents.map((event, index) => (
                <Link href="/events" key={event.id} className={`group flex gap-4 p-4 transition-colors hover:bg-cream ${index > 0 ? "border-t-2 border-navy/15" : ""}`}>
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-lg border-2 border-navy bg-navy text-center text-cream"><span className="font-fredoka text-xl font-bold leading-none">{event.event_date ? new Date(event.event_date).toLocaleDateString("en-IN", { day: "2-digit" }) : "?"}</span><span className="mt-1 font-nunito text-[11px] font-bold uppercase tracking-wide text-yellow">{event.event_date ? new Date(event.event_date).toLocaleDateString("en-IN", { month: "short" }) : "TBD"}</span></span>
                  <span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-3 font-fredoka text-lg font-semibold text-navy group-hover:text-coral"><span className="line-clamp-1">{event.title}</span><ArrowUpRight size={16} className="mt-1 shrink-0" /></span>{event.description && <span className="mt-1 block line-clamp-1 font-nunito text-sm text-navy/60">{event.description}</span>}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-navy/35 bg-white/65 p-8 text-center"><Compass size={30} className="mx-auto text-coral" /><p className="mt-3 font-fredoka text-lg font-semibold text-navy">Your next DAAN moment is on its way.</p><p className="mt-1 font-nunito text-sm text-navy/60">New events will appear here as they are announced.</p></div>
          )}
        </div>
      </section>

      <section className="relative mt-16 overflow-hidden rounded-2xl border-2 border-navy bg-sage px-6 py-8 shadow-cartoon sm:flex sm:items-center sm:justify-between sm:px-8">
        <Sparkles className="absolute -right-2 -top-3 h-24 w-24 text-yellow/70" strokeWidth={1.5} />
        <div className="relative max-w-xl"><p className="font-nunito text-xs font-bold uppercase tracking-[0.16em] text-navy/60">A community habit</p><h2 className="mt-2 font-fredoka text-2xl font-bold text-navy sm:text-3xl">A familiar name is only one hello away.</h2><p className="mt-2 font-nunito text-sm leading-relaxed text-navy/70">Use the directory to find batchmates, mentors, and fellow Dakshana scholars.</p></div>
        <Link href="/alumni" className="btn-cartoon btn-white relative mt-6 shrink-0 px-5 py-3 text-sm sm:mt-0">Open directory <ArrowRight size={17} /></Link>
      </section>
    </div>
  );
}
