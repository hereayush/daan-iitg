"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { CalendarEvent } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Plus, X, Calendar, Loader2 } from "lucide-react";

// Dynamically import FullCalendar with SSR disabled — it uses browser APIs that crash on the server
const FullCalendarWrapper = dynamic(() => import("./FullCalendarWrapper"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-coral" />
    </div>
  ),
});

const TYPE_COLORS: Record<string, string> = {
  holiday: "#FF6B35",
  event: "#FFD60A",
  exam: "#1a1a2e",
  deadline: "#EF4444",
  other: "#8DB48E",
};

interface Props {
  events: CalendarEvent[];
  isAdmin: boolean;
}

export default function CalendarClient({ events: initialEvents, isAdmin }: Props) {
  const [events, setEvents] = useState(initialEvents);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [form, setForm] = useState({
    title: "",
    event_date: "",
    end_date: "",
    type: "event" as CalendarEvent["type"],
    description: "",
    color: "#FF6B35",
  });
  const supabase = createClient();

  const calEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    start: e.event_date,
    end: e.end_date || undefined,
    backgroundColor: TYPE_COLORS[e.type] || e.color,
    borderColor: "#1a1a2e",
    textColor: e.type === "event" ? "#1a1a2e" : "#ffffff",
    extendedProps: { type: e.type, description: e.description },
  }));

  const handleDateClick = (info: { dateStr: string }) => {
    if (!isAdmin) return;
    setSelectedDate(info.dateStr);
    setForm((f) => ({ ...f, event_date: info.dateStr }));
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.event_date) {
      toast.error("Title and date are required.");
      return;
    }
    const { data, error } = await supabase
      .from("calendar_events")
      .insert({
        title: form.title,
        event_date: form.event_date,
        end_date: form.end_date || null,
        type: form.type,
        color: TYPE_COLORS[form.type],
        description: form.description || null,
        is_manual: true,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add event.");
    } else {
      toast.success("Event added!");
      setEvents((prev) => [...prev, data]);
      setShowModal(false);
      setForm({ title: "", event_date: "", end_date: "", type: "event", description: "", color: "#FF6B35" });
    }
  };

  const handleEventClick = async (info: { event: { id: string; title: string }; jsEvent: MouseEvent }) => {
    if (!isAdmin) return;
    if (confirm(`Delete event: "${info.event.title}"?`)) {
      const { error } = await supabase.from("calendar_events").delete().eq("id", info.event.id);
      if (!error) {
        setEvents((prev) => prev.filter((e) => e.id !== info.event.id));
        toast.success("Event deleted.");
      }
    }
  };

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm border border-navy"
              style={{ backgroundColor: color }}
            />
            <span className="font-nunito text-xs text-navy/70 capitalize">{type}</span>
          </div>
        ))}
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-cartoon btn-coral text-xs px-3 py-1.5 ml-auto"
          >
            <Plus size={14} /> Add Event
          </button>
        )}
      </div>

      {/* Calendar */}
      <div className="card-cartoon bg-white p-4 sm:p-6 overflow-x-auto">
        <FullCalendarWrapper
          events={calEvents}
          onDateClick={handleDateClick}
          onEventClick={handleEventClick as any}
        />
      </div>

      {/* Upcoming events list */}
      <div className="mt-8">
        <h2 className="font-fredoka font-600 text-navy text-xl mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-coral" /> Upcoming Events
        </h2>
        <div className="flex flex-col gap-3">
          {events
            .filter((e) => e.event_date >= new Date().toISOString().split("T")[0])
            .slice(0, 5)
            .map((e) => (
              <div key={e.id} className="card-cartoon bg-white p-4 flex items-center gap-4">
                <div
                  className="w-2 h-12 rounded-full border border-navy flex-shrink-0"
                  style={{ backgroundColor: TYPE_COLORS[e.type] }}
                />
                <div>
                  <p className="font-fredoka font-600 text-navy text-base">{e.title}</p>
                  <p className="font-nunito text-xs text-navy/60">
                    {new Date(e.event_date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                    })}
                    <span className="ml-2 capitalize badge-cartoon bg-cream text-navy">{e.type}</span>
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Add event modal */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-cartoon bg-white w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-navy/40 hover:text-navy"
            >
              <X size={20} />
            </button>
            <h3 className="font-fredoka font-700 text-navy text-xl mb-5">Add Calendar Event</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="font-nunito font-600 text-sm text-navy mb-1 block">Title *</label>
                <input
                  required
                  className="input-cartoon"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Event title"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-nunito font-600 text-sm text-navy mb-1 block">Start Date *</label>
                  <input
                    required
                    type="date"
                    className="input-cartoon"
                    value={form.event_date}
                    onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="font-nunito font-600 text-sm text-navy mb-1 block">End Date</label>
                  <input
                    type="date"
                    className="input-cartoon"
                    value={form.end_date}
                    onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="font-nunito font-600 text-sm text-navy mb-1 block">Type</label>
                <select
                  className="input-cartoon"
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as CalendarEvent["type"] }))}
                >
                  <option value="holiday">Holiday</option>
                  <option value="event">Event</option>
                  <option value="exam">Exam</option>
                  <option value="deadline">Deadline</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="font-nunito font-600 text-sm text-navy mb-1 block">Description</label>
                <textarea
                  className="input-cartoon"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Optional description..."
                />
              </div>
              <button type="submit" className="btn-cartoon btn-coral w-full mt-2">
                <Plus size={16} /> Add Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
