"use server";

import { connectDB } from "@/lib/mongoose";
import BrandModel from "@/models/brandMongo";
import { revalidatePath, unstable_cache } from "next/cache";
import { logger } from "@/lib/logger";

export async function getAllBrands() {
  try {
    await connectDB();
    const brands = await BrandModel.find({});
    if (!brands) throw new Error("brand not found");
    return JSON.parse(JSON.stringify(brands));
  } catch (error) {
    logger.error(`Error fetching all brands:`, error);
    throw new Error("Failed to fetch brands" + error);
  }
}
