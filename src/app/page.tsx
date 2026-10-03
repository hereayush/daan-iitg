import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DAAN IITG — Dakshana Alumni Network",
  description:
    "Welcome to DAAN IITG, the official alumni network of Dakshana Scholars at IIT Guwahati.",
};

function DoodleStar() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-coral">
      <path d="M12 2L14.4 9.2H22L16.1 13.8L18.5 21L12 16.4L5.5 21L7.9 13.8L2 9.2H9.6L12 2Z" fill="#FF6B35" stroke="#1a1a2e" strokeWidth="1.5"/>
    </svg>
  );
}

function DoodleDot({ color = "#FFD60A" }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" fill={color} stroke="#1a1a2e" strokeWidth="1.5"/>
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Minimal top nav */}
      <header className="border-b-2 border-navy bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-coral border-2 border-navy rounded-lg flex items-center justify-center shadow-cartoon">
              <span className="font-fredoka font-700 text-white text-sm">D</span>
            </div>
            <span className="font-fredoka font-700 text-xl text-navy">DAAN IITG</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-cartoon btn-white text-sm px-4 py-2">
              Log In
            </Link>
            <Link href="/register" className="btn-cartoon btn-coral text-sm px-4 py-2">
              Join Now
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background doodles */}
        <div className="absolute top-12 left-8 animate-float opacity-60"><DoodleStar /></div>
        <div className="absolute top-8 right-12 animate-float opacity-60" style={{ animationDelay: "0.8s" }}><DoodleStar /></div>
        <div className="absolute bottom-16 left-16 animate-float opacity-40" style={{ animationDelay: "1.5s" }}><DoodleDot /></div>
        <div className="absolute bottom-8 right-24 opacity-50"><DoodleDot color="#FF6B35" /></div>
        <div className="absolute top-24 left-1/3 opacity-30"><DoodleDot color="#1a1a2e" /></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <div className="inline-block bg-yellow border-2 border-navy rounded-lg px-4 py-1.5 mb-6 shadow-cartoon">
            <span className="font-fredoka font-600 text-navy text-sm">Dakshana Alumni Network</span>
          </div>
          <h1 className="font-fredoka font-700 text-navy text-5xl sm:text-7xl leading-tight mb-6"
              style={{ textShadow: "4px 4px 0px #FF6B35" }}>
            DAAN IITG
          </h1>
          <p className="font-nunito text-navy/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            The official alumni platform for Dakshana Scholars at IIT Guwahati.
            Connect, celebrate, and stay part of the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-cartoon btn-coral text-base px-8 py-3">
              Create Account
            </Link>
            <Link href="/login" className="btn-cartoon btn-navy text-base px-8 py-3">
              Already a member? Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-fredoka font-700 text-navy text-3xl sm:text-4xl mb-3">
            Everything in one place
          </h2>
          <p className="font-nunito text-navy/60 text-base max-w-xl mx-auto">
            Log in to unlock full access to the DAAN community.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Alumni Directory",
              desc: "Search and connect with Dakshana scholars from all batches and COEs.",
              color: "bg-yellow",
              icon: "👥",
            },
            {
              title: "Achievements",
              desc: "Celebrate the milestones and victories of our scholars.",
              color: "bg-coral",
              icon: "🏆",
            },
            {
              title: "DAAN Council",
              desc: "Know your current council members and how to reach them.",
              color: "bg-sage",
              icon: "⭐",
            },
            {
              title: "Events",
              desc: "Stay updated with upcoming and past community events.",
              color: "bg-yellow",
              icon: "⚡",
            },
            {
              title: "Academic Calendar",
              desc: "Holidays, exams, and important dates at a glance.",
              color: "bg-coral",
              icon: "📅",
            },
            {
              title: "Push Notifications",
              desc: "Get notified instantly when admins post new content.",
              color: "bg-navy",
              icon: "🔔",
            },
          ].map((f) => (
            <div key={f.title} className="card-cartoon bg-white p-6">
              <div className={`w-12 h-12 ${f.color} border-2 border-navy rounded-xl flex items-center justify-center mb-4 shadow-cartoon text-xl`}>
                {f.icon}
              </div>
              <h3 className="font-fredoka font-600 text-navy text-lg mb-2">{f.title}</h3>
              <p className="font-nunito text-sm text-navy/60 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="card-cartoon bg-navy p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute top-6 left-8 opacity-20">
            <DoodleStar />
          </div>
          <div className="absolute bottom-6 right-8 opacity-20">
            <DoodleStar />
          </div>
          <h2 className="font-fredoka font-700 text-cream text-3xl sm:text-4xl mb-4">
            Join the DAAN community
          </h2>
          <p className="font-nunito text-cream/70 text-base mb-8 max-w-lg mx-auto">
            Create a free account to access the full alumni directory, achievements, events, and more.
          </p>
          <Link href="/register" className="btn-cartoon btn-coral text-base px-10 py-3">
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy border-t-2 border-navy py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-fredoka font-600 text-cream text-sm">
            &copy; {new Date().getFullYear()} DAAN IITG. All rights reserved.
          </span>
          <div className="flex gap-4">
            <Link href="/privacy" className="font-nunito text-xs text-cream/60 hover:text-yellow">Privacy Policy</Link>
            <Link href="/terms" className="font-nunito text-xs text-cream/60 hover:text-yellow">Terms &amp; Conditions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
