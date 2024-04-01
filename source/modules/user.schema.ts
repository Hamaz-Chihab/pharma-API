import { Schema, model } from "mongoose";
import { ObjectId } from "mongoose"; // For foreign key reference (if needed)

interface User {
  name: string;
  email: string;
  password: string; // Hashed for security
  role: "pharmacy_staff" | "admin";
}

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["pharmacy_staff", "admin"], required: true },
  // Add other schema definitions for user fields
});

export const UserModel = model<User>("User", userSchema);
