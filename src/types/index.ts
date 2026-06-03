export type Profile = {
  id: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: "attendee" | "organizer" | "admin";
  created_at: string;
};

export type TicketType = {
  id: string;
  event_id: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
  created_at: string;
};

export type Event = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  venue: string;
  location?: string;
  event_date: string;
  poster_url?: string;
  organizer_id: string;
  status: "draft" | "published" | "cancelled" | "completed";
  created_at: string;
  ticket_types?: TicketType[];
};

export type Order = {
  id: string;
  user_id: string;
  total_amount: number;
  status: "pending" | "paid" | "cancelled" | "refunded";
  payment_reference?: string;
  created_at: string;
};

export type Ticket = {
  id: string;
  order_id: string;
  event_id: string;
  ticket_type_id: string;
  owner_id: string;
  ticket_code: string;
  qr_code_url?: string;
  status: "valid" | "used" | "cancelled";
  checked_in_at?: string;
  created_at: string;
};

export type Payment = {
  id: string;
  order_id: string;
  amount: number;
  provider: string;
  provider_reference?: string;
  status: "pending" | "success" | "failed";
  created_at: string;
};

export type TicketScan = {
  id: string;
  ticket_id: string;
  scanned_by?: string;
  scanned_at: string;
  result: "valid" | "duplicate" | "invalid";
};
