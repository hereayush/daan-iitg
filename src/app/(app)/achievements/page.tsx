import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Trophy } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Explore the incredible achievements of Dakshana Scholars at IIT Guwahati.",
};

export default async function AchievementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-heading">Achievements</h1>
        <p className="font-nunito text-navy/70 mt-4 text-base max-w-xl">
          Celebrating the milestones, victories, and proud moments of Dakshana scholars.
        </p>
      </div>

      {achievements && achievements.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item) => (
            <div key={item.id} className="card-cartoon bg-white overflow-hidden flex flex-col">
              {item.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.photo_url}
                  alt={item.title}
                  className="w-full h-52 object-cover border-b-2 border-navy"
                />
              ) : (
                <div className="w-full h-52 bg-yellow border-b-2 border-navy flex items-center justify-center">
                  <Trophy size={48} className="text-navy/40" />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-fredoka font-600 text-navy text-xl">{item.title}</h3>
                {item.caption && (
                  <p className="font-nunito font-600 text-coral text-sm mt-1">{item.caption}</p>
                )}
                {item.description && (
                  <p className="font-nunito text-navy/70 text-sm mt-2 leading-relaxed flex-1">
                    {item.description}
                  </p>
                )}
                <p className="font-nunito text-xs text-navy/40 mt-4">
                  {new Date(item.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-cartoon bg-white p-16 text-center">
          <Trophy size={56} className="text-navy/20 mx-auto mb-4" />
          <h3 className="font-fredoka font-600 text-navy text-xl">No achievements yet</h3>
          <p className="font-nunito text-navy/50 mt-2">
            The admin will post achievements soon. Check back later!
          </p>
        </div>
      )}
    </div>
  );
}
