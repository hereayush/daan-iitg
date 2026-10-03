"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-coral border-2 border-navy rounded-xl flex items-center justify-center shadow-cartoon">
          <span className="font-fredoka font-700 text-white">D</span>
        </div>
        <span className="font-fredoka font-700 text-2xl text-navy">DAAN IITG</span>
      </Link>

      <div className="card-cartoon bg-white w-full max-w-md p-8">
        <h1 className="font-fredoka font-700 text-navy text-3xl mb-1">Welcome back</h1>
        <p className="font-nunito text-navy/60 text-sm mb-8">
          Log in to access the DAAN community.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
                className="input-cartoon pr-10"
                placeholder="Your password"
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

          <button
            type="submit"
            disabled={loading}
            className="btn-cartoon btn-coral w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn size={16} /> Log In
              </span>
            )}
          </button>
        </form>

        <p className="font-nunito text-sm text-navy/60 mt-6 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-coral font-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      <div className="flex gap-4 mt-6">
        <Link href="/privacy" className="font-nunito text-xs text-navy/40 hover:text-navy">Privacy</Link>
        <Link href="/terms" className="font-nunito text-xs text-navy/40 hover:text-navy">Terms</Link>
      </div>
    </div>
  );
}
