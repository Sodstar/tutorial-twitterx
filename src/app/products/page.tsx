"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Assuming you have shadcn components
import {
  getCachedProducts,
  getFilteredProducts,
} from "@/actions/product.action";
import toast from "react-hot-toast";
import { IProduct } from "@/models/productMongo";
import { ProductSkeleton } from "@/components/ProductSkeleton";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
// type Products = Awaited<ReturnType<typeof getCachedProducts>>;
import { useCartStore } from "@/store/cartStore"; // Import Zustand store

const page = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const addToCart = useCartStore((state) => state.addToCart);
  const { cart } = useCartStore();
  const getFiltersFromURL = () => ({
    category: searchParams.get("category") || [],
    brand: searchParams.get("brand") || [],
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    orderBy: searchParams.get("sort") || "",
  });

  
  const [filters, setFilters] = useState(getFiltersFromURL());
  
  useEffect(() => {
    setFilters(getFiltersFromURL());
    console.log(filters)
  }, [searchParams]);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await getFilteredProducts(filters);
        console.log(data);
        if (typeof data === "string") {
          setProducts(JSON.parse(data));
          console.log(JSON.parse(data));
        } else {
          setProducts(data);
        }
      } catch (error) {
        toast.error("Failed to fetch notifications" + error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [filters]);

  if (isLoading) return <ProductSkeleton />;
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {products.map((product) => (
          <Card
            key={product._id}
            className="border rounded-lg shadow-lg overflow-hidden"
          >
            <CardContent>
              <img
                src={product.image || "https://via.placeholder.com/300"}
                alt={product.title}
                className="w-full h-80 object-cover rounded-t-lg"
              />
            </CardContent>
            <CardFooter className="flex flex-col p-2 space-y-2">
              <a href={`products/${product._id}`}>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-300">
                  {product.title}
                </CardTitle>
              </a>
              <CardDescription className="text-gray-600  dark:text-gray-300 text-sm">
                {product.description}
              </CardDescription>
              <div className="flex justify-between items-center w-full px-5 py-4">
                <div>
                  <span className="text-lg font-bold">
                    {product?.price || "Үнэ бичигдээгүй байна"} ₮
                  </span>
                </div>
                <div>
                  {product?.stock > 0 ? (
                    <>
                      <Button
                        onClick={() => {
                          addToCart({
                            _id: product._id,
                            title: product.title,
                            price: product.price,
                            quantity: product.stock,
                            image: product.image,
                          });
                        }}
                      >
                        Сагсанд нэмэх
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant={"outline"} disabled={true}>
                        Дууссан
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default page;
