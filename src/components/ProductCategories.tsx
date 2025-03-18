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
import { usePathname } from "next/navigation";

export default function ProductCategories() {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/products" ? (
        <div className="sticky top-20 mt-4">
          <Card>
            <CardHeader>Барааны ангилал</CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center"></div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
