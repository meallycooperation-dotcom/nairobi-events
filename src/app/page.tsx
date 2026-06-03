import Link from "next/link";
import { getPublishedEvents } from "@/services/events";
import { EventCard } from "@/components/EventCard";
import { EventSearchFilters } from "@/components/EventSearchFilters";

export default async function HomePage() {
  const events = await getPublishedEvents();

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
        <EventSearchFilters events={events} />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between gap-4 pb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Popular events</h2>
            <p className="mt-2 text-sm text-slate-600">Hand-picked Nairobi experiences with open ticket sales.</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
