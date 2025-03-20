"use client";

import React from "react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();

  if (cart.length === 0) return <p>Сагс хоосон байна.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">🛒 Миний сагс</h2>
      {cart.map((item) => (
        <div key={item._id} className="flex justify-between items-center border-b py-4">
            <div>
                <img src={item.image} alt="item.title" className="w-16 h-16 object-cover rounded-lg"/>
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
            <Button variant="outline" onClick={() => removeFromCart(item._id)}>❌</Button>
          </div>
        </div>
      ))}
      <Button className="mt-4" onClick={clearCart}>Сагс хоослох</Button>
    </div>
  );
};

export default CartPage;