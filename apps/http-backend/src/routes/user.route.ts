import { Router } from "express";
import { profile, signin, signup } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRouter: Router = Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/profile", authMiddleware, profile);

export default userRouter;
