import { Request, Response } from "express";
import { ProductModel } from "../modules/product.schema";

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
    const queryObj = { ...req.query };
    const excludedFields = ["page", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const query = await ProductModel.find(queryObj);
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
