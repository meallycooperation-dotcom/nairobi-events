import { NextResponse } from "next/server";

import { verifyPayment } from "@/backend/paystack/verify-payment";
import { supabaseAdmin } from "@/backend/config/supabase-admin";
import { generateTicket } from "@/backend/tickets/generate-ticket";

export async function POST(req: Request) {
  const body = await req.json();

  if (body.event !== "charge.success") {
    return NextResponse.json({ ignored: true });
  }

  const reference = body.data?.reference;
  if (!reference) {
    return NextResponse.json({ error: "Missing payment reference" });
  }

  const verification = await verifyPayment(reference);

  if (verification?.data?.status !== "success") {
    return NextResponse.json({ failed: true });
  }

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("payment_reference", reference)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found" });
  }

  const isProcessed = order.webhook_processed ?? false;
  if (isProcessed) {
    return NextResponse.json({ alreadyProcessed: true });
  }

  const quantity = order.payment_metadata?.quantity ?? 1;
  const ticketTypeId = order.payment_metadata?.ticketTypeId;
  const eventId = order.payment_metadata?.eventId;

  if (!ticketTypeId || !eventId) {
    return NextResponse.json({ error: "Missing order metadata" });
  }

  await supabaseAdmin
    .from("orders")
    .update({
      status: "paid",
      webhook_processed: true,
    })
    .eq("id", order.id);

  await supabaseAdmin.from("payments").insert({
    order_id: order.id,
    amount: verification.data.amount / 100,
    provider: "paystack",
    provider_reference: verification.data.reference,
    status: "success",
  });

  for (let i = 0; i < quantity; i += 1) {
    await generateTicket({
      ownerId: order.user_id,
      eventId,
      ticketTypeId,
      orderId: order.id,
    });
  }

  return NextResponse.json({ success: true });
}