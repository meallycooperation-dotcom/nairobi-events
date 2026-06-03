import { paystack } from "./paystack-client";

export async function initializePayment(
  email: string,
  amount: number,
  reference: string
) {
  const response = await paystack.post(
    "/transaction/initialize",
    {
      email,
      amount: amount * 100,
      reference,
    }
  );

  return response.data;
}