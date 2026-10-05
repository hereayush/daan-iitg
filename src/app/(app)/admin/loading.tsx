import { Loader2, Shield } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-4xl animate-fade-in-up px-4 py-10 sm:px-6 lg:px-8" aria-live="polite" aria-label="Loading admin content">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-navy/15" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded bg-navy/10" />
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-xl border-2 border-navy bg-yellow shadow-cartoon">
          <Loader2 className="h-5 w-5 animate-spin text-navy" />
        </div>
      </div>
      <div className="space-y-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="card-cartoon flex items-center gap-4 bg-white p-4">
            <div className="h-16 w-16 animate-pulse rounded-lg bg-yellow/50" />
            <div className="flex-1 space-y-3"><div className="h-5 w-2/5 animate-pulse rounded bg-navy/15" /><div className="h-3 w-1/4 animate-pulse rounded bg-navy/10" /></div>
          </div>
        ))}
      </div>
      <p className="mt-7 flex items-center justify-center gap-2 font-fredoka font-semibold text-navy/60"><Shield size={16} className="text-coral" /> Loading admin tools…</p>
    </div>
  );
}
