import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DecodedToken, ILoginRequestBody } from "../types";

export const checkRole = (allowedRoles: string[]) => {
  return (
    req: Request<{}, {}, ILoginRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_TOKEN_SECRET as string
      ) as DecodedToken;

      const hasRole = decoded.permissions.some((role) =>
        allowedRoles.includes(role)
      );
      if (!hasRole) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions" });
      }
      // append the decoded token to the request object
      // req.body.decoded = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
