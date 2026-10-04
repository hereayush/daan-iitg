"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

interface CalEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: { type: string; description: string | null };
}

interface Props {
  events: CalEvent[];
  onDateClick: (info: { dateStr: string }) => void;
  onEventClick: (info: { event: { id: string; title: string }; jsEvent: MouseEvent }) => void;
}

export default function FullCalendarWrapper({ events, onDateClick, onEventClick }: Props) {
  return (
    <>
      <style>{`
        .fc .fc-button { 
          background: #1a1a2e !important; 
          border: 2px solid #1a1a2e !important;
          color: white !important;
          border-radius: 6px !important;
          font-family: var(--font-fredoka) !important;
          font-weight: 600 !important;
          box-shadow: 2px 2px 0 #1a1a2e !important;
        }
        .fc .fc-button:hover { background: #FF6B35 !important; }
        .fc .fc-toolbar-title { font-family: var(--font-fredoka) !important; font-size: 1.4rem !important; color: #1a1a2e !important; }
        .fc .fc-day-today { background: #FEFAE0 !important; }
        .fc .fc-event { border-radius: 4px !important; border: 1.5px solid #1a1a2e !important; cursor: pointer !important; }
        .fc .fc-col-header-cell { font-family: var(--font-fredoka) !important; }
        .fc .fc-daygrid-day-number { font-family: var(--font-nunito) !important; }
      `}</style>
      <FullCalendar
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        plugins={[dayGridPlugin, interactionPlugin, listPlugin] as any[]}
        initialView="dayGridMonth"
        events={events}
        dateClick={onDateClick}
        eventClick={onEventClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,listMonth",
        }}
        height="auto"
      />
    </>
  );
}
