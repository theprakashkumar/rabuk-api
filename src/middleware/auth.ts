import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

export const useAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from cookie
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Unauthorized!");
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      iat: number;
    };
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error("User not found!");
    }
    (req as any).user = user;
    next();
  } catch (err: any) {
    res.status(401).send(err.message);
  }
};
