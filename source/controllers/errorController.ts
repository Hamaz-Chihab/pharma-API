import { Request, Response, NextFunction } from "express";
export class CustomError extends Error {
  statusCode: number; // Declare the statusCode property
  status: string | undefined;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.name = "CustomError";
  }
}
const sendErrorDev = (err: CustomError, res: Response) => {
  res.status(err.statusCode).json({
    err: err,
    stack: err.stack,
    status: err.status,
    massage: err.message,
  });
};
const sendErrorProd = (err: CustomError, res: Response) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      status: err.status,
      massage: err.message,
    });
  } else {
    console.error("ERROR 💥", err);
    // Handle other types of errors (e.g., unexpected server errors)
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === "developement") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, res);
  }
};
