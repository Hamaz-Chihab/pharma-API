import mongoose, { Schema, model, Document } from "mongoose";
import validator from "validator";

// Define the User schema
interface User extends Document {
  username: string;
  email: string;
  photo?: string; // Make photo optional
  password: string; // Hashed for security
  passwordConfirm: string;
  role: "pharmacy_staff" | "admin";
  orders: mongoose.Types.ObjectId[]; // Reference to Order documents
}

const userSchema = new Schema<User>({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: { type: String }, // Optional photo field
  password: { type: String, required: true, minlength: 8 },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
  },
  role: {
    type: String,
    enum: ["pharmacy_staff", "admin"],
    required: true,
  },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});

export const UserModel = model<User>("User", userSchema);
