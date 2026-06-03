import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/backend/config/supabase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      eventTitle,
      description,
      category,
      venue,
      location,
      date,
      time,
      posterUrl,
      organizerName,
      phoneNumber,
      emailAddress,
      ticketTypes,
      notes,
    } = body;

    if (!organizerName || !phoneNumber || !emailAddress || !eventTitle) {
      return NextResponse.json(
        { error: "Missing required event submission fields." },
        { status: 400 }
      );
    }

    const eventDate = date && time ? new Date(`${date}T${time}`).toISOString() : null;

    const { data, error } = await supabaseAdmin
      .from("event_submissions")
      .insert({
        organizer_name: organizerName,
        organizer_phone: phoneNumber,
        organizer_email: emailAddress,
        title: eventTitle,
        description,
        category,
        venue,
        location,
        event_date: eventDate,
        poster_url: posterUrl,
        ticket_data: ticketTypes,
        notes,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, submission: data }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to submit event.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
