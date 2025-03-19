"use server";

import { connectDB } from "@/lib/mongoose";
import { ProductModel } from "@/models/productMongo";
import { revalidatePath, unstable_cache } from "next/cache";
import { logger } from "@/lib/logger";

export const getCachedProducts = unstable_cache(
  async (limit:number) => {
    try {
      await connectDB();
      const products = await ProductModel.find({}).limit(limit);
      return products;
    } catch (error) {
      logger.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
  },
  ["products"],
  { revalidate: 1 }
);

export async function getProductById(productId: Number) {
  try {
    await connectDB();
    const product = await ProductModel.findById(productId);
    if (!product) throw new Error("Product not found");
    return product;
  } catch (error) {
    logger.error(`Error fetching product ID ${productId}:`, error);
    throw new Error("Failed to fetch product");
  }
}

export async function checkExistingProduct(name: string) {
  try {
    await connectDB();
    return await ProductModel.findOne({ name });
  } catch (error) {
    logger.error(`Error checking existing product ${name}:`, error);
    throw new Error("Failed to check product existence");
  }
}

export async function createProduct(
  name: string,
  price: number,
  description: string
) {
  try {
    await connectDB();

    const existingProduct = await checkExistingProduct(name);
    if (existingProduct) throw new Error("Product already exists");

    const newProduct = new ProductModel({ name, price, description });
    await newProduct.save();

    revalidatePath("/products");

    logger.info(`Product created: ${name}`);
    return newProduct;
  } catch (error) {
    logger.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
}

export async function updateProduct(
  productId: string,
  updateData: Partial<{ name: string; price: number; description: string }>
) {
  try {
    await connectDB();
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    if (!updatedProduct) throw new Error("Product not found");

    // Revalidate cache
    revalidatePath("/products");

    logger.info(`Product updated: ${productId}`);
    return updatedProduct;
  } catch (error) {
    logger.error(`Error updating product ID ${productId}:`, error);
    throw new Error("Failed to update product");
  }
}

export async function deleteProduct(productId: string) {
  try {
    await connectDB();
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct) throw new Error("Product not found");

    revalidatePath("/products");

    logger.info(`Product deleted: ${productId}`);
    return deletedProduct;
  } catch (error) {
    logger.error(`Error deleting product ID ${productId}:`, error);
    throw new Error("Failed to delete product");
  }
}
