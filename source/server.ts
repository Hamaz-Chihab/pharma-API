import * as dotenv from "dotenv";
dotenv.config();
import app from "./index"; // Assuming 'app' is your HTTP server instance
import config from "./config";
import mongoose from "mongoose";
import { CustomError } from "./controllers/errorController";
// process.on("unhandledRejection", (err: CustomError) => {
//   console.error("UNHANDLED REJECTION 💥");
//   console.error(err.name, err.message);
//   process.exit(1);
// });
// process.on("unhandledRejection", (err: CustomError) => {
//   console.error("UNCAUGHT REJECTION 💥");
//   console.error(err.name, err.message);
//   process.exit(1);
// });

// Access the database URL from the nested secrets object
const DB = config.secrets.dbUrl;

mongoose.connect(DB).then((con) => {
  // console.log(con.connection);
  console.log("MongoDB connected");
});
const server = app.listen(config.port, () => {
  console.log(`Hello on http://localhost:${config.port}`);
  console.log("The server is opened NOW");
});
// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION 💥");
  console.error(err.name, err.message);
  server.close(() => {
    console.log("Server closed. Exiting process.");
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("UNCAUGHT EXCEPTION 💥");
  console.error(err.name, err.message);
  process.exit(1);
});
