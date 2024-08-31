import { NextFunction, Request, Response, Router } from "express";
import { User, UserModel } from "../modules/user.schema";
import { catchAsync } from "../utils/catchAsync";
import { CustomError } from "./errorController";
import { IGetUserAuthInfoRequest } from "./express";
const filterObj = function (_obj: any, ...allowedFields: string[]) {
  const newObj: Record<string, any> = {};
  Object.keys(_obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = _obj[el]; // Use _obj instead of obj
    }
  });
  return newObj;
};

const createNewUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserModel.create(req.body);

  // Respond with Success and User Data
  res.status(201).json({
    status: "success",
    data: {
      user, // Includes all fields defined in the schema
    },
  });
});
const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findById(req.params.id);
    if (!user) return next(new CustomError("No user with this ID ", 404));
    res.status(200).json({ status: "success", message: user });
  }
);
const updateMe = catchAsync(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    //1) Create error if user Posts password data

    if (req.user.password || req.user.passwordConfirm) {
      return next(
        new CustomError(
          "this route is not for password update , please use /updateMyPassword!!",
          400
        )
      );
    }

    // 2) fillter the req.body to make it contain only changebal fields
    const UpdatedUser = filterObj(
      req.body,
      "username",
      "email",
      "photo",
      "role"
    );
    console.log("this is the Updated User :", UpdatedUser);
    const user = await UserModel.findByIdAndUpdate(req.user.id, UpdatedUser, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      // Handle case where user with the provided ID is not found
      return next(new CustomError("the user does not exist in DataBase", 404));
    }
    // const allowedFields = ["username", "email", "photo", "role"];
    // for (const field of allowedFields) {
    //   if (UpdatedUser.hasOwnProperty(field)) {
    //     console.log(user[field] + " = " + UpdatedUser[field]);
    //     user[field] = UpdatedUser[field];
    //   }
    // }
    console.log("this is the user After the update ", user);
    res.status(200).json({
      status: "success",
      data: {
        user: user,
      },
    });
  }
);
const deleteMe = catchAsync(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { active: false },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!user) {
      // Handle case where user with the provided ID is not found
      return next(new CustomError("the user does not exist in DataBase", 404));
    }

    console.log("this is the user After the disActivate ", user);
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  // Advanced filtering:
  const queryObj = { ...req.query }; // Preserve original query object

  const excludedFields = ["page", "limit"]; // Default excluded fields
  excludedFields.forEach((el) => {
    if (el !== "fields") {
      // Don't exclude 'fields' for field limiting
      delete queryObj[el];
    }
  });
  console.log(excludedFields);

  // Field limiting (optional):
  let fieldsToSelect: string | undefined;
  if (req.query.fields) {
    try {
      fieldsToSelect = (req.query.fields as string).split(",").join(" "); // Allow comma-separated field names
      console.log("this is the fieldsToSlect : ", fieldsToSelect);
    } catch (err) {
      console.error("Error parsing fields parameter:", err);
      res.status(400).json({ error: "Invalid fields parameter" });
      return; // Exit early on invalid fields format
    }
  }

  let query = UserModel.find({}); // Initialize query object
  // Pagination logic
  let limit = 10; // Default limit per page
  let skip = 0; // Initial skip value (offset)

  if (req.query.limit) {
    try {
      limit = parseInt(req.query.limit as string, 10); // Parse limit from query
      limit = Math.min(limit, 100); // Limit maximum to 100 for security
    } catch (err) {
      console.error("Error parsing limit parameter:", err);
      res.status(400).json({ error: "Invalid limit parameter" });
      return; // Exit early on invalid limit format
    }
  }

  if (req.query.page) {
    try {
      const page = parseInt(req.query.page as string, 10); // Parse page number
      skip = limit * (page - 1); // Calculate skip based on page and limit
    } catch (err) {
      console.error("Error parsing page parameter:", err);
      res.status(400).json({ error: "Invalid page parameter" });
      return; // Exit early on invalid page format
    }
  }

  // Apply pagination to the query
  query = query.limit(limit).skip(skip);
  // Population is a feature in Mongoose that allows you to retrieve related data from other collections based on references (usually stored as IDs) within your documents.
  // const users = await query.populate("products"); // Execute query with sorting, filtering, and (optional) field limiting
  const users = await query; // Execute query with sorting, filtering, and (optional) field limiting
  const usersWithVirtuals: User[] = users.map((user) => user.toObject());

  // console.log("this is the products :", products);
  res.status(200).json({
    status: "success",
    results: usersWithVirtuals.length,
    data: usersWithVirtuals,
  });
});
export const userController = {
  createNewUser,
  getUserById,
  updateMe,
  deleteMe,
  getAllUsers,
};
