import jwt from "jsonwebtoken";

export function authUser(token: string): string | null {
  try {
    if (!process.env.JWT_SECRET) {
      return null;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || typeof decoded === "string" || !decoded.userId) {
      return null;
    }
    return decoded.userId;
  } catch (error) {
    console.error(error);
    return null;
  }
}
