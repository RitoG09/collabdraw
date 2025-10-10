import { z } from "zod";

export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be atleast 3 characters" })
    .max(20, { message: "Username must be between 3 and 20 characters" }),
  email: z.email({ message: "Provide correct email format" }),
  password: z
    .string()
    .min(5, { message: "Password must be atleast 5 characters" })
    .max(20, { message: "Password must be between 5 and 20 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
      {
        message:
          "Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character",
      }
    ),
});

export const signInSchema = z.object({
  email: z.email({ message: "Provide correct email format" }),
  password: z
    .string()
    .min(5, { message: "Password must be atleast 5 characters" })
    .max(20, { message: "Password must be between 5 and 20 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
      {
        message:
          "Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character",
      }
    ),
});

export const createRoomSchema = z.object({
  linkId: z.string(),
});

export type DimentionType = {
  x: number;
  y: number;
};

export type ShapeType =
  | {
      id: string;
      type: "rectangle";
      dimention: DimentionType[];
      x: number;
      y: number;
      width: number;
      height: number;
      seed?: number;
    }
  | {
      id: string;
      type: "circle";
      dimention: DimentionType[];
      x: number;
      y: number;
      diameter: number;
      seed?: number;
    }
  | {
      id: string;
      type: "diamond";
      dimention: DimentionType[];
      diamondPoints: [number, number][];
      seed?: number;
    }
  | {
      id: string;
      type: "arrow";
      dimention: DimentionType[];
      shaft: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
      };
      tip: number[];
      left: number[];
      right: number[];
      seed?: number;
    }
  | {
      id: string;
      type: "line";
      dimention: DimentionType[];
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      seed?: number;
    }
  | {
      id: string;
      type: "text";
      x: number;
      y: number;
      text: string;
      font: string;
      color: string;
    }
  | {
      id: string;
      type: "pencil";
      points: DimentionType[];
      options?: any;
    };
