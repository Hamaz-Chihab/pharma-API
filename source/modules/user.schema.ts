import mongoose, { Schema, model, Document } from "mongoose";
import validator from "validator";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";

// Define the User schema
export interface User extends Document {
  changePasswordAfter(JWTTimestamp: number): boolean;
  isCorrectPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  creatPasswordResetToken(): Promise<string>; // Define it as a function

  username: string;
  email: string;
  photo?: string; // Make photo optional
  password: string; // Hashed for security
  passwordConfirm: string;
  role: "pharmacy_staff" | "admin";
  orders: mongoose.Types.ObjectId[]; // Reference to Order documents
  passwordChangedAt: Date;
  passwordResetToken: String;
  passwordRestExpires: Date | null;
  active: boolean;
  [key: string]: any;
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
    password: { type: String, required: true, minlength: 8, select: false }, //select : false <=> never showup in any output
    passwordConfirm: {
      type: String,
      required: [false, "Please confirm your password"],
      validate: {
        validator: function (this: User, el: string): boolean {
          // Compare with the actual password value (e.g., req.body.password)
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    role: {
      type: String,
      enum: ["pharmacy_staff", "admin", "visitor"],
      required: true,
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    passwordChangedAt: {
      type: Date,
      required: false,
    },
    passwordResetToken: { type: String, required: false },
    passwordRestExpires: {
      type: Date,
      required: false,
    },
    active: {
      type: Boolean,
      required: false,
      default: true,
      select: true,
    },
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
  if (this.isModified("password")) {
    // Hash the password
    const saltRounds = 10; // Adjust this value as needed for security
    this.password = await bcrypt.hash(this.password, saltRounds);
    this.passwordConfirm = "";
    next();
  } else {
    return next();
  }
  // this.password = await bcrypt.hash(this.password, 12);
  //delete the passwordConfirm field :
});
userSchema.pre("save", async function (this: User, next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000); //la creation te3 token tedi 1sec = 1000  ms
  next();
});
userSchema.methods.changePasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changeTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changeTimestamp;
  }
  return false;
};
//middleware function that runs before any query that starts with the find operation (e.g., find(), findOne(), findById()):
userSchema.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } }); //!= this.find({ active: true })
  next();
});
//instance methode that return true or false  :
userSchema.methods.isCorrectPassword = async function (
  condidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(condidatePassword, userPassword);
};
userSchema.methods.creatPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  // Hash the reset token using bcrypt:
  // const saltRounds = 10; // Adjust this value as needed for security
  // const salt = await bcrypt.genSalt(saltRounds); // Generate random salt (uncommented)
  // const hashedToken = await bcrypt.hash(resetToken, salt);
  // Hash the reset token using SHA256:

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log("this is reseteToken without hashing :" + resetToken);
  // console.log("this is the resetToken password (hashed) :👽👽 " + hashedToken);
  this.passwordResetToken = hashedToken;
  this.passwordRestExpires = Date.now() + 10 * 60 * 1000;

  // console.log("this is the end of creatPasswordResetToken middleware !!");
  return resetToken;
};
export const UserModel = mongoose.model<User>("User", userSchema);
