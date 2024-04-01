import { Request, Response } from "express";
import { UserModel } from "../modules/user.schema";
export const createNewUser = async (req: Request, res: Response) => {
  try {
    // // Optional Validation (using UserModel.validateSync())
    // const newUser = new UserModel(req.body);
    // const validationErrors = newUser.validateSync();
    // if (validationErrors) {
    //   const errorMessages = Object.values(validationErrors.errors).map(
    //     (err) => err.message
    //   );
    //   return res.status(400).json({ status: "fail", message: errorMessages });
    // }

    // Create and Save User
    const user = await UserModel.create(req.body);

    // Respond with Success and User Data
    res.status(201).json({
      status: "success",
      data: {
        user, // Includes all fields defined in the schema
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ status: "error", message: "creation Error" });
  }
};
