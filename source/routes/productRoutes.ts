import { Router } from "express";

import { getAllProducts } from "../controllers/productController"; // Adjust path as needed
const productRoutes = Router();
//error handler Middleware for the router file :

//the error handler should be for the next
//product routes :
productRoutes.get("/products", getAllProducts); // Mount the controller functions to routes
export default productRoutes;
