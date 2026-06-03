import { supabaseAdmin } from "../config/supabase-admin";
import { generateTicketCode } from "../utils/generate-code";
import { generateQR } from "./generate-qr";

export async function generateTicket({
  ownerId,
  eventId,
  ticketTypeId,
  orderId,
}: {
  ownerId: string;
  eventId: string;
  ticketTypeId: string;
  orderId: string;
}) {
  const code = generateTicketCode();

  const qr = await generateQR(code);

  const { data, error } =
    await supabaseAdmin
      .from("tickets")
      .insert({
        owner_id: ownerId,
        event_id: eventId,
        ticket_type_id: ticketTypeId,
        order_id: orderId,
        ticket_code: code,
        qr_code_url: qr,
      })
      .select()
      .single();

  if (error) throw error;

  return data;
}