import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BellRing, BookOpen, CalendarDays, HeartHandshake, Sparkles, Trophy, UsersRound } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export const metadata: Metadata = {
  title: "DAAN IITG — Dakshana Alumni Network",
  description: "The official alumni network of Dakshana Scholars at IIT Guwahati.",
};

const features = [
  { title: "Find your people", description: "Reconnect with Dakshana scholars across batches, disciplines, and cities.", icon: UsersRound, accent: "bg-yellow", href: "/alumni" },
  { title: "Celebrate every win", description: "See the projects, placements, awards, and milestones of the community.", icon: Trophy, accent: "bg-coral", href: "/achievements" },
  { title: "Never miss a date", description: "Keep academic milestones, events, and important campus dates in view.", icon: CalendarDays, accent: "bg-sage", href: "/calendar" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-cream">
      <header className="relative z-20 border-b-2 border-navy bg-cream/90 backdrop-blur">
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3" aria-label="DAAN IITG home">
            <BrandLogo className="h-11 w-11 border-2 border-navy shadow-cartoon transition-transform group-hover:-translate-y-0.5" priority />
            <span><span className="block font-fredoka text-lg font-bold leading-none text-navy">DAAN IITG</span><span className="mt-1 block font-nunito text-[10px] font-bold uppercase tracking-[0.16em] text-navy/55">Dakshana Alumni Network</span></span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="rounded-lg px-3 py-2 font-fredoka text-sm font-semibold text-navy transition-colors hover:bg-yellow/50 sm:px-4">Log in</Link>
            <Link href="/register" className="btn-cartoon btn-coral px-3 py-2 text-sm sm:px-4">Join DAAN <ArrowRight size={15} /></Link>
          </div>
        </nav>
      </header>

      <section className="relative isolate border-b-2 border-navy bg-navy py-14 text-cream sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-coral/90 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-yellow/70 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-yellow bg-cream px-4 py-2 font-fredoka text-sm font-semibold text-navy shadow-[3px_3px_0_#FFD60A]"><Sparkles size={16} className="text-coral" /> Built for scholars, by scholars</div>
            <h1 className="font-fredoka text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">Your IITG story<br /><span className="text-yellow">keeps growing.</span></h1>
            <p className="mt-6 max-w-xl font-nunito text-lg leading-relaxed text-cream/80 sm:text-xl">DAAN is the shared home for Dakshana Scholars at IIT Guwahati—where familiar faces, new opportunities, and proud moments stay close.</p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/register" className="btn-cartoon btn-yellow px-6 py-3 text-base">Create your profile <ArrowRight size={18} /></Link>
              <Link href="/login" className="rounded-lg border-2 border-cream/80 px-6 py-3 text-center font-fredoka text-base font-semibold text-cream transition hover:bg-cream hover:text-navy">Explore the network</Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -left-4 -top-5 rotate-[-7deg] rounded-xl border-2 border-navy bg-yellow px-3 py-2 font-fredoka text-xs font-bold text-navy shadow-cartoon">One connected community</div>
            <div className="card-cartoon relative overflow-hidden bg-cream p-6 text-navy sm:p-8">
              <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-coral/25" />
              <p className="font-nunito text-sm font-bold uppercase tracking-[0.16em] text-coral">The DAAN space</p>
              <h2 className="mt-2 font-fredoka text-3xl font-bold leading-tight">A place to stay in the loop—and in touch.</h2>
              <div className="mt-7 grid grid-cols-2 gap-3">
                {[{ label: "Alumni", icon: UsersRound, color: "bg-yellow" }, { label: "Achievements", icon: Trophy, color: "bg-coral" }, { label: "Calendar", icon: CalendarDays, color: "bg-sage" }, { label: "Updates", icon: BellRing, color: "bg-navy text-white" }].map(({ label, icon: Icon, color }) => <div key={label} className="rounded-xl border-2 border-navy bg-white p-3 shadow-[2px_2px_0_#1a1a2e]"><span className={`mb-3 grid h-8 w-8 place-items-center rounded-lg border-2 border-navy ${color}`}><Icon size={15} /></span><span className="font-fredoka text-sm font-semibold">{label}</span></div>)}
              </div>
            </div>
            <div className="absolute -bottom-5 right-2 rotate-[5deg] rounded-xl border-2 border-navy bg-coral px-4 py-2 font-fredoka text-sm font-bold text-white shadow-cartoon">IIT Guwahati · DAAN</div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 border-x-2 border-navy bg-white sm:grid-cols-3">
        {["Connect with your batch", "Celebrate shared success", "Stay campus-ready"].map((item, index) => <div key={item} className="flex items-center gap-4 border-b-2 border-navy p-5 last:border-b-0 sm:border-b-0 sm:border-r-2 sm:last:border-r-0"><span className="grid h-9 w-9 place-items-center rounded-full border-2 border-navy bg-yellow font-fredoka font-bold">0{index + 1}</span><p className="font-fredoka text-lg font-semibold text-navy">{item}</p></div>)}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="font-fredoka text-sm font-bold uppercase tracking-[0.16em] text-coral">More than a directory</p><h2 className="mt-2 max-w-xl font-fredoka text-4xl font-bold leading-tight text-navy sm:text-5xl">Everything your community needs, in one friendly place.</h2></div>
          <BookOpen className="hidden h-16 w-16 text-yellow sm:block" strokeWidth={1.5} />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map(({ title, description, icon: Icon, accent, href }) => <Link key={title} href={href} className="card-cartoon group block p-6 sm:p-7"><span className={`grid h-12 w-12 place-items-center rounded-xl border-2 border-navy ${accent} shadow-cartoon`}><Icon size={22} /></span><h3 className="mt-7 font-fredoka text-2xl font-bold text-navy">{title}</h3><p className="mt-3 font-nunito leading-relaxed text-navy/65">{description}</p><span className="mt-6 inline-flex items-center gap-2 font-fredoka font-semibold text-coral">Discover <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></span></Link>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"><div className="relative overflow-hidden rounded-2xl border-2 border-navy bg-coral px-6 py-12 text-center shadow-cartoon-lg sm:px-12"><HeartHandshake className="absolute -left-4 -top-4 h-28 w-28 text-yellow/50" /><Sparkles className="absolute -bottom-5 -right-3 h-28 w-28 text-yellow/50" /><div className="relative mx-auto max-w-2xl"><p className="font-fredoka text-sm font-bold uppercase tracking-[0.16em] text-yellow">Your community is waiting</p><h2 className="mt-3 font-fredoka text-4xl font-bold text-white sm:text-5xl">Come home to DAAN.</h2><p className="mt-4 font-nunito text-lg text-white/85">Create your account and make the most of the people, moments, and opportunities around you.</p><Link href="/register" className="btn-cartoon btn-yellow mt-8 px-7 py-3 text-base">Get started <ArrowRight size={18} /></Link></div></div></section>

      <footer className="border-t-2 border-navy bg-navy py-7 text-cream"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8"><span className="font-fredoka text-sm font-semibold">DAAN IITG · Dakshana Alumni Network</span><div className="flex gap-5 font-nunito text-sm text-cream/70"><Link href="/privacy" className="hover:text-yellow">Privacy</Link><Link href="/terms" className="hover:text-yellow">Terms</Link></div></div></footer>
    </main>
  );
}
