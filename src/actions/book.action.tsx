"use server";
import React from "react";
import axios from "axios";
//ExpressJS Backend-ээс өгөгдөл авах жишээ код
export async function getAllBooks() {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/books`);
    const result = res.data;
    return result;
  } catch (error) {
    console.log(error + "Failed to fetch book");
    return { data: [] };
  }
}

export async function getBookById(id: number) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/books/${id}`
    );
    const result = res.data;
    return result;
  } catch (error) {
    return { success: false, error: "Failed to fetch book" };
  }
}
