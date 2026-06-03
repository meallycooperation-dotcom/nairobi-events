"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useCartState } from "@/components/cart/useCartState";

export default function CartPage() {
  const { items, total, updateQuantity, removeItem, clear } = useCartState();

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Cart</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Review the tickets you&apos;ve saved.</h1>
        </div>
        <Link href="/events" className="text-sm font-semibold text-slate-950 hover:text-slate-700">
          Continue browsing
        </Link>
      </div>

      {items.length ? (
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <div className="grid gap-0 md:grid-cols-[180px_1fr]">
                  <div className="relative min-h-56 bg-slate-100">
                    {item.posterUrl ? (
                      <Image src={item.posterUrl} alt={item.eventTitle} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm uppercase tracking-[0.3em] text-slate-500">
                        No poster
                      </div>
                    )}
                  </div>
                  <div className="space-y-5 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Ticket</p>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-950">{item.eventTitle}</h2>
                        <p className="mt-2 text-sm text-slate-600">{item.venue}</p>
                        <p className="mt-1 text-sm text-slate-500">{formatDate(item.eventDate)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">{item.ticketTypeName}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">{formatCurrency(item.price)} each</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="inline-flex items-center rounded-2xl border border-slate-300">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="inline-flex h-11 w-11 items-center justify-center text-slate-700 transition hover:bg-slate-50"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-12 px-4 text-center text-sm font-semibold text-slate-950">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="inline-flex h-11 w-11 items-center justify-center text-slate-700 transition hover:bg-slate-50"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-500">Line total</p>
                        <p className="text-xl font-semibold text-slate-950">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/checkout?eventId=${encodeURIComponent(item.eventId)}`}
                        className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Checkout this event
                      </Link>
                      <Link
                        href="/events"
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                      >
                        Add more tickets
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Summary</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">{items.length} item{items.length === 1 ? "" : "s"}</h2>
              </div>
            </div>

            <div className="mt-6 space-y-4 rounded-3xl bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-600">Ticket total</span>
                <span className="text-sm font-semibold text-slate-950">{formatCurrency(total)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-600">Delivery</span>
                <span className="text-sm font-semibold text-slate-950">Digital QR</span>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-base font-semibold text-slate-950">Estimated total</span>
                  <span className="text-lg font-semibold text-slate-950">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Checkout is handled per event right now, so use the event checkout button on any item to complete payment for that selection.
            </p>

            <div className="mt-6 grid gap-3">
              <Link
                href={items.length ? `/checkout?eventId=${encodeURIComponent(items[0].eventId)}` : "/checkout"}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Go to checkout
              </Link>
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Clear cart
              </button>
            </div>
          </aside>
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-slate-950">Your cart is empty</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Add an event ticket from the events page, then use the image preview or the add-to-cart button to save it here.
          </p>
          <Link
            href="/events"
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Browse events
          </Link>
        </div>
      )}
    </div>
  );
}
