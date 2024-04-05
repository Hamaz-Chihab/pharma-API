import { Router } from "express";
import getAllProducts from "../controllers/productController";
const productRoutes  = Router();
//error handler Middleware for the router file :

//the error handler should be for the next
//product routes :
productRoutes .get("/", getAllProducts);
export default productRoutes ;
