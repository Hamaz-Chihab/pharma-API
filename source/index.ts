import express, { NextFunction } from "express";

import morgan from "morgan";
import bodyParser from "body-parser"; // Assuming TypeScript definitions are available
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import { errorHandler, CustomError } from "./controllers/errorController"; // Adjust the path as needed
import rateLimit from "express-rate-limit";
import config from "./config";
import helmet from "helmet";
import MongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import { whitelist } from "validator";
// import xssClean from "xss-clean";
// import morgan from "morgan";
// const { check, validationResult } = require("express-validator");

const app = express();
//set security HTTPS
app.use(helmet()); //must be in the begining ofthe middleware stack
console.log(" tobtob going to kurkey 👍👍");
app.use(bodyParser.json()); // Parse JSON request bodies very important to have the req and the res contain some thing
app.use(express.json({ limit: "10kb" }));
// Data sanitization againstt NoSQL  query injection attack
app.use(MongoSanitize());

app.use(hpp({ whitelist: "fields" })); //remvove dublicate fields in query params
// Data sanitization againstt XSS attack
// app.use(xssClean());//it show me non resonalble error !!
// app.use(express.static(`${__dirname}/public`));
if (config.env === "development") {
  app.use(morgan("dev")); //morgan middleware to give a brave line of URL requested in console-line
}
const limiter = rateLimit({
  //limiting the nmr of req to recieve
  max: 100, //100 req/hour
  windowMs: 60 * 60 * 1000,
  message: "too many request from this Ip ,Please try again in an hour !!",
});
app.use("/api", limiter); //effect all URLs starts with /api
app.use("/api/v1/users", userRoutes); // Assuming base path for user routes is "/api/users"
app.use("/api/v1/products", productRoutes); // Assuming base path for product routes is "/api/products"
app.use("/api/v1/orders", orderRoutes);

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
