import { getEventById } from "@/services/events";
import { CheckoutForm } from "@/components/CheckoutForm";

type CheckoutPageProps = {
  searchParams: Promise<{
    eventId?: string;
    ticketTypeId?: string;
  }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { eventId, ticketTypeId } = await searchParams;
  const event = eventId ? await getEventById(eventId) : null;

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Checkout</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Complete your ticket purchase.</h1>
      </div>
      {event ? (
        <CheckoutForm event={event} ticketTypes={event.ticket_types ?? []} defaultTicketTypeId={ticketTypeId} />
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-slate-700 shadow-sm">
          <p className="text-lg font-semibold text-slate-950">No event selected</p>
          <p className="mt-3">Please select an event from the events page before proceeding to checkout.</p>
        </div>
      )}
    </div>
  );
}
