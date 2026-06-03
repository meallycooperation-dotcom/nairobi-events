"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        if (data?.user?.id) {
          const { error: profileError } = await supabase.from("profiles").insert({
            id: data.user.id,
            full_name: fullName,
          });

          setMessage(
            profileError?.message ?? "Check your inbox for the confirmation email."
          );
        } else {
          setMessage("Check your inbox for the confirmation email.");
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setMessage(error?.message ?? "Logged in successfully.");
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 backdrop-blur-sm">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-slate-950">{mode === "signup" ? "Create an account" : "Welcome back"}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {mode === "signup"
            ? "Register to buy tickets and manage your events."
            : "Sign in to access your tickets, checkout, and dashboard."}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {mode === "signup" && (
          <label className="block text-sm font-medium text-slate-700">
            Full name
            <input
              required
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-600"
              placeholder="Jane Doe"
            />
          </label>
        )}
        <label className="block text-sm font-medium text-slate-700">
          Email address
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-600"
            placeholder="you@example.com"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-600"
            placeholder="Enter secure password"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Processing..." : mode === "signup" ? "Sign up" : "Sign in"}
        </button>
      </form>
      {message ? <p className="mt-4 text-center text-sm text-slate-700">{message}</p> : null}
      <p className="mt-6 text-center text-sm text-slate-600">
        {mode === "signup" ? (
          <>Already have an account? <Link href="/login" className="font-semibold text-slate-950">Sign in</Link></>
        ) : (
          <>New to Nairobi Events? <Link href="/signup" className="font-semibold text-slate-950">Create account</Link></>
        )}
      </p>
    </div>
  );
}
