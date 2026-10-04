import type { LucideIcon } from "lucide-react";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone?: "coral" | "yellow" | "sage";
};

const tones = {
  coral: "bg-coral text-white",
  yellow: "bg-yellow text-navy",
  sage: "bg-sage text-navy",
};

export default function PageIntro({ eyebrow, title, description, icon: Icon, tone = "coral" }: PageIntroProps) {
  return (
    <header className="relative mb-10 overflow-hidden rounded-2xl border-2 border-navy bg-white px-6 py-7 shadow-cartoon sm:px-8 sm:py-8">
      <div className={`absolute -right-10 -top-12 h-40 w-40 rounded-full opacity-30 ${tone === "coral" ? "bg-coral" : tone === "yellow" ? "bg-yellow" : "bg-sage"}`} />
      <div className="relative flex items-start gap-5">
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border-2 border-navy shadow-cartoon ${tones[tone]}`}><Icon size={23} /></span>
        <div>
          <p className="font-nunito text-xs font-bold uppercase tracking-[0.16em] text-coral">{eyebrow}</p>
          <h1 className="mt-1 font-fredoka text-3xl font-bold tracking-tight text-navy sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl font-nunito text-sm leading-relaxed text-navy/65 sm:text-base">{description}</p>
        </div>
      </div>
    </header>
  );
}
