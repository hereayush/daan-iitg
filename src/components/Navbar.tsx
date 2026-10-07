"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { ArrowLeft, Menu, X, LogOut, User, Shield } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

const navLinks = [
  { href: "/dashboard", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/achievements", label: "Achievements" },
  { href: "/alumni", label: "Alumni" },
  { href: "/council", label: "Council" },
  { href: "/events", label: "Events" },
  { href: "/calendar", label: "Calendar" },
];

export default function Navbar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/dashboard");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white border-b-2 border-navy shadow-cartoon"
          : "bg-cream border-b-2 border-navy"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {pathname !== "/dashboard" && (
            <button
              onClick={handleBack}
              className="btn-cartoon btn-white px-2.5 py-2"
              aria-label="Go back"
              title="Go back"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline text-sm">Back</span>
            </button>
          )}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <BrandLogo className="h-10 w-10 border-2 border-navy shadow-cartoon transition-transform group-hover:-translate-y-0.5" priority />
            <span className="font-fredoka font-700 text-xl text-navy tracking-wide hidden sm:inline">
              DAAN IITG
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg font-fredoka font-500 text-base transition-all duration-150 ${
                    isActive
                      ? "bg-coral text-white border-2 border-navy shadow-[2px_2px_0px_#1a1a2e]"
                      : "text-navy hover:bg-yellow hover:border-2 hover:border-navy hover:shadow-[2px_2px_0px_#1a1a2e]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-3">
          {profile && ["admin", "sub_admin"].includes(profile.role) && (
            <Link
              href="/admin"
              className="btn-cartoon btn-yellow text-sm px-3 py-1.5"
            >
              <Shield size={14} />
              Admin
            </Link>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg border-2 border-navy bg-yellow flex items-center justify-center shadow-cartoon">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || "User"}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <User size={14} className="text-navy" />
              )}
            </div>
            <span className="font-nunito font-600 text-sm text-navy max-w-24 truncate">
              {profile?.full_name?.split(" ")[0] || "Scholar"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="btn-cartoon btn-white text-sm px-3 py-1.5"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-lg border-2 border-navy bg-white shadow-cartoon"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-cream border-t-2 border-navy px-4 py-4 flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-2.5 rounded-lg font-fredoka font-500 text-base border-2 border-navy transition-all ${
                  isActive
                    ? "bg-coral text-white shadow-[2px_2px_0px_#1a1a2e]"
                    : "bg-white text-navy shadow-cartoon"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {profile && ["admin", "sub_admin"].includes(profile.role) && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="btn-cartoon btn-yellow text-sm mt-1"
            >
              <Shield size={14} /> Admin Panel
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="btn-cartoon btn-navy text-sm mt-1"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      )}
    </header>
  );
}
