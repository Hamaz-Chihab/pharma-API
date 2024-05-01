import { Router } from "express";
import { createNewUser } from "../controllers/userController";
import { signup } from "../controllers/authController";
const userRoutes = Router();
//error handler Middleware for the router file :
// import authController from "../controllers/authController";
//the error handler should be for the next
//product routes :
userRoutes.post("/signup", signup);
userRoutes.route("/").get().post(createNewUser);
userRoutes.route("/:id").patch().get();

export default userRoutes;
