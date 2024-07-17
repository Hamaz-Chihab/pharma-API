import { Router } from "express";
import { productController } from "../controllers/productController";
import { authController } from "../controllers/authController";

const productRoutes = Router();

//product routes :
productRoutes
  .route("/Haircares")
  .get(
    productController.setProductQueryParams,
    productController.getAllProducts
  );
productRoutes.route("/Products-stats").get(productController.getProductsStatus);
productRoutes
  .route("/")
  .get(authController.protect, productController.getAllProducts)
  .post(productController.postProduct);
productRoutes
  .route("/:id")
  .patch(productController.updateProduct)
  .get(authController.protect, productController.getProductById);

export default productRoutes;
