import { supabaseAdmin } from "../config/supabase-admin";
import { generateReference } from "../utils/generate-reference";

export async function createOrder({
  userId,
  amount,
  metadata,
}: {
  userId: string;
  amount: number;
  metadata: any;
}) {
  const paymentReference = generateReference();

  const { data, error } =
    await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        total_amount: amount,
        payment_reference: paymentReference,
        payment_metadata: metadata,
        status: "pending",
      })
      .select()
      .single();

  if (error) throw error;

  return data;
}