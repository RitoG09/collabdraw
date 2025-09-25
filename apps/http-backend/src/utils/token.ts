import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function generateToken(userId: string) {
  try {
    if (!process.env.JWT_SECRET) {
      return { error: "secret not provided" };
    }
    const encoded = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });
    return { encoded };
  } catch (error) {
    console.error("Error while generating token", error);
    return { error: "Failed to generate token." };
  }
}

export function verifyToken(token: string) {
  try {
    if (!token) {
      return { error: "No token provided" };
    }
    if (!process.env.JWT_SECRET) {
      return { error: "No token provided" };
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded === "string") {
      return { error: "invalid token payload" };
    }
    return { decoded };
  } catch (error) {
    console.error("Error while verifying token", error);
    return { error: "Failed to verify token." };
  }
}
