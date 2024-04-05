import { Schema, model } from "mongoose";

interface Product {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageCover: string;
  images: [string];
  createdAt: Date;
  category?: string; // Optional
  brand: string;
  activeIngredients: string[];
  dosage?: string;
  promotions?: Promotion[];
}

interface Promotion {
  type: string; // e.g., "discount", "bundle"
  value: number | string; // Discount percentage or bundle details
  startDate: Date;
  endDate: Date;
}

const PromotionSchema = new Schema<Promotion>({
  type: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true }, // Allow for numbers or descriptive text
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const productSchema = new Schema<Product>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stockQuantity: { type: Number, required: true, min: 0 },
  imageCover: {
    type: String,
    required: [true, "a product must have an image cover"],
    validate: (val: string) => val.startsWith("http"),
  },
  createdAt: { type: Date, default: Date.now() },
  category: { type: String },
  brand: { type: String, required: true, trim: true }, //trim is to delete the space in the begining
  activeIngredients: [{ type: String, required: true }],
  dosage: String,
  promotions: [PromotionSchema],
});

productSchema.pre("save", async function (next) {
  // Perform any actions before saving the document
  // For example, you could normalize images URLs or create unique slugs based on the name
  next();
});

export const ProductModel = model<Product>("Product", productSchema);
