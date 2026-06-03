"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TicketType } from "@/types";
import { formatCurrency } from "@/lib/utils";

type TicketTierSelectorProps = {
  eventId: string;
  ticketTypes: TicketType[];
};

export function TicketTierSelector({ eventId, ticketTypes }: TicketTierSelectorProps) {
  const router = useRouter();
  const [selectedTicketId, setSelectedTicketId] = useState("");

  const handleCheckout = () => {
    if (!selectedTicketId) return;
    router.push(
      `/checkout?eventId=${encodeURIComponent(eventId)}&ticketTypeId=${encodeURIComponent(selectedTicketId)}`
    );
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Ticket tiers</p>
      <div className="mt-6 space-y-4">
        {ticketTypes.map((ticket) => {
          const isSelected = ticket.id === selectedTicketId;
          return (
            <button
              key={ticket.id}
              type="button"
              onClick={() => setSelectedTicketId(ticket.id)}
              className={`w-full rounded-3xl border p-5 text-left transition ${
                isSelected
                  ? "border-slate-950 bg-slate-950/5"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-slate-950">{ticket.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{ticket.quantity - ticket.sold} remaining</p>
                </div>
                <p className="text-lg font-semibold text-slate-950">{formatCurrency(ticket.price)}</p>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!selectedTicketId}
        onClick={handleCheckout}
        className={`mt-6 inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white transition ${
          selectedTicketId
            ? "bg-slate-950 hover:bg-slate-800"
            : "cursor-not-allowed bg-slate-300 text-slate-600"
        }`}
      >
        Start checkout
      </button>

      {!selectedTicketId ? (
        <p className="mt-3 text-sm text-slate-500">Select a ticket tier first to continue.</p>
      ) : null}
    </div>
  );
}
