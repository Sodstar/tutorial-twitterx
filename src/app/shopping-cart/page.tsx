"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { getDBUserID } from "@/actions/user.action";
import { set } from "mongoose";
import { ShoppingCardSkeleton } from "@/components/ShoppingCardSkeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getQPayInvoice, checkPayment } from "@/actions/payment.action";
import toast from "react-hot-toast";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";

interface invoiceId {
  invoice_id: string;
}
const CartPage = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } =
    useCartStore();
  const [userId, setUserId] = useState<string | null>("");

  const [paymentMethod, showPaymentMethod] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const [qpayImage, setQpayImage] = useState("");
  // const [invoice, setInvoice] = useState<invoiceId>({ invoice_id: "" });
  const [invoice, setInvoice] = useState<string>();
  const router = useRouter();
  const createInvoice = async () => {
    if (qpayImage == "") {
      const qpay = await getQPayInvoice(total);
      const q = qpay.data.qr_image;
      const dataURL = `data:image/png;base64,${q}`;
      setInvoice(qpay.data.invoice_id);
      setQpayImage(dataURL);
    }
  };

  const checkPaymentInvoice = async () => {
    if (!invoice) {
      console.error("Invoice ID is null");
      return;
    }
    setCheckingPayment(true);
    try {
      const qpay = await checkPayment(invoice);
      const paymentStatus = qpay.data.qpayResponse.status;
      if (paymentStatus == 200) {
        toast.success("Төлбөр амжилттай төлөгдлөө");
        clearCart();
        router.push("/");
      } else toast.error("Төлбөр хүлээгдэж байна");

      console.log(qpay);
    } catch (error) {
      console.log(error);
    }
    setCheckingPayment(false);
  };

  useEffect(() => {
    const totalPrice = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setTotal(totalPrice);
    const fetchUser = async () => {
      const user = await getDBUserID();
      setUserId(user);
    };
    fetchUser();
  }, [userId]);

  if (!userId) return <ShoppingCardSkeleton />;

  if (cart.length === 0) return <p>Сагс хоосон байна.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">🛒 Миний сагс</h2>
      {cart.map((item) => (
        <div
          key={item._id}
          className="flex justify-between items-center border-b py-4"
        >
          <div>
            <img
              src={item.image}
              alt="item.title"
              className="w-16 h-16 object-cover rounded-lg"
            />
          </div>
          <div>
            <h3 className="text-lg">{item.title}</h3>
            <p>Үнэ: {item.price} ₮</p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
              className="border p-1 w-12 text-center"
            />
            <Button variant="outline" onClick={() => removeFromCart(item._id)}>
              ❌
            </Button>
          </div>
        </div>
      ))}
      <div className="flex justify-between">
        <Button className="mt-4" onClick={clearCart} variant={"destructive"}>
          Сагс хоослох
        </Button>
        <Button
          className="mt-4"
          onClick={() => {
            showPaymentMethod(true);
            createInvoice();
          }}
        >
          Төлбөр төлөх
        </Button>

        {paymentMethod && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="relative w-3/4  md:w-1/4">
              <Card>
                <CardHeader>
                  <div className="text-lg justify-center items-center  font-semibold">
                    Төлбөр төлөх
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col w-full items-center justify-center">
                    {!qpayImage ? (
                      <div>Loading</div>
                    ) : (
                      <img
                        src={decodeURIComponent(qpayImage)}
                        className="w-full"
                      />
                    )}
                    <Button
                      onClick={checkPaymentInvoice}
                      disabled={checkingPayment}
                    >
                      Төлбөр шалгах
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <button
                className="absolute top-4 right-2 bg-red-600 text-white px-4 py-2 rounded-full"
                onClick={() => {
                  showPaymentMethod(false);
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
