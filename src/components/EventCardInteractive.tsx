"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, Plus, X } from "lucide-react";
import { Event } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useCartState } from "./cart/useCartState";

export function EventCardInteractive({ event }: { event: Event }) {
  const ticketTypes = event.ticket_types ?? [];
  const { addItem } = useCartState();
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState(ticketTypes[0]?.id ?? "");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const selectedTicketType = ticketTypes.find((ticket) => ticket.id === selectedTicketTypeId) ?? ticketTypes[0];

  const handleAddToCart = () => {
    if (!selectedTicketType) {
      return;
    }

    addItem({
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.event_date,
      venue: event.venue,
      posterUrl: event.poster_url,
      ticketTypeId: selectedTicketType.id,
      ticketTypeName: selectedTicketType.name,
      price: selectedTicketType.price,
      quantity: 1,
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsPreviewOpen(true)}
        className="group relative block aspect-[4/3] w-full overflow-hidden bg-slate-100 text-left text-slate-500"
        aria-label={`View poster for ${event.title}`}
      >
        {event.poster_url ? (
          <Image
            src={event.poster_url}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-white text-sm uppercase tracking-[0.3em] text-slate-500">
            No poster
          </div>
        )}
        <span className="absolute inset-x-4 bottom-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-900 shadow-lg">
          <Eye className="h-4 w-4" />
          View image
        </span>
      </button>

      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.25em] text-slate-500">
          <span>{event.category ?? "General"}</span>
          <span>{new Date(event.event_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-950">{event.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{event.description ?? "No description available."}</p>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm text-slate-700">
          <span>{event.venue}</span>
          <span className="font-semibold text-slate-950">
            {selectedTicketType ? `${formatCurrency(selectedTicketType.price)}+` : "Free"}
          </span>
        </div>

        {ticketTypes.length ? (
          <label className="block text-sm text-slate-700">
            Ticket tier
            <select
              value={selectedTicketTypeId}
              onChange={(event) => setSelectedTicketTypeId(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
            >
              {ticketTypes.map((ticket) => (
                <option key={ticket.id} value={ticket.id}>
                  {ticket.name} - {formatCurrency(ticket.price)}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">This event has no ticket tiers yet.</p>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!selectedTicketType}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Plus className="h-4 w-4" />
            Add to cart
          </button>
          <Link
            href={`/checkout?eventId=${encodeURIComponent(event.id)}`}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Checkout now
          </Link>
        </div>
      </div>

      {isPreviewOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-950 shadow-lg transition hover:bg-white"
              aria-label="Close image preview"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative aspect-[16/10] w-full bg-slate-100">
              {event.poster_url ? (
                <Image
                  src={event.poster_url}
                  alt={event.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  unoptimized
                />
              ) : null}
            </div>
            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Poster preview</p>
                <h4 className="mt-2 text-2xl font-semibold text-slate-950">{event.title}</h4>
              </div>
              <Link
                href={`/checkout?eventId=${encodeURIComponent(event.id)}`}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Go to checkout
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
