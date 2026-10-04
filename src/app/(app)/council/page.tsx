import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Phone, Mail, ExternalLink, Star } from "lucide-react";
import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "DAAN Council",
  description: "Meet the current DAAN Council members at IIT Guwahati.",
};

export default async function CouncilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: members } = await supabase
    .from("council_members")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageIntro eyebrow="The people behind the work" title="DAAN Council" description="Meet the current council members leading the Dakshana Alumni Network at IIT Guwahati." icon={Star} tone="sage" />

      {members && members.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((m) => (
            <article key={m.id} className="card-cartoon group bg-white overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-cartoon-lg">
              {/* Photo */}
              <div className="relative aspect-square w-full bg-yellow border-b-2 border-navy flex items-center justify-center">
                {m.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.photo_url}
                    alt={m.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <Star size={48} className="text-navy/30" />
                )}
                {/* Designation badge */}
                <div className="absolute bottom-3 left-3 bg-coral border-2 border-navy rounded-lg px-3 py-1 shadow-cartoon">
                  <p className="font-fredoka font-600 text-white text-sm">{m.designation}</p>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-fredoka font-700 text-navy text-xl group-hover:text-coral">{m.name}</h3>

                <div className="flex flex-col gap-2 mt-4">
                  {m.phone && (
                    <a
                      href={`tel:${m.phone}`}
                      className="flex items-center gap-2 text-sm font-nunito text-navy/70 hover:text-coral transition-colors"
                    >
                      <Phone size={14} className="text-coral" />
                      {m.phone}
                    </a>
                  )}
                  {m.email && (
                    <a
                      href={`mailto:${m.email}`}
                      className="flex items-center gap-2 text-sm font-nunito text-navy/70 hover:text-coral transition-colors truncate"
                    >
                      <Mail size={14} className="text-coral" />
                      {m.email}
                    </a>
                  )}
                  {m.linkedin_url && (
                    <a
                      href={m.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-nunito text-navy/70 hover:text-coral transition-colors"
                    >
                      <ExternalLink size={14} className="text-coral" />
                      LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card-cartoon bg-white p-16 text-center">
          <Star size={56} className="text-navy/20 mx-auto mb-4" />
          <h3 className="font-fredoka font-600 text-navy text-xl">No council members yet</h3>
          <p className="font-nunito text-navy/50 mt-2">
            Council member profiles will be added soon.
          </p>
        </div>
      )}
    </div>
  );
}
