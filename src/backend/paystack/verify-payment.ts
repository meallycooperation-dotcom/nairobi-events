import { paystack } from "./paystack-client";

export async function verifyPayment(
  reference: string
) {
  const response = await paystack.get(
    `/transaction/verify/${reference}`
  );

  return response.data;
}