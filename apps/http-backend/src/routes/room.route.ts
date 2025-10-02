import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createRoom, roomShapes } from "../controllers/room.controller.js";

const roomRouter: Router = Router();

roomRouter.post("/create", authMiddleware, createRoom);
roomRouter.get("/shapes/:roomId", authMiddleware, roomShapes);

export default roomRouter;
