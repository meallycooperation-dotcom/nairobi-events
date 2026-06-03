import { supabase, isSupabaseEnabled } from "@/lib/supabase";

export type DashboardStats = {
  publishedEvents: number;
  liveOrders: number;
  activeTickets: number;
  totalPayments: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isSupabaseEnabled) {
    return {
      publishedEvents: 12,
      liveOrders: 42,
      activeTickets: 276,
      totalPayments: 28,
    };
  }

  const [publishedEventsResult, ordersResult, ticketsResult, paymentsResult] = await Promise.all([
    supabase.from("events").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("tickets").select("id", { count: "exact", head: true }),
    supabase.from("payments").select("id", { count: "exact", head: true }).eq("status", "success"),
  ]);

  return {
    publishedEvents: publishedEventsResult.count ?? 0,
    liveOrders: ordersResult.count ?? 0,
    activeTickets: ticketsResult.count ?? 0,
    totalPayments: paymentsResult.count ?? 0,
  };
}
