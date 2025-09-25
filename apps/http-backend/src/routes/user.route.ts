import { Router } from "express";
import { profile, signin, signup } from "../controllers/user.controller.js";

const userRouter: Router = Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.get("/profile", profile);

export default userRouter;
