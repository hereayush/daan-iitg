import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-yellow border-4 border-navy rounded-2xl flex items-center justify-center shadow-cartoon animate-bounce">
          <Loader2 className="w-8 h-8 text-navy animate-spin" />
        </div>
        <h2 className="font-fredoka font-700 text-navy text-xl animate-pulse">Loading DAAN...</h2>
      </div>
    </div>
  );
}
