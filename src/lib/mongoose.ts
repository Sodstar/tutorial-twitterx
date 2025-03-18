import mongoose from "mongoose";
import { logger } from "@/lib/logger"; // Assuming logger.ts is located in lib

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) {
    logger.info("MongoDB Connection (cached)");
    return cached.conn; 
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "ecommerce"
    })
      .then((mongooseInstance) => {
        cached.conn = mongooseInstance;
        logger.info("MongoDB Connected");
        return cached.conn;
      })
      .catch((error) => {
        logger.error(`MongoDB Connection Error: ${error.message}`);
        throw new Error(`MongoDB Connection Error: ${error.message}`); 
      });
  }

  try {
    return await cached.promise;
  } catch (error) {
    logger.error(`Error establishing MongoDB connection: ${error}`);
    throw new Error(`Error establishing MongoDB connection: ${error}`);
  }
}