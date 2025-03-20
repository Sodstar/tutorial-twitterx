"use client";

import React, { useState, useEffect } from "react";
import { getProfileByUsername } from "@/actions/profile.action";
import { IProduct } from "@/models/productMongo";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore"; // Import Zustand store

type productType = IProduct;
type User = Awaited<ReturnType<typeof getProfileByUsername>>;

interface ProductPageClientProps {
  product: NonNullable<IProduct>;
}

function ProductPageClient({ product }: ProductPageClientProps) {
  const { user: currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = async () => {
    addToCart({
      _id: product._id,
      title: product.title,
      price: product.price,
      quantity: product.stock,
      image: product.image,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">{product.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {product.image ? (
            <img
              src={product.image}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          ) : (
            <img
              src="https://via.placeholder.com/500"
              alt="Product Image"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          )}
        </div>

        <div className="flex flex-col justify-start">
          <h2 className="text-2xl font-semibold mb-2">Барааны танилцуулга</h2>

          <div className="flex items-center mb-4">
            <svg
              className="w-4 h-4 text-yellow-300 ms-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="w-4 h-4 text-yellow-300 ms-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="w-4 h-4 text-yellow-300 ms-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="w-4 h-4 text-yellow-300 ms-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="w-4 h-4 ms-1 text-gray-300 dark:text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
          </div>

          <p className="text-lg mb-4">{product.description}</p>

          <div className="mb-4">
            <span className="text-xl font-bold">Үнэ:</span>
            <span className="text-xl ml-2">{product.price}₮</span>
          </div>

          <Button
            className=" py-2 px-4 rounded-md transition"
            onClick={handleAddToCart}
          >
            Сагсанд хийх
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductPageClient;
