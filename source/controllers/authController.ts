import { Request, Response, Router } from "express";
import { UserModel } from "../modules/user.schema";
import { catchAsync } from "../utils/catchAsync";
export const signup = catchAsync(async (req: Request, res: Response) => {
  const user = await UserModel.create(req.body);

  // Respond with Success and User Data
  res.status(201).json({
    status: "success",
    data: {
      user: user, // Includes all fields defined in the schema
    },
  });
});
export const authController = {
  signup,
};
