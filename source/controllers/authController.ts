import jwt from "jsonwebtoken";
import config from "../config";
import { promisify } from "util";
import { NextFunction, Request, Response, Router } from "express";
import { UserModel, User } from "../modules/user.schema";
import { catchAsync } from "../utils/catchAsync";
import { CustomError } from "./errorController";
import sendEmail from "../utils/email";
import * as crypto from "crypto";
import * as bcrypt from "bcrypt";

// Define the Value type (adjust as needed)

type Value = number;

// Create the operationMap
const operationMap = new Map([
  [
    "+",
    (Left: Value, Right: Value): Value => {
      return Left + Right; // Your logic here...
    },
  ],
  // Add other operations as needed
]);
const signToken = (id: unknown) => {
  return jwt.sign({ id: id }, config.secrets.jwt_secret, {
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
    token: token,
    data: {
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
const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //1)getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // console.log(token);
    if (!token) {
      return next(
        new CustomError("you are not logged in ! please log in to access", 401)
      );
    }
    //2)virefication token
    const jwtVerifyPromisified = (
      token: string,
      secret: string
    ): Promise<any> => {
      return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, payload) => {
          if (err) {
            reject(err);
          } else {
            resolve(payload);
          }
        });
      });
    };

    // Usage
    const decoded = await jwtVerifyPromisified(
      token,
      config.secrets.jwt_secret
    );
    console.log(decoded.id);
    // 3)check if user still exists
    const currentUser = await UserModel.findById(decoded.id);
    console.log("this is currentUser var : ", currentUser);
    if (!currentUser) {
      return next(
        new CustomError(
          "the user belonging to this token does not longer exist",
          401
        )
      );
    }

    //4)check if user change password after the token wa s issued
    console.log(
      "this is result var : ",
      currentUser.changePasswordAfter(decoded.iat)
    );

    if (currentUser.changePasswordAfter(decoded.iat)) {
      // Password was changed after token issuance
      return next(
        new CustomError(
          "User recently changed password ! Please log in again",
          401
        )
      );

      //   // Handle the case where the password was not changed
    }
    //GRANT ACCESS TO PROTECTED ROUTE and it is very important to the midllware restrictTo()
    req.body = currentUser;
    next();
  }
);
const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(
      "💀this is restrictTo middleware :💀" + JSON.stringify(req.body) + "💀💀"
    );
    if (!roles.includes(req.body.role)) {
      return next(
        new CustomError(
          "You do not have permission to perform this action",
          403
        )
      );
    } else next();
  };
};
const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //1) get user based on Posted email
    const user = await UserModel.findOne<User>({ email: req.body.email }); //retrieves a user from the database
    if (!user) {
      return next(
        new CustomError(
          "No user with email address in frogotPassword methode :",
          404
        )
      );
    }
    //2) generate the random resetToken

    const resetToken = await user.creatPasswordResetToken();

    // console.log("this is the resetToken  " + resetToken);
    // console.log("the line befor saving ?? " + user);
    const updateFields = {
      passwordResetToken: user.passwordResetToken,
      passwordRestExpires: user.passwordRestExpires,
    };
    try {
      await UserModel.updateOne(
        { _id: user.id },
        { $set: updateFields },
        { upsert: true }
      );
      // console.log("User updated successfully!");
    } catch (err) {
      return next(new CustomError("this is a problem of saving ", 400));
    }
    // console.log("entering the section of sending an email ");
    //3) send it to the user email
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;
    // console.log("this is the resetUrl :" + resetURL);
    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset token (Valid for 10 min)",
        message,
      });
      res.status(201).json({
        status: "success",
        message: ",saving is done and Token send to email!",
        resetToken: resetToken,

        data: {
          user: user, // Includes all fields defined in the schema
        },
      });
    } catch (err) {
      // reset bothe the passwordResetToken AND passwordRestExpires IN DATABASE AS Undifined
      user.passwordResetToken = "";
      user.passwordRestExpires = null;
      await user.save({ validateBeforeSave: false }); //to disactivate all the validators that we set to save in schema file
      return next(
        new CustomError("there is an error sending the email !!Try later", 500)
      );
    }
  }
);
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //1) get a user based on the Token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await UserModel.findOne({
      passwordResetToken: hashedToken,
      passwordRestExpires: { $gt: Date.now() },
    }); //find the user for with Token + check if Token is not yet expired

    //2)  if token has not expired , and there is user , set the new password
    if (!user) {
      return next(
        new CustomError(
          "user with specific Token does not exist or Token expired  ",
          400
        )
      );
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = "";
    user.passwordRestExpires = null;
    await user.save();
    //3)  update the changedPasswordAt property  for the user : i added a middleware of pre save
    //4)  log the user in , send JWT
    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token: token,
      body: {
        user: user,
      },
    });
  }
);
const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //1) get the user from the Collection
    const user = await UserModel.findOne<User>({
      email: req.body.email,
    }).select("+password"); //retrieves a user from the database
    console.log("this is the user from DB :" + user);
    console.log(
      "this is the req.body.passwordCurrent :" + req.body.passwordCurrent
    );
    console.log("this is the user.password :" + user?.password);
    //2)  check if pasted current password is correct
    if (
      !user ||
      !(await user.isCorrectPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new CustomError("Incorrect password", 401));
    }

    //3)  if so update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save(); //to disactivate all the validators that we set to save in schema file

    //2)  log user in , send JWT
    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      message: "password has been changed successfully",
      token: token,
    });
  }
);
export const authController = {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
};
