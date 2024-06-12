import jwt from "jsonwebtoken";
import config from "../config";
import { NextFunction, Request, Response, Router } from "express";
import { UserModel, User } from "../modules/user.schema";
import { catchAsync } from "../utils/catchAsync";
import { CustomError } from "./errorController";
const signToken = (id: unknown) => {
  return jwt.sign({ id: id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwt_expired_date,
  });
};
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
  const token = signToken(newUser._id);
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

    // Check if email and password exist
    if (!email || !password) {
      return next(new CustomError("Please provide email and password!", 400));
    }
    // Find user by email and select the password field
    const user: User | null = await UserModel.findOne({ email }).select(
      "+password"
    );

    // If user doesn't exist or password is incorrect, throw an error
    if (!user || !(await user.isCorrectPassword(password, user.password))) {
      return next(new CustomError("Incorrect email or password", 401));
    }
    const token = signToken(user._id);
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
