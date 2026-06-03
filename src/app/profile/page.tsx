"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProfileForCurrentUser } from "@/services/profile";
import { formatDate } from "@/lib/utils";
import { Profile } from "@/types";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const profileData = await getProfileForCurrentUser();
      if (!profileData) {
        setError("No profile found. Please log in or sign up first.");
      } else {
        setProfile(profileData);
      }
      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleLogout = async () => {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
      return;
    }
    setIsLoggedOut(true);
    router.push("/");
  };

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">My profile</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Your account details</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Manage your profile, view ticket activity, and access events once you are signed in.
        </p>
      </div>

      {loading ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-slate-700 shadow-sm">
          Loading profile...
        </div>
      ) : error ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-slate-700 shadow-sm">
          <p className="text-lg font-semibold text-slate-950">{error}</p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Link href="/login" className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Login
            </Link>
            <Link href="/signup" className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Sign up
            </Link>
          </div>
        </div>
      ) : profile ? (
        <>
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-8 space-y-3">
                <h2 className="text-xl font-semibold text-slate-950">Account overview</h2>
                <p className="text-sm text-slate-600">Profile details stored in the Supabase profiles table.</p>
              </div>
              <dl className="grid gap-5 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-slate-500">Full name</dt>
                  <dd className="mt-2 text-slate-950">{profile.full_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Role</dt>
                  <dd className="mt-2 rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900">{profile.role}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Phone</dt>
                  <dd className="mt-2 text-slate-950">{profile.phone ?? "Not set"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Joined</dt>
                  <dd className="mt-2 text-slate-950">{formatDate(profile.created_at)}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">Quick actions</h2>
              <div className="mt-6 space-y-4">
                <Link href="/events" className="block rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                  Browse more events
                </Link>
                <Link href="/checkout" className="block rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                  Continue to checkout
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-2xl bg-red-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
}
