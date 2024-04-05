import * as dotenv from "dotenv";
dotenv.config();
import config from "../../config";
import mongoose from "mongoose";
import * as fs from "fs/promises";

import { Product, ProductModel } from "../../modules/product.schema";

// Access the database URL from the nested secrets object
const DB = config.secrets.dbUrl;

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(DB);
    console.log("MongoDB connected");

    // Read products from JSON file
    const products = await readProductsFile();

    // Execute the appropriate function based on command-line arguments
    if (process.argv[2] === "--import") {
      await importData(products);
    } else if (process.argv[2] === "--delete") {
      await deleteData();
    } else {
      console.error(
        "Invalid command. Please use either '--import' or '--delete'."
      );
      process.exit(1); // Exit with an error code
    }
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit with an error code
  } finally {
    // Close the MongoDB connection (if needed)
    await mongoose.disconnect();
  }
}

main(); // Start the script

// Read products from JSON file
async function readProductsFile(): Promise<Product[] | undefined> {
  try {
    const path = require("path");
    // ...
    const filePath = path.join(
      process.cwd(), // Or any base path
      "source",
      "dev_data",
      "data",
      "products.json"
    );
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as Product[];
  } catch (err) {
    console.error("Error reading products file:", err);
    return undefined; // Indicate error by returning undefined
  }
}

// Import data function
async function importData(products: Product[] | undefined) {
  if (!products || !products.length) {
    console.error("No products found to import. Skipping.");
    return;
  }

  try {
    await ProductModel.create(products);
    console.log("Data successfully loaded");
  } catch (err) {
    console.error("Error importing data:", err);
    process.exit(1); // Exit with an error code
  }
}

// Delete data function
async function deleteData() {
  try {
    await ProductModel.deleteMany();
    console.log("Data successfully deleted");
  } catch (err) {
    console.error("Error deleting data:", err);
    process.exit(1); // Exit with an error code
  }
}
