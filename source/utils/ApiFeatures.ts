// import * as mongoose from "mongoose"; // With @types/mongoose installed

// export class ApiFeatures {
//   constructor(private originalQuery: any, private queryString: string) {
//     // if (!mongoose.Mongoose.['Query'].prototype.isPrototypeOf(originalQuery)) {
//     //   throw new Error("Invalid query object passed to ApiFeatures");
//     // }
//   }

//   filter() {
//     const queryObj = { ...this.originalQuery }; // Preserve original query object
//     const excludedFields = ["page", "limit", "fields", "sort"];
//     excludedFields.forEach((el) => delete queryObj[el]);
//     this.originalQuery = queryObj as mongoose.Mongoose["Query"]; // Cast back to Mongoose.Query
//     return this.originalQuery;
//   }

//   sort() {
//     // Apply default sorting (if not specified):
//     if (!this.originalQuery.sort) {
//       this.originalQuery = this.originalQuery.sort({ createdAt: -1 });
//       console.log("Default sorting applied: createdAt descending");
//       return;
//     }

//     // Apply sorting (if provided):
//     try {
//       const sortBy = (this.originalQuery.sort as string).split(",").join(" ");
//       console.log("Sort by:", sortBy);
//       this.originalQuery = this.originalQuery.sort(sortBy); // Now valid Mongoose.Query
//     } catch (err) {
//       console.error("Error applying sorting:", err);
//       throw new Error("Invalid sort parameter"); // Throw error for middleware handling
//     }

//     return this.originalQuery; // Return the sorted query object
//   }

//   limitFields() {
//     // Field limiting (optional):
//     if (this.originalQuery.fields) {
//       try {
//         const fieldsToSelect = (this.originalQuery.fields as string)
//           .split(",")
//           .join(" ");
//         this.originalQuery = this.originalQuery.select(fieldsToSelect); // Now valid Mongoose.Query
//       } catch (err) {
//         console.error("Error parsing fields parameter:", err);
//         throw new Error("Invalid fields parameter"); // Throw error for middleware handling
//       }
//     }

//     return this.originalQuery; // Return the query with field limiting applied
//   }

//   paginate() {
//     // Pagination logic
//     let limit = 10;
//     let skip = 0;

//     if (this.originalQuery.limit) {
//       try {
//         limit = Math.min(parseInt(this.originalQuery.limit as string, 10), 100);
//       } catch (err) {
//         console.error("Error parsing limit parameter:", err);
//         throw new Error("Invalid limit parameter"); // Throw error for middleware handling
//       }
//     }

//     if (this.originalQuery.page) {
//       try {
//         const page = parseInt(this.originalQuery.page as string, 10);
//         skip = limit * (page - 1);
//       } catch (err) {
//         console.error("Error parsing page parameter:", err);
//         throw err; // Consider throwing a specific error for page parsing
//       }
//     }

//     this.originalQuery = this.originalQuery.limit(limit).skip(skip); // Now valid Mongoose.Query
//     return this.originalQuery; // Return the query object with pagination applied
//   }

//   getQuery() {
//     return this.originalQuery; // Return the final built query object
//   }
// }
