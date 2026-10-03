export type Role = "user" | "sub_admin" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: Role;
  is_approved: boolean;
  drn: string | null;
  batch: string | null;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  caption: string | null;
  description: string | null;
  photo_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Alumni {
  id: string;
  drn: string | null;
  scholar_name: string;
  coe: string | null;
  parent_school: string | null;
  batch: string | null;
  phone: string | null;
  email: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CouncilMember {
  id: string;
  name: string;
  designation: string;
  photo_url: string | null;
  phone: string | null;
  email: string | null;
  linkedin_url: string | null;
  display_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  photo_url: string | null;
  event_date: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type CalendarEventType = "holiday" | "event" | "exam" | "deadline" | "other";

export interface CalendarEvent {
  id: string;
  title: string;
  event_date: string;
  end_date: string | null;
  type: CalendarEventType;
  color: string;
  description: string | null;
  is_manual: boolean;
  created_at: string;
  updated_at: string;
}

export interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string | null;
  url: string | null;
  created_at: string;
  sent_at: string | null;
}
