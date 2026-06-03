import type { Metadata } from "next";
import { getPublishedEvents } from "@/services/events";
import { EventSearchFilters } from "@/components/EventSearchFilters";

export const metadata: Metadata = {
  title: "Browse Nairobi Events",
  description:
    "Search Nairobi's latest events by location, category, and price. Find live music, social events, and experiences in Nairobi.",
  openGraph: {
    title: "Browse Nairobi Events",
    description:
      "Search Nairobi's latest events by location, category, and price. Find live music, social events, and experiences in Nairobi.",
    type: "website",
    images: [
      {
        url: "/poster1_converted.webp",
        alt: "Browse Nairobi Events",
      },
    ],
  },
};

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
      <EventSearchFilters events={events} showInitialResults />
    </div>
  );
}
