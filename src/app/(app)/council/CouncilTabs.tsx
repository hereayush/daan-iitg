"use client";

import { useState } from "react";
import { Phone, Mail, ExternalLink, Star, Users, Clock } from "lucide-react";
import type { CouncilMember } from "@/lib/types";

interface Props {
  currentMembers: CouncilMember[];
  pastMembers: CouncilMember[];
  pastYears: number[];
}

export default function CouncilTabs({ currentMembers, pastMembers, pastYears }: Props) {
  // "current" | year number as string
  const [activeTab, setActiveTab] = useState<string>("current");

  const tabs = [
    { key: "current", label: "Present Council", icon: Users, count: currentMembers.length },
    ...pastYears.map((y) => ({
      key: String(y),
      label: `DAAN Council ${y}`,
      icon: Clock,
      count: pastMembers.filter((m) => m.batch_year === y).length,
    })),
  ];

  const displayMembers =
    activeTab === "current"
      ? currentMembers
      : pastMembers.filter((m) => m.batch_year === parseInt(activeTab));

  return (
    <div>
      {/* Tab strip */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-fredoka font-600 text-sm transition-all duration-150 ${
              activeTab === key
                ? key === "current"
                  ? "bg-coral border-navy text-white shadow-[3px_3px_0_#1a1a2e]"
                  : "bg-navy border-navy text-white shadow-[3px_3px_0_#1a1a2e]"
                : "bg-white border-navy/20 text-navy/60 hover:border-navy/60 hover:text-navy"
            }`}
          >
            <Icon size={14} />
            {label}
            <span className={`text-xs rounded-full px-1.5 py-0.5 font-nunito leading-none ${
              activeTab === key ? "bg-white/20 text-white" : "bg-navy/10 text-navy/60"
            }`}>{count}</span>
          </button>
        ))}
      </div>

      {/* Members grid */}
      {displayMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayMembers.map((m) => (
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
                {/* Past year badge */}
                {!m.is_current && m.batch_year && (
                  <div className="absolute top-3 right-3 bg-navy border-2 border-navy rounded-lg px-2.5 py-0.5 shadow-cartoon">
                    <p className="font-fredoka font-600 text-white text-xs">{m.batch_year}</p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-fredoka font-700 text-navy text-xl group-hover:text-coral">{m.name}</h3>
                <div className="flex flex-col gap-2 mt-4">
                  {m.phone && (
                    <a href={`tel:${m.phone}`} className="flex items-center gap-2 text-sm font-nunito text-navy/70 hover:text-coral transition-colors">
                      <Phone size={14} className="text-coral" />{m.phone}
                    </a>
                  )}
                  {m.email && (
                    <a href={`mailto:${m.email}`} className="flex items-center gap-2 text-sm font-nunito text-navy/70 hover:text-coral transition-colors truncate">
                      <Mail size={14} className="text-coral" />{m.email}
                    </a>
                  )}
                  {m.linkedin_url && (
                    <a href={m.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-nunito text-navy/70 hover:text-coral transition-colors">
                      <ExternalLink size={14} className="text-coral" />LinkedIn Profile
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
          <h3 className="font-fredoka font-600 text-navy text-xl">No council members here yet</h3>
          <p className="font-nunito text-navy/50 mt-2">Member profiles will be added soon.</p>
        </div>
      )}
    </div>
  );
}
