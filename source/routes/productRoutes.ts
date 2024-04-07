import { Router } from "express";

import {
  getAllProducts,
  getProductStatus,
  setProductQueryParams,
} from "../controllers/productController"; // Adjust path as needed
const productRoutes = Router();
//error handler Middleware for the router file :

//the error handler should be for the next
//product routes :
productRoutes.route("/Haircares").get(setProductQueryParams, getAllProducts);
productRoutes.route("/Products-stats").get(getProductStatus);
productRoutes.route("/").get(getAllProducts).post(); // Mount the controller functions to routes
productRoutes.route("/:id").get(); // Mount the controller functions to routes

export default productRoutes;
