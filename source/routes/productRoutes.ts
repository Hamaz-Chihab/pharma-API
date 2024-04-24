import { Router } from "express";

import {
  getAllProducts,
  postProduct,
  getProductsStatus,
  setProductQueryParams,
  updateProduct,
} from "../controllers/productController"; // Adjust path as needed
const productRoutes = Router();
//error handler Middleware for the router file :

//the error handler should be for the next
//product routes :
productRoutes.route("/Haircares").get(setProductQueryParams, getAllProducts);
productRoutes.route("/Products-stats").get(getProductsStatus);
productRoutes.route("/").get(getAllProducts).post(postProduct); // Mount the controller functions to routes
productRoutes.route("/:id").put(updateProduct); // Mount the controller functions to routes

export default productRoutes;
