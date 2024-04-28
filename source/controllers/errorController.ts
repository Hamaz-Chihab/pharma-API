import { Request, Response, NextFunction } from "express";
export class CustomError extends Error {
  statusCode: number; // Declare the statusCode property
  status: string | undefined;
  isOperational: boolean;
  path: any;
  value: any;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
const handleDuplicateFieldsDB = (err: CustomError) => {
  const message = `Duplicate field value: ${err.value}. Please use a different value.`;
  return new CustomError(message, 400);
};
const handelCastErrorDB = (err: CustomError) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new CustomError(message, 400);
};
const handelValidationErrorDB = (err: CustomError) => {
    
  const message = `Invalid input data `;
  return new CustomError(message, 400);
};
const sendErrorDev = (err: CustomError, res: Response) => {
  console.log("this is the error handler in the dev mode : ", err);
  res.status(err.statusCode || 500).json({
    stack: err.stack,
    status: err.status,
    message: err.message,
    name: err.name,
    err: err,
  });
};
const sendErrorProd = (err: CustomError, res: Response) => {
  if (err.isOperational) {
    console.log("this is the error handler in the production mode : ", err);
    res.status(err.statusCode || 500).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR 💥", err);

    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV == "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV == "production") {
    console.log("the errorHandler in production mode is exicuting  ");
    let error = { ...err };
    sendErrorProd(err, res);
    if (error.name === "CastError") error = handelCastErrorDB(error);
    if (error.name === "ValidationError")
      error = handelValidationErrorDB(error);
    if (error.name === "MongoError") error = handleDuplicateFieldsDB(error);
    sendErrorProd(error, res);
  }
};
