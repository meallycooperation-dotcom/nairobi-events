"use client";

import QRCode from "react-qr-code";
import { Ticket } from "@/types";
import { formatDate } from "@/lib/utils";

export function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Ticket code</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{ticket.ticket_code}</p>
        </div>
        <span className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700">{ticket.status}</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_120px] sm:items-center">
        <div className="space-y-3">
          <p className="text-sm text-slate-600">Owner</p>
          <p className="text-base font-medium text-slate-950">{ticket.owner_id}</p>
          <p className="text-sm text-slate-500">Checked in at: {ticket.checked_in_at ? formatDate(ticket.checked_in_at) : "Not yet"}</p>
        </div>
        <div className="rounded-3xl bg-slate-100 p-4">
          <QRCode value={ticket.qr_code_url ?? ticket.ticket_code} size={88} />
        </div>
      </div>
    </div>
  );
}
