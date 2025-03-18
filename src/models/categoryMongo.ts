import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description: string;
  slug: string;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
}, { timestamps: true });

let CategoryModel: Model<ICategory>;

if (mongoose.models.Products) {
    CategoryModel = mongoose.models.Categories;
} else {
    CategoryModel = mongoose.model<ICategory>("Categories", CategorySchema);
}

export { CategoryModel };
