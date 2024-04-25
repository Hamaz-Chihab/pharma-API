import { Router } from "express";

import {
  getAllProducts,
  postProduct,
  getProductsStatus,
  setProductQueryParams,
  updateProduct,
  getProductById,
} from "../controllers/productController";
const productRoutes = Router();

//product routes :
productRoutes.route("/Haircares").get(setProductQueryParams, getAllProducts);
productRoutes.route("/Products-stats").get(getProductsStatus);
productRoutes.route("/").get(getAllProducts).post(postProduct);
productRoutes.route("/:id").patch(updateProduct).get(getProductById);

export default productRoutes;
