import { Request, Response } from "express";
import { UserModel } from "../modules/user.schema";
export const createNewUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.create({
      data: {
        user: req.body,
      },
    });
    console.log(req.body);
    res.status(201).json({
      status: "success",
      data: {
        user: req.body,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
