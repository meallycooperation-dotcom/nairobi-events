import { getPublishedEvents } from "@/services/events";
import { EventSearchFilters } from "@/components/EventSearchFilters";

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
      <EventSearchFilters events={events} showInitialResults />
    </div>
  );
}
