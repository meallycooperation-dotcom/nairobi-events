import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/90 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 sm:px-10 lg:px-12 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-semibold text-slate-950">Nairobi Events</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <Link href="/events" className="transition hover:text-slate-950">
            Events
          </Link>
          <Link href="/dashboard" className="transition hover:text-slate-950">
            Dashboard
          </Link>
          <Link href="/login" className="transition hover:text-slate-950">
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
