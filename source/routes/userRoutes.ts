import { Router } from "express";
import { createNewUser } from "../controllers/userController";
const router = Router();
//error handler Middleware for the router file :

//the error handler should be for the next
//product routes :
router.post("/user", createNewUser);
export default router;
