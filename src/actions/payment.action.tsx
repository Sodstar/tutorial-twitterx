"use server";

import axios from "axios";
import { logger } from "@/lib/logger";

export async function getQPayInvoice(amount: number) {
  try {
    const data = {
      userId: "100",
      userRole: "customer",
      invoice_code: "NEST_EDTECH_INVOICE",
      sender_invoice_no: "12345678911",
      description: "Онлайн бараа К-1",
      invoice_receiver_code: "terminal",
      amount: amount,
      callback_url: "https://nestmoodle.com/callback/index.php",
    };
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment`,
      data
    );

    const result = res.data;
    console.log(res.data);
    return result;
  } catch (error) {
    logger.error(error);
    console.log(error + "Failed to fetch invoice");
    return { data: [] };
  }
}

export async function checkPayment(id: string) {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/check/${id}`,
      );
      const result = res.data;
      return result;
    } catch (error) {
      logger.error(error);
      console.log(error + "Failed to check invoice");
      return { data: [] };
    }
  }