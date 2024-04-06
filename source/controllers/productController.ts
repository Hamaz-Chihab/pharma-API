import { Request, Response } from "express";
import { ProductModel } from "../modules/product.schema";
import { json } from "body-parser";
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    // Advanced filtering:
    const queryObj = { ...req.query }; // Preserve original query object

    const excludedFields = ["page", "limit", "fields", "sort"]; // Default excluded fields
    excludedFields.forEach((el) => {
      if (el !== "fields") {
        // Don't exclude 'fields' for field limiting
        delete queryObj[el];
      }
    });
    console.log(excludedFields);

    // Field limiting (optional):
    let fieldsToSelect: string | undefined;
    if (req.query.fields) {
      try {
        fieldsToSelect = (req.query.fields as string).split(",").join(" "); // Allow comma-separated field names
        console.log("this is the fieldsToSlect : ", fieldsToSelect);
      } catch (err) {
        console.error("Error parsing fields parameter:", err);
        res.status(400).json({ error: "Invalid fields parameter" });
        return; // Exit early on invalid fields format
      }
    }

    let query = ProductModel.find({}); // Initialize query object

    // Apply default sorting (if not specified):
    if (!req.query.sort) {
      query = query.sort({ createdAt: -1 }); // Default sort by created date descending
      console.log("Default sorting applied: createdAt descending");
    }

    // Apply sorting (if provided):
    if (req.query.sort) {
      try {
        const sortBy = (req.query.sort as string).split(",").join(" ");
        console.log("Sort by:", sortBy);
        query = query.sort(sortBy); // Apply sorting
      } catch (err) {
        console.error("Error applying sorting:", err);
        res.status(400).json({ error: "Invalid sort parameter" });
        return; // Exit early to avoid further processing
      }
    }

    // Apply filtering (if any filters exist):
    if (Object.keys(queryObj).length > 0) {
      for (const key in queryObj) {
        if (key !== "fields") {
          // Skip 'fields' property
          const value = queryObj[key];
          console.log("Filtering by2:", key, value);
          query = query.find({ [key]: value }); // Add query conditions
        }
      }
    }

    // Apply field limiting (if provided):
    if (fieldsToSelect) {
      query = query.select(fieldsToSelect); // Select only specified fields
    }

    const products = await query.populate("promotions"); // Execute query with sorting, filtering, and (optional) field limiting

    console.log("this is the products :", products);
    res.status(200).json({
      status: "success",
      results: products.length,
      data: products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve products" });
  }
};
// export const getOneProduct = async (req: Request, res: Response) => {
//   try {

//     res.status(200).json({
//       status: "success",
//       data: products,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to retrieve products" });
//   }
// };
