import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Ticket verification endpoint not implemented." },
    { status: 501 }
  );
}

export async function POST(req: Request) {
  return NextResponse.json(
    { error: "Ticket verification endpoint not implemented." },
    { status: 501 }
  );
}
