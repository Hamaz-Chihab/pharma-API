import express, { NextFunction } from "express";
import morgan from "morgan";
import bodyParser from "body-parser"; // Assuming TypeScript definitions are available
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import { errorHandler, CustomError } from "./controllers/errorController"; // Adjust the path as needed
// // import router from "./routes";
// import morgan from "morgan";
// const { check, validationResult } = require("express-validator");
// // import { protect } from "./modules/auth";
// // import { createNewUser, signin } from "./handlers/user";
const app = express();

app.use(bodyParser.json()); // Parse JSON request bodies very important to have the req and the res contain some thing
app.use(express.json());
app.use(morgan("dev")); //morgan middleware to give a brave line of URL requested in console-line
app.use("/api/v1/users", userRoutes); // Assuming base path for user routes is "/api/users"
app.use("/api/v1/products", productRoutes); // Assuming base path for product routes is "/api/products"
app.use(errorHandler);

app.use((req, res, next) => {
  const err = new CustomError("Route not found", 404);
  err.status = "fail";
  err.statusCode = 404;
  console.log("the custom error handling middleware is activated");
  next(err);
});

// Global error handler middleware
app.use(errorHandler);

// Global error handler middleware
// app.use((err, req, res, next) => {
//   err.status = err.status || "error";
//   err.statusCode = err.statusCode || 500;
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });

export default app;
