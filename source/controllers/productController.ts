import { Request, Response } from "express";
import { ProductModel } from "../modules/product.schema";
import { json } from "body-parser";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const totalProducts = await ProductModel.countDocuments();

    const products = await ProductModel.find()
      .sort({ createdAt: -1 }) // Sort by creation date (descending)
      .populate("promotions"); // Populate nested promotions

    res.status(200).json({
      status: "success",
      total: totalProducts, // Include total product count (optional)
      data: products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve products" });
  }
};
export const getOneProduct = async (req: Request, res: Response) => {
  try {
    console.log("❤️❤️");
    const queryObj = { ...req.query };
    console.log(queryObj);
    const excludedFields = ["page", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    console.log(excludedFields, queryObj);
    // Build the filtered query
    const filterQuery: any = {};
    for (const key in queryObj) {
      const [field, operator] = key.split("[");
      // Handle potential array values and undefined values
      const value = queryObj[key] as string | string[] | undefined;
      if (Array.isArray(value)) {
        // Handle array values appropriately (e.g., join them or apply logic as needed)
      } else if (value !== undefined) {
        if (operator && operator.endsWith("]")) {
          filterQuery[field] = { [`$${operator.slice(0, -1)}`]: value };
        } else {
          filterQuery[key] = { $regex: new RegExp(value, "i") }; // Safe to create RegExp now
        }
      }
    }

    const query = await ProductModel.find(filterQuery);
    const products = await query;
    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve products" });
  }
};
