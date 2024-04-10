import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser"; // Assuming TypeScript definitions are available
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
// // import router from "./routes";
// import morgan from "morgan";
// const { check, validationResult } = require("express-validator");
console.log("hello wo");
// // import { protect } from "./modules/auth";
// // import { createNewUser, signin } from "./handlers/user";
const app = express();
app.use(bodyParser.json()); // Parse JSON request bodies very important to have the req and the res contain some thing
app.use(express.json()); //
app.use(morgan("dev")); //morgan middleware to give a brave line of URL requested in console-line
app.use("/api/v1/users", userRoutes); // Assuming base path for user routes is "/api/users"
app.use("/api/v1/products", productRoutes); // Assuming base path for product routes is "/api/products"

// // const customLogger = (message) => (res, req, next) => {
// //   console.log("hello forn ${message}");
// //   next();
// // };
// app.use(morgan("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // app.use((req, res, next) => {
// //   req.shhhh_secret = "doggy";
// //   next();
// // });
// // app.use(customLogger("chihab"));
// app.get("/", (req, res, next) => {
//   res.status(200);
//   res.json({ message: "hello" });
//   res.json({ message2: "this is an auther test " });
// });

// const signupValidationRules = [
//   check("username").isEmail().withMessage("Username must be a valid email"),
//   check("password")
//     .isLength({ min: 8 })
//     .withMessage("Password must be at least  8 characters long"),
// ];

// app.use("/api", protect, router); // by adding 'protect' we use auth in the routes
// app.post(
//   "/signup",
//   signupValidationRules,
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(422).json({ errors: errors.array() });
//     }
//     next();
//   },
//   createNewUser
// );
// app.post("/signin", signin);
// app.use((err, req, res, next) => {
//   if (err.type === "auth") {
//     res.status(401).json({ message: "unauthorized request" });
//   } else if (err.type === "input") {
//     res.status(400).json({ message: "invalide input" });
//   } else {
//     res.status(500).json({ message: "oops , thats on us " });
//   }
//   console.log(err.stack);
//   res.status(500).send("something Broke !");
// });
// app.use((err, req, res, next) => {
//   if (err.type === 'input') {
//     res.status(422).json({ error: err.message });
//   } else {
//     // Handle other types of errors
//     res.status(500).json({ error: 'An unexpected error occurred' });
//   }
// });
// interface Response {
//   status: number;
//   message?: string;
// }
// const chihab = {
//   staus: 200,
//   massage: "testing",
// };

// // app.get("/api/v1/pharma", (req, res) => {
// //   console.log("this is the get request");
// //   res.status(200).json({
// //     status: "success",
// //     result: chihab,
// //   });
// // });
// app.get("/api/v1/phama/:id/:x?", (req, res) => {
//   // const id = req.params.id * 1; //convert the id to string trick

//   console.log(req.params);
//   res.json({ status: "success" });
// });
// app.post("/api/v1/pharma", (req, res) => {
//   console.log(req.body);

//   res.send("Done");
// });
export default app;
