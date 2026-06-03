import { NextResponse } from "next/server";

import { initializePayment } from "@/backend/paystack/initialize-payment";

export async function POST(
  req: Request
) {
  const body = await req.json();

  const result =
    await initializePayment(
      body.email,
      body.amount,
      body.reference
    );

  return NextResponse.json(result);
}