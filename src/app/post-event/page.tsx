"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const ticketTypeOptions = [
  { id: "regular", label: "Regular" },
  { id: "vip", label: "VIP" },
  { id: "vvip", label: "VVIP" },
];

export default function PostEventPage() {
  const [eventTitle, setEventTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [poster, setPoster] = useState<File | null>(null);
  const [organizerName, setOrganizerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [ticketTypes, setTicketTypes] = useState<Record<string, boolean>>({
    regular: true,
    vip: true,
    vvip: true,
  });
  const [ticketPrices, setTicketPrices] = useState<Record<string, number>>({
    regular: 500,
    vip: 2000,
    vvip: 5000,
  });
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) setIsAuthenticated(!!data.session);
      } catch {
        if (mounted) setIsAuthenticated(false);
      }
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setIsAuthenticated(!!session);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe?.();
    };
  }, []);

  const handleTicketTypeChange = (id: string) => {
    setTicketTypes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTicketPriceChange = (id: string, value: number) => {
    setTicketPrices((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");
    setIsSubmitting(true);

    const selectedTicketTypes = ticketTypeOptions
      .filter((ticket) => ticketTypes[ticket.id])
      .map((ticket) => ({
        id: ticket.id,
        label: ticket.label,
        price: Number(ticketPrices[ticket.id] ?? 0),
      }));

    try {
      // upload poster if provided
      let posterUrl: string | null = null;
      if (poster) {
        const ext = poster.name.split(".").pop() ?? "jpg";
        const filePath = `posters/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("poster-events")
          .upload(filePath, poster, { cacheControl: "3600", upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage.from("poster-events").getPublicUrl(filePath);
        posterUrl = publicData?.publicUrl ?? null;
      }

      const response = await fetch("/api/event-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventTitle,
          description,
          category,
          venue,
          location,
          date,
          time,
          posterUrl,
          organizerName,
          phoneNumber,
          emailAddress,
          ticketTypes: selectedTicketTypes,
          notes,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to submit event.");
      }

      setStatusMessage("Event request submitted successfully. Thank you!");
      setEventTitle("");
      setDescription("");
      setCategory("");
      setVenue("");
      setLocation("");
      setDate("");
      setTime("");
      setPoster(null);
      setOrganizerName("");
      setPhoneNumber("");
      setEmailAddress("");
      setTicketTypes({ regular: true, vip: true, vvip: true });
      setNotes("");
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to submit event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
      <div className="mb-10 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Event Form for Users</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">Post your event</h1>
          </div>
          <Link
            href="/"
            className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back home
          </Link>
        </div>
        <p className="max-w-2xl text-sm text-slate-600">
          Use this form to submit your event details, contact information, ticket options, and additional notes.
        </p>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-600" />
            <h2 className="text-xl font-semibold text-slate-950">Event Details</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              Event Title
              <input
                value={eventTitle}
                onChange={(event) => setEventTitle(event.target.value)}
                placeholder="Enter event title"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Category
              <input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="Music, sports, workshops..."
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
              Description
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Tell us what your event is about"
                className="min-h-[140px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Venue
              <input
                value={venue}
                onChange={(event) => setVenue(event.target.value)}
                placeholder="Venue name"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Location
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Nairobi, Kenya"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Date
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Time
              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
              Poster
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setPoster(event.target.files?.[0] ?? null)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none"
              />
            </label>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-600" />
            <h2 className="text-xl font-semibold text-slate-950">Contact Details</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              Organizer Name
              <input
                value={organizerName}
                onChange={(event) => setOrganizerName(event.target.value)}
                placeholder="Your name"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Phone Number
              <input
                type="tel"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="+254 700 000 000"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
              Email Address
              <input
                type="email"
                value={emailAddress}
                onChange={(event) => setEmailAddress(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none"
                required
              />
            </label>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-600" />
            <h2 className="text-xl font-semibold text-slate-950">Ticket Types</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {ticketTypeOptions.map((ticket) => (
              <label
                key={ticket.id}
                className="inline-flex w-full items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-950 transition hover:border-slate-300"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={ticketTypes[ticket.id]}
                    onChange={() => handleTicketTypeChange(ticket.id)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                  />
                  <div>
                    <div className="block font-semibold">{ticket.label}</div>
                    <div className="text-slate-600 text-sm">Price (KES)</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={ticketPrices[ticket.id]}
                    onChange={(e) => handleTicketPriceChange(ticket.id, Number(e.target.value))}
                    min={0}
                    className="w-28 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
                  />
                </div>
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-600" />
            <h2 className="text-xl font-semibold text-slate-950">Additional Notes</h2>
          </div>
          <label className="space-y-2 text-sm text-slate-700">
            Anything we should know?
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add any extra information about your event"
              className="min-h-[140px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none"
            />
          </label>
        </section>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-emerald-400 hover:bg-emerald-700"
            >
              {isSubmitting ? "Submitting…" : "Submit event"}
            </button>
            <div>
              {statusMessage ? <p className="text-sm text-emerald-700">{statusMessage}</p> : null}
              {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
            </div>
          </div>
        </form>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-lg font-semibold text-slate-950">Please sign in to post an event</p>
          <p className="mt-2 text-sm text-slate-600">You must be signed in to submit an event. Create an account or sign in to continue.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/login" className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Login
            </Link>
            <Link href="/signup" className="inline-flex rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
              Sign up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
