import { getDashboardStats } from "@/services/dashboard";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Organizer dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Track events, sales, and ticket activity.</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Published events</p>
          <p className="mt-4 text-4xl font-semibold text-slate-950">{stats.publishedEvents}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Live orders</p>
          <p className="mt-4 text-4xl font-semibold text-slate-950">{stats.liveOrders}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Active tickets</p>
          <p className="mt-4 text-4xl font-semibold text-slate-950">{stats.activeTickets}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Successful payments</p>
          <p className="mt-4 text-4xl font-semibold text-slate-950">{stats.totalPayments}</p>
        </div>
      </div>
    </div>
  );
}
