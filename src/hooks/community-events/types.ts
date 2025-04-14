
// Types for community events functionality
export interface Event {
  id: string;
  title: string;
  date: string;
  event_date: string; // Raw date string from database
  location: string;
  participants: number;
  ticket_cost: number | null;
  is_open: boolean;
}

export interface EventFormData {
  title: string;
  location: string;
  event_date: Date;
  notes?: string;
  is_free: boolean;
  ticket_cost?: number;
  max_participants: number;
}
