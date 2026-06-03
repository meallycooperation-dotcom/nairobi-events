import { supabase, isSupabaseEnabled } from "@/lib/supabase";
import { Event, TicketType } from "@/types";

const fallbackEvents: Event[] = [
  {
    id: "demo-1",
    title: "Nairobi Jazz Nights",
    description: "An evening of live jazz, rooftop views and local food vendors.",
    category: "Music",
    venue: "Kūna Rooftop",
    location: "Westlands, Nairobi",
    event_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    poster_url: "/event-1.jpg",
    organizer_id: "demo-organizer",
    status: "published",
    created_at: new Date().toISOString(),
    ticket_types: [
      { id: "t1", event_id: "demo-1", name: "Regular", price: 500, quantity: 200, sold: 32, created_at: new Date().toISOString() },
      { id: "t2", event_id: "demo-1", name: "VIP", price: 1500, quantity: 80, sold: 14, created_at: new Date().toISOString() },
    ],
  },
  {
    id: "demo-2",
    title: "Startup Showcase",
    description: "See the next generation of Kenyan founders pitch their startups.",
    category: "Business",
    venue: "Nairobi Innovation Hub",
    location: "Westlands, Nairobi",
    event_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    poster_url: "/event-2.jpg",
    organizer_id: "demo-organizer",
    status: "published",
    created_at: new Date().toISOString(),
    ticket_types: [
      { id: "t3", event_id: "demo-2", name: "General", price: 300, quantity: 250, sold: 68, created_at: new Date().toISOString() },
      { id: "t4", event_id: "demo-2", name: "Founder Pass", price: 1200, quantity: 40, sold: 9, created_at: new Date().toISOString() },
    ],
  },
  {
    id: "demo-3",
    title: "Art & Food Festival",
    description: "A full day of live art, local cuisine and family entertainment.",
    category: "Culture",
    venue: "Ngong Racecourse",
    location: "Ngong, Nairobi",
    event_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString(),
    poster_url: "/event-3.jpg",
    organizer_id: "demo-organizer",
    status: "published",
    created_at: new Date().toISOString(),
    ticket_types: [
      { id: "t5", event_id: "demo-3", name: "Day Pass", price: 700, quantity: 300, sold: 124, created_at: new Date().toISOString() },
      { id: "t6", event_id: "demo-3", name: "Family Pack", price: 2500, quantity: 40, sold: 12, created_at: new Date().toISOString() },
    ],
  },
];

function normalizeTicketType(raw: any): TicketType {
  return {
    id: raw.id,
    event_id: raw.event_id,
    name: raw.name,
    price: typeof raw.price === "string" ? Number(raw.price) : raw.price,
    quantity: raw.quantity,
    sold: raw.sold ?? 0,
    created_at: raw.created_at,
  };
}

function normalizeEvent(raw: any): Event {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? "",
    category: raw.category ?? "General",
    venue: raw.venue,
    location: raw.location ?? "Nairobi",
    event_date: raw.event_date,
    poster_url: raw.poster_url ?? "/event-default.jpg",
    organizer_id: raw.organizer_id,
    status: raw.status,
    created_at: raw.created_at,
    ticket_types: Array.isArray(raw.ticket_types)
      ? raw.ticket_types.map(normalizeTicketType)
      : [],
  };
}

export async function getPublishedEvents(): Promise<Event[]> {
  if (!isSupabaseEnabled) {
    return fallbackEvents;
  }

  const { data, error } = await supabase
    .from("events")
    .select("*, ticket_types(*)")
    .eq("status", "published")
    .order("event_date", { ascending: true });

  if (error || !data) {
    return fallbackEvents;
  }

  return data.map(normalizeEvent);
}

export async function getEventById(eventId: string): Promise<Event | null> {
  if (!isSupabaseEnabled) {
    return fallbackEvents.find((event) => event.id === eventId) ?? null;
  }

  const { data, error } = await supabase
    .from("events")
    .select("*, ticket_types(*)")
    .eq("id", eventId)
    .single();

  if (error || !data) {
    return fallbackEvents.find((event) => event.id === eventId) ?? null;
  }

  return normalizeEvent(data);
}
