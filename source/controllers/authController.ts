import jwt from "jsonwebtoken";
import config from "../config";
import { promisify } from "util";
import { NextFunction, Request, Response, Router } from "express";
import { UserModel, User } from "../modules/user.schema";
import { catchAsync } from "../utils/catchAsync";
import { CustomError } from "./errorController";
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

    const resetToken: Promise<string> = user.creatPasswordResetToken();
    resetToken
      .then((result) => {
        console.log(
          "this is the resetToken in forgotPassword methode :",
          result
        );
      })
      .catch((error) => {
        console.error(
          "the resetToken doesn't came from the middlware :",
          error
        );
      });
    await user.save({ validateBeforeSave: false }); //to disactivate all the validators that we set to save in schema file
    //3) send it to the user email
    res.status(201).json({
      status: "success ,the saving is done ✅✅",
      data: {
        user: user, // Includes all fields defined in the schema
      },
    });
  }
);
const resetPassword = (req: Request, res: Response, next: NextFunction) => {};

export const authController = {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
};
