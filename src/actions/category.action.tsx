"use server";

import { connectDB } from "@/lib/mongoose";
import CategoryModel  from "@/models/categoryMongo";
import { revalidatePath, unstable_cache } from "next/cache";
import { logger } from "@/lib/logger";

export const getCachedCategories = unstable_cache(
  async (limit:number) => {
    try {
      await connectDB();
      const categories = await CategoryModel.find({}).limit(limit);
      return JSON.parse(JSON.stringify(categories));
    } catch (error) {
      logger.error("Error fetching categories: s", error);
      throw new Error("Failed to fetch categories");
    }
  },
  ["products"],
  { revalidate: 1 }
);

export async function getAllCategories() {
    try {
      await connectDB();
      const category = await CategoryModel.find({});
      if (!category) throw new Error("category not found");
      return JSON.parse(JSON.stringify(category));
    } catch (error) {
      logger.error(`Error fetching all categories:`, error);
      throw new Error("Failed to fetch category"+error);
    }
  }

export async function getCategoryById(categoryId: Number) {
  try {
    await connectDB();
    const category = await CategoryModel.findById(categoryId);
    if (!category) throw new Error("category not found");
    return category;
  } catch (error) {
    logger.error(`Error fetching category ID ${categoryId}:`, error);
    throw new Error("Failed to fetch category");
  }
}

export async function checkExistingCategory(name: string) {
  try {
    await connectDB();
    return await CategoryModel.findOne({ name });
  } catch (error) {
    logger.error(`Error checking existing category ${name}:`, error);
    throw new Error("Failed to check category existence");
  }
}

export async function createCategory(
  name: string,
  description: string,
  slug: string
) {
  try {
    await connectDB();

    const existingCategory = await checkExistingCategory(name);
    if (existingCategory) throw new Error("Category already exists");

    const newCategory = new CategoryModel({ name, description, slug });
    await newCategory.save();


    logger.info(`Category created: ${name}`);
    return newCategory;
  } catch (error) {
    logger.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
}

export async function updateProduct(
    _id: Number,
  updateData: Partial<{ name: string; string: number; slug: string }>
) {
  try {
    await connectDB();
    const categoryUpdate = await CategoryModel.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );

    if (!categoryUpdate) throw new Error("Category not found");

    // Revalidate cache
    // revalidatePath("/products");

    logger.info(`Category updated: ${_id}`);
    return categoryUpdate;
  } catch (error) {
    logger.error(`Error updating category ID ${_id}:`, error);
    throw new Error("Failed to update category");
  }
}

export async function deleteProduct(categoryId: string) {
  try {
    await connectDB();
    const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);

    if (!deletedCategory) throw new Error("Product not found");

    // revalidatePath("/products");

    logger.info(`Category deleted: ${categoryId}`);
    return deletedCategory;
  } catch (error) {
    logger.error(`Error deleting category ID ${categoryId}:`, error);
    throw new Error("Failed to delete category");
  }
}
