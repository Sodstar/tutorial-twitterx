"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "./ui/card";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const categories = ["electronics", "fashion", "books", "home"];

export default function ProductPrice() {
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const router = useRouter();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`/products?${params.toString()}`);
  };

  //Үүнийг бичиж өгөхгүй бол хуудас дахь үнэний мэдээллийг авахгүй
  useEffect(() => {
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    setMinPrice(minPrice || "");
    setMaxPrice(maxPrice || "");
  }, [searchParams]);

  const clearPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    router.push(`/products?${params.toString()}`);
  };
  return (
    <>
      {pathname === "/products" ? (
        <div className="top-20 mt-4">
          <Card>
            <CardHeader className="font-bold">Үнэ</CardHeader>
            <CardContent className="">
              <div className="flex flex-col gap-4">
                <Input
                  type="number"
                  placeholder="Доод үнэ"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="border  w-full"
                />
                <Input
                  type="number"
                  placeholder="Дээд үнэ"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="border  w-full"
                />
                <Button onClick={applyPriceFilter} className="  py-1">
                  Шүүх
                </Button>
                <Button
                  variant="outline"
                  onClick={clearPriceFilter}
                  className="py-1"
                >
                  Цэвэрлэх
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
