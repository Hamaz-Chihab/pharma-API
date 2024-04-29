import { Schema, model } from "mongoose";
import slugify from "slugify";
import mongoose from "mongoose";
import validator from "validator";
// Define the exported Product interface
export interface Product {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageCover: string;
  images: [string];
  createdAt: Date;
  expiryDate: Date;
  category?: string; // Optional
  brand: string;
  activeIngredients: string[];
  dosage?: string;
  promotions?: Promotion[];
}
const brandValidator = {
  validator: function (value: string) {
    // Custom validation logic: Allow only letters and spaces
    return /^[A-Za-z\s]+$/.test(value);
  },
  message: "Brand should contain only characters and spaces",
};
// Define the exported Promotion interface
export interface Promotion {
  type: string; // e.g., "discount", "bundle"
  value: number | string; // Discount percentage or bundle details
  startDate: Date;
  endDate: Date;
}

// Define the Promotion schema
const PromotionSchema = new Schema<Promotion>({
  type: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true }, // Allow for numbers or descriptive text
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

// Define the Product schema
const productSchema = new Schema<Product>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: [40, "the max length is 40"],
    },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stockQuantity: { type: Number, required: true, min: 0 },
    imageCover: {
      type: String,
      required: [true, "a product must have an image cover"],
      validate: (val: string) => val.startsWith("http"),
    },
    createdAt: { type: Date, default: Date.now() },
    expiryDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value: Date) {
          // Custom validation logic: Check if expiryDate is in the future
          return value >= new Date();
        },
        message: "Expiry date must be in the future",
      },
    },
    category: { type: String },
    brand: {
      type: String,
      required: true,
      trim: true,
      validate: brandValidator,
    }, //trim is to delete the space in the beginning
    activeIngredients: [{ type: String, required: true }],
    dosage: String,
    promotions: [PromotionSchema],
  },
  {
    versionKey: false, // This line disables the __v field
    toJSON: { virtuals: true }, //to make the virtual properties apeare in the json format sorted from the dataBase
    toObject: { virtuals: true },
  }
);
//query middleware with the hock of find : to manipulate the q
// productSchema.pre("find", function (next) {
//   this.find({ expiryDate: { $gte: new Date(2024, 0, 1) } });
//   next();
// });
//virtual Propertie middleware : for the calculated data to show them in the response
productSchema
  .virtual("discountedPrice")
  .get(function calculateDiscountedPrice(next) {
    let discountedPrice: number = this.price;
    if (this.promotions && this.promotions.length > 0) {
      const promotion = this.promotions[0];
      if (promotion.type === "discount") {
        // Calculate the discounted price
        const discount = promotion.value as number;
        return discountedPrice * (1 - discount / 100);
      }
    }
  });
//document middleware :it runs befor .save() and .create()
productSchema.pre("save", async function (next) {
  console.log("this is the slugify middleware👋");
  this.brand = slugify(this.brand).toUpperCase();
  // Perform any actions before saving the document
  // For example, you could normalize images URLs or create unique slugs based on the name
  next();
});
productSchema.post("save", function (doc, next) {
  console.log(doc);
  next();
});

// Export the ProductModel
export const ProductModel = mongoose.model<Product>("Product", productSchema);
