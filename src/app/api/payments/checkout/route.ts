import { NextResponse } from "next/server";

import { createOrder } from "@/backend/tickets/create-order";
import { initializePayment } from "@/backend/paystack/initialize-payment";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const amount = Number(body.amount ?? 0);
    const email = body.userEmail || body.email;

    if (!body.userId || !email || !body.eventId || !body.ticketTypeId || !body.quantity) {
      return NextResponse.json({ message: "Missing required checkout data." }, { status: 400 });
    }

    const order = await createOrder({
      userId: body.userId,
      amount,
      metadata: {
        eventId: body.eventId,
        ticketTypeId: body.ticketTypeId,
        quantity: body.quantity,
      },
    });

    const payment = await initializePayment(email, amount, order.payment_reference);

    return NextResponse.json({
      paymentUrl: payment.data.authorization_url,
      order,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to create checkout session.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
