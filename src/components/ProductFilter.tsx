"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "./ui/card";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ProductFilter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSortChange = (sortType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortType) {
      params.set("sort", sortType);
    } else {
      params.delete("sort");
    }
    router.push(`/products?${params.toString()}`);
  };
  return (
    <>
      {pathname === "/products" ? (
        <div className="sticky top-20 mt-4">
          <Card>
            <CardHeader className="font-bold">Барааны эрэмбэ</CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <select
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border p-2 w-full"
                >
                  <option value="">Цэвэрлэх</option>
                  <option value="title_asc">Гарчиг (А-Я)</option>
                  <option value="title_desc">Гарчиг (Я-А)</option>
                  <option value="price_asc">Үнэ (өсөхөөр)</option>
                  <option value="price_desc">Үнэ (буурах)</option>
                </select>
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
