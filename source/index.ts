import * as dotenv from "dotenv";
dotenv.config();
import app from "./server";
import config from "./config";
import mongoose from "mongoose";

// Access the database URL from the nested secrets object
const DB = config.secrets.dbUrl;

if (DB) {
  mongoose
    .connect(DB)
    .then((con) => {
      // console.log(con.connection);
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.log("An error in the connection for the database");
      console.error(err);
    });
} else {
  console.error("Error: Missing DATABASE_URL environment variable");
  // Handle the error gracefully (e.g., stop the server)
}

app.listen(config.port, () => {
  console.log(`hello on http://localhost:${config.port}`);
  console.log("The server is opened NOW");
});
