"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TicketType, Event } from "@/types";
import { formatCurrency } from "@/lib/utils";

type CheckoutFormProps = {
  event: Event;
  ticketTypes: TicketType[];
  defaultTicketTypeId?: string;
};

export function CheckoutForm({ event, ticketTypes, defaultTicketTypeId }: CheckoutFormProps) {
  const [selectedTicketType, setSelectedTicketType] = useState(
    ticketTypes.find((ticket) => ticket.id === defaultTicketTypeId)?.id ?? ticketTypes[0]?.id ?? ""
  );
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;
      if (user) {
        setUserId(user.id);
        setUserEmail(user.email ?? "");
      }
    };

    loadSession();
  }, []);

  const chosenTicketType = useMemo(
    () => ticketTypes.find((ticket) => ticket.id === selectedTicketType) || ticketTypes[0],
    [selectedTicketType, ticketTypes]
  );

  const totalAmount = chosenTicketType ? chosenTicketType.price * quantity : 0;

  const handleSubmit = async (eventSubmit: React.FormEvent<HTMLFormElement>) => {
    eventSubmit.preventDefault();
    setError(null);

    if (!chosenTicketType) {
      setError("Please select a ticket tier before proceeding.");
      return;
    }

    if (!userId || !userEmail) {
      setError("You must be signed in to complete checkout.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event.id,
          ticketTypeId: chosenTicketType.id,
          quantity,
          amount: totalAmount,
          userId,
          userEmail,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      const text = await response.text();
      const data = contentType.includes("application/json")
        ? JSON.parse(text)
        : null;

      if (!response.ok) {
        const message = data?.message || text || "Unable to start checkout.";
        throw new Error(message);
      }

      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setError("Unexpected response from checkout service.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!ticketTypes.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">No tickets available</h2>
        <p className="mt-3 text-slate-600">This event does not have ticket tiers configured yet. Contact the organizer for more information.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Checkout</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">{event.title}</h2>
        {chosenTicketType ? (
          <p className="mt-3 text-sm text-slate-600">
            Selected tier: <span className="font-semibold text-slate-950">{chosenTicketType.name}</span> — {formatCurrency(chosenTicketType.price)}
          </p>
        ) : null}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm text-slate-700">
          Ticket tier
          <select
            value={selectedTicketType}
            onChange={(event) => setSelectedTicketType(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
          >
            {ticketTypes.map((ticket) => (
              <option key={ticket.id} value={ticket.id}>
                {ticket.name} — {formatCurrency(ticket.price)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-slate-700">
          Quantity
          <input
            type="number"
            min={1}
            max={10}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
          />
        </label>
      </div>
      <div className="rounded-3xl bg-slate-50 p-5">
        <p className="text-sm text-slate-500">Order summary</p>
        <p className="mt-3 text-lg font-semibold text-slate-950">{formatCurrency(totalAmount)}</p>
        <p className="mt-1 text-sm text-slate-600">{quantity} x {chosenTicketType?.name ?? "ticket"}</p>
      </div>
      {!userId ? (
        <p className="text-sm text-red-600">Please login to check out.</p>
      ) : null}
      <button
        type="submit"
        disabled={!chosenTicketType || !userId || isSubmitting}
        className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Processing…" : "Proceed to payment"}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {status ? <p className="text-sm text-slate-600">{status}</p> : null}
    </form>
  );
}
