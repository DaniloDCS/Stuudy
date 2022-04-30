import { NextFunction, Request, Response } from "express";
import { connection } from "./connection";

const Auth = (req: Request, res: Response, next: NextFunction) => {
  if (connection.auth.session()) return next();
  return res.redirect('/signin');
}

export { Auth };