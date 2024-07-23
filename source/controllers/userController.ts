import { NextFunction, Request, Response, Router } from "express";
import { UserModel } from "../modules/user.schema";
import { catchAsync } from "../utils/catchAsync";
import { CustomError } from "./errorController";
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
  async (req: Request, res: Response, next: NextFunction) => {
    //1) Create error if user Posts password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new CustomError(
          "this route is not for password update , please use /updateMyPassword!!",
          400
        )
      );
    }

    //2) update user documents
    //1)methode 1 create an obj with only the changebal fields
    // const UpdatedUser = {
    //   username: req.body.username,
    //   email: req.body.email,
    //   photo: req.body.photo,
    //   role: req.body.role,
    // };
    //2)methode 2 fillter the req.body to make it contain only changebal fields
    const UpdatedUser = await filterObj(
      req.body,
      "username",
      "email",
      "photo",
      "role"
    );
    const user = await UserModel.findByIdAndUpdate(req.body.id, UpdatedUser, {
      new: true,
      runValidators: true,
    });
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
