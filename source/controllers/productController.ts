import { Request, Response, NextFunction } from "express";
import { ProductModel, Product } from "../modules/product.schema";
import { catchErrors } from "../utils/catchAsync";
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
export const getProductsStatus = catchErrors(
  async (req: Request, res: Response) => {
    // Define the aggregation pipeline
    // Execute the aggregation pipeline
    let productStatus = await ProductModel.aggregate([
      { $match: {} },
      {
        $group: {
          _id: null, // Set to null for overall product statistics
          totalProducts: { $sum: 1 }, // Count all products
          averagePrice: { $avg: "$price" }, // Calculate average price
        },
      },
    ]);
    console.log("this is the productStatus object ", productStatus);
    if (!productStatus.length) {
      return res.status(200).json({
        status: "success",
        data: {
          message: "No products found",
        },
      });
    }

    res.status(200).json({
      status: "success",
      data: productStatus[0], // Assuming only one result from aggregation
    });
  }
);
export const getAllProducts = catchErrors(
  async (req: Request, res: Response) => {
    // Advanced filtering:
    const queryObj = { ...req.query }; // Preserve original query object

    const excludedFields = ["page", "limit", "fields", "sort"]; // Default excluded fields
    excludedFields.forEach((el) => {
      if (el !== "fields") {
        // Don't exclude 'fields' for field limiting
        delete queryObj[el];
      }
    });
    // console.log(excludedFields);

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
    const productsWithVirtuals: Product[] = products.map((product) =>
      product.toObject()
    );

    // console.log("this is the products :", products);
    res.status(200).json({
      status: "success",
      results: productsWithVirtuals.length,
      data: productsWithVirtuals,
    });
  }
);
export const postProduct = catchErrors(async (req: Request, res: Response) => {
  // Create a new product
  const product = new ProductModel(req.body);

  // Calculate the discounted price if there's a promotion
  if (product.promotions && product.promotions.length > 0) {
    const now = new Date();
    product.promotions.forEach((promotion) => {
      if (
        promotion.type === "discount" &&
        now >= promotion.startDate &&
        now <= promotion.endDate
      ) {
        const discount = promotion.value as number;
      }
    });
  }

  // Save the product
  await product.save();

  // Send the product as the response
  res.status(201).json(product);
});
export const updateProduct = catchErrors(
  async (req: Request, res: Response) => {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({ message: "No product found with that ID" });
    }

    res.status(200).json(product);
  }
);
export const getProductById = catchErrors(
  async (req: Request, res: Response) => {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "No product found with that ID" });
    }

    res.status(200).json(product);
  }
);
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
