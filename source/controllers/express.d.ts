import { Request } from "express";
import { User } from "source/modules/user.schema";

export interface IGetUserAuthInfoRequest extends Request {
  user?: User; // or any other type representing user data
}
