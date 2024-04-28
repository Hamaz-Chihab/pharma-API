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
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      status: err.status,
      massage: err.message,
    });
  } else {
    // Handle other types of errors (e.g., unexpected server errors)
    res.status(500).json({ error: "Internal Server Error" });
  }
};

