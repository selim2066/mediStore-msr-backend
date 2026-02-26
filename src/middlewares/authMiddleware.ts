import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";

// type decalaration for user and user role
export enum UserRole {
  ADMIN = "ADMIN",
  SELLER = "SELLER",
  CUSTOMER = "CUSTOMER",
}
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        phone?: string;
        isBanned?: boolean;
        emailVerified: boolean;
      };
    }
  }
}

const authMiddleware = (...role: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      //headers
      //console.log(req.headers.cookie);
      const session = await auth.api.getSession({
        headers: req.headers as any,
      });
      //console.log(session);
      if (!session) {
        return res
          .status(401)
          .json({ message: "Unauthorized , session nai, authmiddleware" });
      }
      if (!session.user.emailVerified) {
        return res
          .status(401)
          .json({ message: "Email not verified, authmiddleware" });
      }
      if (session.user.isBanned) {
        return res
          .status(403)
          .json({ message: "Your account has been banned" });
      }

      req.user = {
        id: session.user.id,
        email: session.user.email!,
        role: session.user.role as string,
        phone: session.user.phone || undefined,
        
        emailVerified: session.user.emailVerified,
        isBanned: session.user.isBanned as boolean,
      };

      console.log("from authMiddleware req.user:", req.user);

      if (role.length && !role.includes(req.user.role as UserRole)) {
        return res.status(403).json({ message: "Forbidden bro..." });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export { authMiddleware };
