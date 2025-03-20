"use client";

import React from "react";
import { useCartStore } from "@/store/cartStore"; // Import Zustand store
import { Card, CardContent, CardHeader } from "./ui/card";
import { usePathname } from "next/navigation";
import { Link, ShoppingCart } from "lucide-react";

export default function SidebarShoppingCart() {
  const pathname = usePathname();

  const { cart } = useCartStore();
  if (cart?.length < 1) return <div></div>;

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
      <a href="/shopping-cart">
        <div className="relative group mb-6">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <button className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600">
            <span className="flex items-center space-x-5">
              <span className="pr-6 text-gray-100 flex col-row items-center justify-center">
             <ShoppingCart  />
             <div className="ml-2 text-3xl "> {cart.length} </div>
              </span>
            </span>
            <span className="pl-6 text-white group-hover:text-gray-300 transition duration-200">
              Нийт үнэ: { " "}
              {
                totalPrice
              }₮
            </span>
          </button>
        </div>
      </a>
    </div>
  );
}
