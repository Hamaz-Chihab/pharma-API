import mongoose, { Schema, model, Document } from "mongoose";
import validator from "validator";
import * as bcrypt from "bcrypt";
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

const userSchema = new Schema<User>(
  {
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
      validate: {
        //excute only in the create user and save user methode
        validator: function (this: User, el: string): boolean {
          // this works only on SAVE
          return el === this.password;
        },
        message: "Passwords are not the same!", // Optional custom error message
      },
    },
    role: {
      type: String,
      enum: ["pharmacy_staff", "admin"],
      required: false,
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  {
    versionKey: false, // This line disables the __v field
    toJSON: { virtuals: true }, //to make the virtual properties apeare in the json format sorted from the dataBase
    toObject: { virtuals: true },
  }
);
//document middleware :it runs befor .save() and .create()
userSchema.pre("save", async function (this: User, next) {
  //only when the password is modified
  // if (this.isModified("password")) return next();
  //Hash the password
  this.password = await bcrypt.hash(this.password, 12);
  //delete the passwordConfirm field
  this.passwordConfirm = "";
  next();
});

export const UserModel = model<User>("User", userSchema);
