"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      toast.error(result?.error || "Unable to create your account. Please try again.");
      setLoading(false);
    } else {
      const supabase = createClient();
      toast.success("Account created! Logging you in...");
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) {
        toast.error(`Account created, but login failed: ${loginError.message}`);
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
      // Keep loading=true during route transition
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <BrandLogo className="h-11 w-11 border-2 border-navy shadow-cartoon" priority />
        <span className="font-fredoka font-700 text-2xl text-navy">DAAN IITG</span>
      </Link>

      <div className="card-cartoon bg-white w-full max-w-md p-8">
        <h1 className="font-fredoka font-700 text-navy text-3xl mb-1">Join DAAN IITG</h1>
        <p className="font-nunito text-navy/60 text-sm mb-8">
          Create an account to access the full alumni community.
        </p>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div>
            <label className="font-nunito font-600 text-sm text-navy mb-1.5 block">
              Full Name
            </label>
            <input
              type="text"
              required
              className="input-cartoon"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="font-nunito font-600 text-sm text-navy mb-1.5 block">
              Email Address
            </label>
            <input
              type="email"
              required
              className="input-cartoon"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="font-nunito font-600 text-sm text-navy mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                minLength={8}
                className="input-cartoon pr-10"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <p className="font-nunito text-xs text-navy/50 -mt-2">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-coral hover:underline">Terms</Link> and{" "}
            <Link href="/privacy" className="text-coral hover:underline">Privacy Policy</Link>.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="btn-cartoon btn-coral w-full mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus size={16} /> Create Account
              </span>
            )}
          </button>
        </form>

        <p className="font-nunito text-sm text-navy/60 mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-coral font-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
