import { Schema, model } from "mongoose";
import { ObjectId } from "mongoose"; // Import ObjectId

interface Order {
  pharmacist_id: ObjectId;
  delivery_guy_id?: ObjectId | null; // Initially NULL
  status: "pending" | "approved" | "shipped" | "delivered";
  created_at: Date;
  total_price: number;
  // Add other order-specific fields as needed
}

const orderSchema = new Schema<Order>({
  pharmacist_id: {
    type: String,
    required: [true, "an order should have a unique id"],
  }, // Use imported ObjectId
  delivery_guy_id: { type: String, ref: "User" }, // Reference "User" collection (if applicable)
  status: {
    type: String,
    enum: ["pending", "approved", "shipped", "delivered"],
    required: [true, "the status should be seted up"],
  },
  created_at: { type: Date, default: Date.now },
  total_price: { type: Number, required: true },
  // Add other schema definitions for order fields
});

export const OrderModel = model<Order>("Order", orderSchema);
