"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (isMounted) {
        setIsAuthenticated(!!data.session);
      }
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setIsAuthenticated(!!session);
      }
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe?.();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/nairobi events logo 2.jpg"
            alt="Nairobi Events"
            width={140}
            height={40}
            className="h-[40px] w-auto object-contain"
          />
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-full border border-slate-300 p-2 text-slate-700 transition hover:border-slate-400 hover:text-slate-950 md:hidden"
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <>
                <path d="M3 12h18" />
                <path d="M3 6h18" />
                <path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>

        <nav className="hidden items-center gap-4 text-sm font-medium text-slate-700 md:flex">
          <Link href="/events" className="transition hover:text-slate-950">
            Events
          </Link>
          <Link href="/profile" className="transition hover:text-slate-950">
            Profile
          </Link>
          <Link href="/post-event" className="rounded-full bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700">
            Post event
          </Link>
          {!isAuthenticated ? (
            <Link href="/login" className="rounded-full border border-slate-300 px-4 py-2 transition hover:border-slate-400 hover:bg-slate-50">
              Login
            </Link>
          ) : null}
        </nav>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white/95 p-4 backdrop-blur-xl md:hidden">
          <div className="space-y-3">
            <Link href="/events" onClick={() => setMobileOpen(false)} className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100">
              Events
            </Link>
            <Link href="/profile" onClick={() => setMobileOpen(false)} className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100">
              Profile
            </Link>
            <Link href="/post-event" onClick={() => setMobileOpen(false)} className="block rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
              Post event
            </Link>
            {!isAuthenticated ? (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                Login
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
