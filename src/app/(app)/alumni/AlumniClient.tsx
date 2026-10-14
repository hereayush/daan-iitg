"use client";

import { useState, useMemo } from "react";
import { Search, Phone, Mail, GraduationCap, Users } from "lucide-react";
import type { Alumni } from "@/lib/types";

interface Props {
  alumni: Alumni[];
  batches: string[];
}


// ---------------------------------------------------------------------------
// COE normalisation — maps every known dirty variant to a canonical label.
// Matching is always done on the normalised value so "JNV Banglore Urban" and
// "JNV BENGALURU URBAN" both resolve to the same bucket.
// ---------------------------------------------------------------------------
const COE_ALIASES: Record<string, string> = {
  // Dakshana Valley
  "dakshana valley":          "Dakshana Valley",
  "dakshana valley ":         "Dakshana Valley",
  "dakshana valley.":         "Dakshana Valley",

  // JNV Bengaluru Urban (every known spelling variant)
  "jnv bengaluru urban":      "JNV Bengaluru Urban",
  "jnv bangalore urban":      "JNV Bengaluru Urban",
  "jnv banglore urban":       "JNV Bengaluru Urban",
  "jnv bengaluru urban ":     "JNV Bengaluru Urban",
  "jnv bu":                   "JNV Bengaluru Urban",

  // Bare "Bangalore Urban" (no JNV prefix) — treat as same COE
  "bangalore urban":          "JNV Bengaluru Urban",
  "banglore urban":           "JNV Bengaluru Urban",

  // COE (generic/unknown) — keep as-is but normalise case
  "coe":                      "COE",
};

function normalizeCoe(raw: string | null): string | null {
  if (!raw) return null;
  const key = raw.trim().toLowerCase();
  return COE_ALIASES[key] ?? raw.trim().replace(/\s+/g, " ");
}
// ---------------------------------------------------------------------------

export default function AlumniClient({ alumni, batches }: Props) {
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedCoe, setSelectedCoe] = useState("all");

  // Build a deduplicated, normalised COE list for the dropdown
  const coes = useMemo(() => {
    const seen = new Set<string>();
    alumni.forEach((a) => {
      const norm = normalizeCoe(a.coe);
      if (norm) seen.add(norm);
    });
    return [...seen].sort();
  }, [alumni]);

  const filtered = useMemo(() => {
    return alumni.filter((a) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        a.scholar_name.toLowerCase().includes(q) ||
        (a.drn && a.drn.toLowerCase().includes(q)) ||
        (a.parent_school && a.parent_school.toLowerCase().includes(q)) ||
        (a.email && a.email.toLowerCase().includes(q));
      const matchesBatch = selectedBatch === "all" || a.batch === selectedBatch;
      // Compare on normalised COE so all variants match the selected canonical name
      const matchesCoe = selectedCoe === "all" || normalizeCoe(a.coe) === selectedCoe;
      return matchesSearch && matchesBatch && matchesCoe;
    });
  }, [alumni, search, selectedBatch, selectedCoe]);

  return (
    <div>
      {/* Filters */}
      <div className="card-cartoon bg-white p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" />
          <input
            type="text"
            placeholder="Search by name, DRN, school..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-cartoon pl-9"
          />
        </div>
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="input-cartoon sm:w-48"
        >
          <option value="all">All Batches</option>
          {batches.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select
          value={selectedCoe}
          onChange={(e) => setSelectedCoe(e.target.value)}
          className="input-cartoon sm:w-48"
        >
          <option value="all">All COEs</option>
          {coes.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="mb-4 flex items-center justify-between gap-3"><p className="font-nunito text-sm text-navy/60">Showing <span className="font-700 text-navy">{filtered.length}</span> of {alumni.length} scholars</p><span className="badge-cartoon bg-cream text-navy text-xs">Community directory</span></div>

      {/* Alumni grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((a) => (
            <article key={a.id} className="card-cartoon group bg-white p-5 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-cartoon-lg">
              {/* Avatar */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 border-2 border-navy rounded-xl overflow-hidden flex-shrink-0 bg-yellow flex items-center justify-center shadow-cartoon">
                  {a.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.photo_url} alt={a.scholar_name} className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap size={24} className="text-navy/60" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-fredoka font-600 text-navy text-base leading-tight truncate group-hover:text-coral">
                    {a.scholar_name}
                  </h3>
                  {a.drn && (
                    <p className="font-nunito text-xs text-navy/50">DRN: {a.drn}</p>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1.5">
                {a.batch && (
                  <span className="badge-cartoon bg-yellow text-navy text-xs w-fit">
                    {a.batch}
                  </span>
                )}
                {a.coe && (
                  <p className="font-nunito text-xs text-navy/70">
                    <span className="font-700">COE:</span> {normalizeCoe(a.coe)}
                  </p>
                )}
                {a.parent_school && (
                  <p className="font-nunito text-xs text-navy/70 truncate">
                    <span className="font-700">School:</span> {a.parent_school}
                  </p>
                )}
              </div>

              {/* Contacts */}
              <div className="flex flex-col gap-1 pt-1 border-t border-navy/10">
                {a.phone && (
                  <a
                    href={`tel:${a.phone}`}
                    className="flex items-center gap-1.5 text-xs font-nunito text-coral hover:underline"
                  >
                    <Phone size={12} /> {a.phone}
                  </a>
                )}
                {a.email && (
                  <a
                    href={`mailto:${a.email}`}
                    className="flex items-center gap-1.5 text-xs font-nunito text-coral hover:underline truncate"
                  >
                    <Mail size={12} /> {a.email}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card-cartoon bg-white p-16 text-center">
          <Users size={56} className="text-navy/20 mx-auto mb-4" />
          <h3 className="font-fredoka font-600 text-navy text-xl">No scholars found</h3>
          <p className="font-nunito text-navy/50 mt-2">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
