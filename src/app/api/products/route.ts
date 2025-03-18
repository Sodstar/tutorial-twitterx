import { NextResponse } from "next/server";
import { getCachedProducts, createProduct } from "@/actions/product.action";

export async function GET() {
  try {
    const products = await getCachedProducts();
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error  }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, price, description } = await req.json();
    const newProduct = await createProduct(name, price, description);
    
    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}