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
import CategoryModel,{ICategory}  from "@/models/categoryMongo";
import { getAllCategories, getCachedCategories } from "@/actions/category.action";

// const categories = ["electronics", "fashion", "books", "home"];

export default function ProductCategories() {
  const pathname = usePathname();

  const [categories, setCategories]=useState<ICategory[]>([]);
  
  useEffect(()=>{
    const fetchCategories = async () => {
      const res = await getCachedCategories(10);
      setCategories(res);
    };
    fetchCategories();
  },[]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    console.log(typeof params)
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`/products?${params.toString()}`);
  };

  if (!categories) return <div>Уншиж байна...</div>

  return (
    <>
      {pathname === "/products" ? (
        <div className="top-20 mt-4">
          <Card>
            <CardHeader className="font-bold">Барааны ангилал</CardHeader>
            <CardContent className="">
              <div className="flex flex-col">
                <ul className="space-y-2">
                  <li key={"all"}>
                    <button
                      className="hover:underline"
                      onClick={() => handleCategoryChange("")}
                    >
                      Бүгд
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.name}>
                      <button
                        className="hover:underline"
                        onClick={() => handleCategoryChange(cat.slug)}
                      >
                        {cat.name}
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
