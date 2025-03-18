import mongoose, { Schema, Document, Model } from "mongoose";
import { ICategory } from "./categoryMongo"; 

export interface IProduct extends Document {
    _id: number;
    title: string;
    description: string;
    price: number;
    image: string;
    stock:number;
    category: ICategory["_id"];

}

const ProductSchema = new Schema<IProduct>(
    {
        _id: { type: Number, required: true },
        title: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: false },
        stock: { type: Number, required: true ,default:0},
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },

    },
    { timestamps: true }
);

let ProductModel: Model<IProduct>;

if (mongoose.models.Products) {
  ProductModel = mongoose.models.Products;
} else {
  ProductModel = mongoose.model<IProduct>("Products", ProductSchema);
}

export { ProductModel };
