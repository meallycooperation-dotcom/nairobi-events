import Link from "next/link";
import { Event } from "@/types";
import { formatCurrency } from "@/lib/utils";

function formatEventDate(dateValue: string) {
  const date = new Date(dateValue);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function EventCard({ event }: { event: Event }) {
  const lowestPrice = event.ticket_types?.reduce<number>((best, ticket) => Math.min(best, ticket.price), Number.POSITIVE_INFINITY) ?? 0;
  const priceLabel = lowestPrice > 0 ? formatCurrency(lowestPrice) : "Free";

  return (
    <Link
      href={`/events/${encodeURIComponent(event.id)}`}
      className="group block overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative overflow-hidden bg-slate-100">
        {event.poster_url ? (
          <img
            src={event.poster_url}
            alt={event.title}
            className="h-72 w-full object-contain bg-slate-100"
          />
        ) : (
          <div className="flex h-72 items-center justify-center bg-slate-200 text-sm uppercase tracking-[0.3em] text-slate-500">
            No poster available
          </div>
        )}

        <div className="absolute inset-x-0 top-4 px-5">
          <span className="inline-flex rounded-full bg-slate-950/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white">
            {event.category ?? "Live"}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{formatEventDate(event.event_date)}</p>
          <h3 className="text-2xl font-semibold text-slate-950">{event.title}</h3>
          <p className="text-sm text-slate-600">{event.venue}</p>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Starting at</p>
            <p className="mt-1 text-lg font-semibold text-slate-950">{priceLabel}</p>
          </div>
          <span className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white">
            Book now
          </span>
        </div>
      </div>
    </Link>
  );
}
