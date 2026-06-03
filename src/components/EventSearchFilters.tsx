"use client";

import { useMemo, useState } from "react";
import { Event } from "@/types";
import { EventCard } from "./EventCard";

const priceOptions = [
  { value: "all", label: "All prices" },
  { value: "free", label: "Free" },
  { value: "under-500", label: "Under KES 500" },
  { value: "500-1000", label: "KES 500 - 1000" },
  { value: "over-1000", label: "Over KES 1000" },
];

function getMinimumPrice(event: Event) {
  return event.ticket_types?.reduce<number>(
    (min, ticket) => Math.min(min, ticket.price),
    Number.POSITIVE_INFINITY
  ) ?? Number.POSITIVE_INFINITY;
}

export function EventSearchFilters({
  events,
  showInitialResults = false,
}: {
  events: Event[];
  showInitialResults?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewEvents, setShowNewEvents] = useState(false);
  const [locationFilter, setLocationFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const locationOptions = useMemo(
    () => [
      { value: "all", label: "All locations" },
      ...Array.from(
        new Set(events.map((event) => event.location ?? "Nairobi"))
      ).map((location) => ({ value: location, label: location })),
    ],
    [events]
  );

  const filteredEvents = useMemo(() => {
    const lowerQuery = searchQuery.trim().toLowerCase();
    const newThreshold = Date.now() - 1000 * 60 * 60 * 24 * 14; // 14 days

    return events.filter((event) => {
      if (lowerQuery && !event.title.toLowerCase().includes(lowerQuery)) {
        return false;
      }

      if (showNewEvents) {
        const createdAt = new Date(event.created_at).getTime();
        if (Number.isNaN(createdAt) || createdAt < newThreshold) {
          return false;
        }
      }

      if (locationFilter !== "all") {
        const location = event.location ?? "Nairobi";
        if (location !== locationFilter) {
          return false;
        }
      }

      const minPrice = getMinimumPrice(event);
      switch (priceFilter) {
        case "free":
          return minPrice === 0;
        case "under-500":
          return minPrice > 0 && minPrice < 500;
        case "500-1000":
          return minPrice >= 500 && minPrice <= 1000;
        case "over-1000":
          return minPrice > 1000;
        default:
          return true;
      }
    });
  }, [events, searchQuery, showNewEvents, locationFilter, priceFilter]);

  const isSearchActive =
    showInitialResults ||
    Boolean(searchQuery.trim()) ||
    showNewEvents ||
    locationFilter !== "all" ||
    priceFilter !== "all";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="absolute inset-0 bg-[url('/poster1_converted.webp')] bg-cover bg-center opacity-90" />
        <div className="relative">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              id="event-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search events"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 md:max-w-[320px]"
            />

            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={showNewEvents}
                  onChange={(event) => setShowNewEvents(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950"
                />
                New events only
              </label>
              <select
                value={locationFilter}
                onChange={(event) => setLocationFilter(event.target.value)}
                className="min-w-[160px] rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none"
              >
                {locationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={priceFilter}
                onChange={(event) => setPriceFilter(event.target.value)}
                className="min-w-[160px] rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none"
              >
                {priceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {isSearchActive ? (
        <section className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
