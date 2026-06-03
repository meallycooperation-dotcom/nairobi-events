import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="mx-auto min-h-screen max-w-6xl px-6 py-16 sm:px-10 lg:px-12">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Login</p>
          <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Sign in and manage your tickets.</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            Use your email and password to access your orders, event checkout, and organizer dashboard.
          </p>
        </div>
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
