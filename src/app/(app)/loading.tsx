import { Loader2, Sparkles } from "lucide-react";

export default function AppRouteLoading() {
  return (
    <div className="min-h-[70vh] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-fade-in-up">
        <div className="mb-9 flex items-center justify-between">
          <div className="space-y-3"><div className="h-9 w-56 animate-pulse rounded-lg bg-navy/15" /><div className="h-4 w-80 max-w-full animate-pulse rounded bg-navy/10" /></div>
          <div className="grid h-12 w-12 place-items-center rounded-xl border-2 border-navy bg-yellow shadow-cartoon"><Loader2 className="h-6 w-6 animate-spin text-navy" /></div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => <div key={item} className="card-cartoon min-h-44 overflow-hidden bg-white p-5"><div className="h-10 w-10 animate-pulse rounded-xl bg-coral/30" /><div className="mt-6 h-5 w-3/4 animate-pulse rounded bg-navy/15" /><div className="mt-3 h-3 w-full animate-pulse rounded bg-navy/10" /><div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-navy/10" /></div>)}
        </div>
        <p className="mt-8 flex items-center justify-center gap-2 font-fredoka font-semibold text-navy/60"><Sparkles size={16} className="animate-pulse text-coral" /> Preparing your DAAN space…</p>
      </div>
    </div>
  );
}
