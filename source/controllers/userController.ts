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
export const userController = {
  createNewUser,
  getUserById,
  updateMe,
};
