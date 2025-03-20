import { NextRequest, NextResponse } from "next/server";
import { updateProduct, deleteProduct, getProductById } from "@/actions/product.action";

export async function GET(req: NextRequest, { params }: { params: { id: number } }) {
  try {
     const { id } = await params; 
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching product", error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params; 
    const updateData = await req.json();
    const updatedProduct = await updateProduct(id, updateData);

    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedProduct }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error updating product", error }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params; 
    const deletedProduct = await deleteProduct(id);
    if (!deletedProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error deleting product", error }, { status: 500 });
  }
}
