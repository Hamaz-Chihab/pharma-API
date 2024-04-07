import { Request, Response, NextFunction } from "express";
import { ProductModel } from "../modules/product.schema";
// import { ApiFeatures } from "../utils/ApiFeatures";

export const setProductQueryParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default query parameters
  req.query.category = "Haircare";
  req.query.sort = "price";

  // Allow overriding defaults with incoming query parameters (type safety)
  if (typeof req.query.category === "string") {
    req.query.category = req.query.category; // Use existing category if provided
  }
  if (typeof req.query.sort === "string") {
    req.query.sort = req.query.sort; // Use existing sort if provided
  }

  next();
};

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
    // Pagination logic
    let limit = 10; // Default limit per page
    let skip = 0; // Initial skip value (offset)

    if (req.query.limit) {
      try {
        limit = parseInt(req.query.limit as string, 10); // Parse limit from query
        limit = Math.min(limit, 100); // Limit maximum to 100 for security
      } catch (err) {
        console.error("Error parsing limit parameter:", err);
        res.status(400).json({ error: "Invalid limit parameter" });
        return; // Exit early on invalid limit format
      }
    }

    if (req.query.page) {
      try {
        const page = parseInt(req.query.page as string, 10); // Parse page number
        skip = limit * (page - 1); // Calculate skip based on page and limit
      } catch (err) {
        console.error("Error parsing page parameter:", err);
        res.status(400).json({ error: "Invalid page parameter" });
        return; // Exit early on invalid page format
      }
    }

    // Apply pagination to the query
    query = query.limit(limit).skip(skip);

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

// export const getAllProducts = async (req: Request, res: Response) => {
//   try {
//     const apiFeatures = new ApiFeatures(req.query, req.query.toString());

//     apiFeatures.filter();
//     apiFeatures.sort();
//     apiFeatures.limitFields();
//     apiFeatures.paginate();

//     const query = ProductModel.find(apiFeatures.getQuery()); // Use getQuery()

//     const products = await query.populate("promotions"); // Execute query with sorting, filtering, and (optional) field limiting

//     console.log("this is the products :", products);
//     res.status(200).json({
//       status: "success",
//       results: products.length,
//       data: products,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to retrieve products" });
//   }
// };
