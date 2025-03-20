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
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from 'react'
import {IBrand}  from "@/models/brandMongo";
import { getAllBrands } from "@/actions/brand.action";

// const categories = ["electronics", "fashion", "books", "home"];

export default function ProductBrands() {
  const pathname = usePathname();
  const [brands, setBrands]=useState<IBrand[]>([]);
  
  useEffect(()=>{
    const fetchBrands = async () => {
      const res = await getAllBrands();
      setBrands(res);
    };
    fetchBrands();
  },[]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleBrandChange = (brand: string) => {
    const params = new URLSearchParams(searchParams.toString());
    console.log(typeof params)
    if (brand) {
      params.set("brand", brand);
    } else {
      params.delete("brand");
    }
    router.push(`/products?${params.toString()}`);
  };

  if (!brands) return <div>Уншиж байна...</div>

  return (
    <>
      {pathname === "/products" ? (
        <div className="top-20 mt-4">
          <Card>
            <CardHeader className="font-bold">Барааны бренд</CardHeader>
            <CardContent className="">
              <div className="flex flex-col">
                <ul className="space-y-2">
                  <li key={"all"}>
                    <button
                      className="hover:underline"
                      onClick={() => handleBrandChange("")}
                    >
                      Бүгд
                    </button>
                  </li>
                  {brands.map((brand) => (
                    <li key={brand.name}>
                      <button
                        className="hover:underline"
                        onClick={() => handleBrandChange(brand.slug)}
                      >
                        {brand.name}
                      </button>
                    </li>
                  ))}
                </ul>
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
