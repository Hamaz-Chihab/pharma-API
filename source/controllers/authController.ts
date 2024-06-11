import jwt from "jsonwebtoken";
import config from "../config";
import { Request, Response, Router } from "express";
import { UserModel } from "../modules/user.schema";
import { catchAsync } from "../utils/catchAsync";
export const signup = catchAsync(async (req: Request, res: Response) => {
  const newUser = await UserModel.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = jwt.sign({ id: newUser._id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwt_expired_date,
  });

  // Respond with Success and User Data
  res.status(201).json({
    status: "success",
    data: {
      token: token,
      user: newUser, // Includes all fields defined in the schema
    },
  });
});
export const authController = {
  signup,
};
