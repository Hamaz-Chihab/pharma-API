import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../controllers/errorController";

//handler to replace the try catch block:
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
