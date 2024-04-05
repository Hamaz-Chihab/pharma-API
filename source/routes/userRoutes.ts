import { Router } from "express";
import { createNewUser } from "../controllers/userController";
const userRoutes = Router();
//error handler Middleware for the router file :

//the error handler should be for the next
//product routes :
userRoutes.post("/", createNewUser);
export default userRoutes;
