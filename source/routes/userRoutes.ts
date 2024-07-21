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
userRoutes.route("/").get().post(userController.createNewUser);
userRoutes.route("/:id").patch().get(userController.getUserById);

userRoutes.post("/forgotPassword", authController.forgotPassword);
userRoutes.patch("/reserPassword/:token", authController.resetPassword);
userRoutes.post("/updatePassword", authController.updatePassword);

export default userRoutes;
