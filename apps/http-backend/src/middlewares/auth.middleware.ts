import { NextFunction, Response } from "express";
import { verifyToken } from "../utils/token.js";
import { customRequest } from "../express.js";
import { emitError } from "../utils/response.js";

export function authMiddleware(
  req: customRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"];
  if (!token) {
    emitError({ res, error: "token not provided" });
    return;
  }
  const payload = verifyToken(token);
  if (payload.error) {
    emitError({ res, error: `token not verified: ${payload.error}` });
    return;
  }
  if (payload.decoded) {
    req.userId = payload.decoded.userId;
    next();
  } else {
    emitError({ res, error: `You are not authorized` });
    return;
  }
}
