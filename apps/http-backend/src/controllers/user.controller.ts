import { Request, Response } from "express";
import { generateToken } from "../utils/token.js";
import bcrypt from "bcrypt";
import { emitError, emitSuccess } from "../utils/response.js";
import { customRequest } from "../express.js";
import { signInSchema, signUpSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

export const signup = async (req: Request, res: Response) => {
  try {
    const { error, data } = signUpSchema.safeParse(req.body);
    if (error) {
      emitError({ res, error: `Incorrect Inputs, ${error}`, statusCode: 400 });
      return;
    }

    const { username, email, password } = data;
    const existingUser = await prismaClient.user.findFirst({
      where: { username, email },
    });
    if (existingUser) {
      emitError({ res, error: `User already exists.`, statusCode: 400 });
      return;
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await prismaClient.user.create({
      data: { username, email, password: hashedPass },
    });
    const token = generateToken(user.id);
    if (token?.error) {
      emitError({
        res,
        error: `${token.error}`,
        statusCode: 400,
      });
      return;
    }
    emitSuccess({
      res,
      result: { token, user: { username: user.username, email: user.email } },
      message: `You are signed up successfully`,
    });
    return;
  } catch (error) {
    emitError({ res, error: `Error while signing up, ${error}` });
    return;
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { error, data } = signInSchema.safeParse(req.body);
    if (error) {
      emitError({ res, error: `Incorrect Inputs, ${error}`, statusCode: 400 });
      return;
    }
    const { email, password } = data;
    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      emitError({ res, error: `User doesn't exists`, statusCode: 400 });
      return;
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      emitError({ res, error: `Incorrect Password`, statusCode: 400 });
      return;
    }
    const token = generateToken(user.id);
    if (token?.error) {
      emitError({
        res,
        error: `${token.error}`,
        statusCode: 400,
      });
      return;
    }
    emitSuccess({
      res,
      result: { token, user: { username: user.username, email: user.email } },
      message: `You are signin up successfully`,
    });
    return;
  } catch (error) {
    emitError({ res, error: `Error while signing in, ${error}` });
    return;
  }
};

export const profile = async (req: customRequest, res: Response) => {
  const userId = req.userId;
  const user = await prismaClient.user.findFirst({
    where: { id: userId },
  });
  if (!user) {
    emitError({ res, error: "User not found", statusCode: 404 });
    return;
  }

  emitSuccess({
    res,
    result: { user: { username: user.username, email: user.email } },
    message: "User data has been sent successfully",
  });
  return;
};
