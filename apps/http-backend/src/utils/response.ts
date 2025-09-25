import { Response } from "express";

interface ISuccess {
  res: Response;
  result: any;
  message: string;
  statusCode?: number;
}

interface IError {
  res: Response;
  error: string;
  statusCode?: number;
}

export function emitSuccess({
  res,
  result,
  message,
  statusCode = 200,
}: ISuccess) {
  res.status(statusCode).json({ result, message });
}

export function emitError({ res, error, statusCode = 200 }: IError) {
  res.status(statusCode).json({ error });
}
