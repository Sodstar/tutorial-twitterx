import { NextResponse } from "next/server";
import { getFilteredProducts } from "@/actions/product.action";

export async function GET(req: Request) {
  try {
    //URL query parameters are used to filter products
    const { searchParams } = new URL(req.url);
    const filters = {
      categorySlug: searchParams.get("category"),
      // brandSlug: searchParams.get("brand"),
      minPrice: searchParams.get("minPrice"),
      maxPrice: searchParams.get("maxPrice"),
      orderBy: searchParams.get("orderBy"),
    };

    const products = await getFilteredProducts(filters);
    
    return NextResponse.json({ success: true, data: products }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}