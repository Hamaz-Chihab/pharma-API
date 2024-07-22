import { NextFunction, Request, Response, Router } from "express";
import { UserModel } from "../modules/user.schema";
import { catchAsync } from "../utils/catchAsync";
import { CustomError } from "./errorController";

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
  async (req: Request, res: Response, next: NextFunction) => {}
);
export const userController = {
  createNewUser,
  getUserById,
  updateMe,
};
