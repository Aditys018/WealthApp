import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

export const generateTokens = (
  userId: string | ObjectId,
  name: string,
  permissions: string[]
) => {
  const accessToken = jwt.sign(
    { id: userId, name, permissions },
    process.env.JWT_TOKEN_SECRET as string,
    { expiresIn: "30m" }
  );

  const refreshToken = jwt.sign(
    { id: userId, name, permissions },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const generateAccessTokenFromRefresh = (
  refreshToken: string
): string => {
  const { id, name, permissions } = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string
  ) as { id: string; name: string; permissions: string[] };

  return jwt.sign(
    { id, name, permissions },
    process.env.JWT_TOKEN_SECRET as string,
    { expiresIn: "3m" }
  );
}
