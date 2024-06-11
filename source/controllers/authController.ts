import jwt from "jsonwebtoken";
import config from "../config";
import { NextFunction, Request, Response, Router } from "express";
import { UserModel } from "../modules/user.schema";
import { catchAsync } from "../utils/catchAsync";
import { CustomError } from "./errorController";
const signup = catchAsync(async (req: Request, res: Response) => {
  const newUser = await UserModel.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    orders: req.body.orders,
  });
  // console.log(
  //   config.secrets.jwt,
  //   config.secrets.jwt_expired_date,
  //   config.secrets.JWT_SECRET,
  //   config.secrets.JWT_EXPIRES_IN
  // );
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
const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    //check if email and password exist
    if (!email || !password) {
      return next(new CustomError("please provide email and password ! ", 400));
    }
    const user = UserModel.findOne({email})
    const token = "";
    res.status(200).json({
      status: "success",
      token: token,
    });
  }
);
export const authController = {
  signup,
  login,
};
