import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventById } from "@/services/events";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TicketTierSelector } from "@/components/TicketTierSelector";

type EventDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Event details</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">{event.title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{event.description}</p>
        </div>
        <Link
          href="/events"
          className="inline-flex rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
        >
          Back to events
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="rounded-3xl overflow-hidden bg-slate-100">
            {event.poster_url ? (
              <img src={event.poster_url} alt={event.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-80 items-center justify-center bg-slate-200 text-slate-500">No poster available</div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">When</p>
              <p className="mt-3 text-lg font-semibold text-slate-950">{formatDate(event.event_date)}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Where</p>
              <p className="mt-3 text-lg font-semibold text-slate-950">{event.venue}</p>
              <p className="mt-2 text-sm text-slate-600">{event.location ?? "Nairobi"}</p>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <TicketTierSelector eventId={event.id} ticketTypes={event.ticket_types ?? []} />

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Event summary</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li>
                <span className="font-semibold text-slate-950">Category:</span> {event.category ?? "General"}
              </li>
              <li>
                <span className="font-semibold text-slate-950">Created:</span> {formatDate(event.created_at)}
              </li>
              <li>
                <span className="font-semibold text-slate-950">Status:</span> {event.status}
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
