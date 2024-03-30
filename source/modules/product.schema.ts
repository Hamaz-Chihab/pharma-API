import { Schema, model } from "mongoose";

interface Product {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  category?: string; // Optional
  // Add other product-specific fields as needed
}

const productSchema = new Schema<Product>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock_quantity: { type: Number, required: true },
  image_url: { type: String, required: true },
  category: { type: String },
  // Add other schema definitions for product fields
});

export const ProductModel = model<Product>("Product", productSchema);
