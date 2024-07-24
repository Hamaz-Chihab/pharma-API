import { Router } from "express";
import { userController } from "../controllers/userController";

import { authController } from "../controllers/authController";
const userRoutes = Router();
//error handler Middleware for the router file :
// import authController from "../controllers/authController";
//the error handler should be for the next
//product routes :
userRoutes.post("/signup", authController.signup);
userRoutes.post("/login", authController.login);
userRoutes
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createNewUser);
userRoutes.route("/:id").patch().get(userController.getUserById);
userRoutes.patch("/updateMe", authController.protect, userController.updateMe);
userRoutes.delete("/deleteMe", authController.protect, userController.deleteMe);
userRoutes.post("/forgotPassword", authController.forgotPassword);
userRoutes.patch("/reserPassword/:token", authController.resetPassword);
userRoutes.patch("/updateMyPassword", authController.updatePassword);

export default userRoutes;
