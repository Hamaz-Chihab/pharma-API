import { Request, Response, NextFunction } from 'express';

//handler to replace the try catch block:
export const catchErrors = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
      fn(req, res, next).catch(next);
    };
  };