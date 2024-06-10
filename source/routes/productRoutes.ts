import { Router } from "express";
import { productController } from "../controllers/productController";
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
  .get(productController.getAllProducts)
  .post(productController.postProduct);
productRoutes
  .route("/:id")
  .patch(productController.updateProduct)
  .get(productController.getProductById);

export default productRoutes;
