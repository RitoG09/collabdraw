import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createRoom,
  getChats,
  roomShapes,
} from "../controllers/room.controller.js";

const roomRouter: Router = Router();

roomRouter.post("/create", authMiddleware, createRoom);
roomRouter.get("/shapes/:roomId", authMiddleware, roomShapes);
roomRouter.get("/chats/:roomId", authMiddleware, getChats);

export default roomRouter;
