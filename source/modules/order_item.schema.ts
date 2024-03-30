import { Schema, model } from "mongoose";
import { ObjectId } from "mongoose"; // For foreign key references
import mongoose from "mongoose";
interface OrderItem {
  order_id: ObjectId;
  product_id: ObjectId;
  quantity: number;
  // Add other order item-specific fields as needed
}

const orderItemSchema = new Schema<OrderItem>({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  quantity: { type: Number, required: true },
  // Add other schema definitions for order item fields
});

export const OrderItemModel = model<OrderItem>("OrderItem", orderItemSchema);
