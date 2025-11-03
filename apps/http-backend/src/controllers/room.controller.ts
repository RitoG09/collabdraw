import { createRoomSchema } from "@repo/common";
import { customRequest } from "../express.js";
import { Response } from "express";
import { emitError, emitSuccess } from "../utils/response.js";
import { prismaClient } from "@repo/db/client";

const createRoom = async (req: customRequest, res: Response) => {
  try {
    const { error, data } = createRoomSchema.safeParse(req.body);
    if (error) {
      emitError({
        res,
        error: `Invalid link format, ${error}`,
        statusCode: 400,
      });
      return;
    }
    if (!req.userId) {
      emitError({ res, error: `You are not authorized`, statusCode: 400 });
      return;
    }
    const room = await prismaClient.room.create({
      data: {
        adminId: req.userId,
        linkId: data.linkId,
      },
    });
    emitSuccess({
      res,
      result: { room },
      message: `Room created successfully`,
    });
    return;
  } catch (error) {
    emitError({ res, error: `Error while creating room, ${error}` });
    return;
  }
};

const roomShapes = async (req: customRequest, res: Response) => {
  try {
    const roomId = req.params.roomId;
    if (!roomId) {
      emitError({ res, error: `No room`, statusCode: 400 });
      return;
    }

    const roomPresent = await prismaClient.room.findFirst({
      where: { linkId: roomId },
    });

    if (!roomPresent) {
      console.log("No room found.");
      emitError({ res, error: `Room not found`, statusCode: 400 });
      return;
    }
    const shapes = await prismaClient.shape.findMany({
      where: { roomId: roomId },
      take: 50,
      orderBy: {
        id: "asc",
      },
    });
    emitSuccess({
      res,
      result: { shapes: shapes },
      message: `Shapes fetched succesfully.`,
    });
  } catch (error) {
    emitError({ res, error: `Error while fetching room Shapes, ${error}` });
    return;
  }
};

const getChats = async (req: customRequest, res: Response) => {
  try {
    const roomId = req.params.roomId;
    if (!roomId) {
      emitError({ res, error: `No room`, statusCode: 400 });
      return;
    }
    const limit = parseInt(req.query.limit as string) || 50;
    const cursor = req.query.cursor
      ? parseInt(req.query.cursor as string)
      : undefined;

    const chats = await prismaClient.chat.findMany({
      where: {
        roomId,
        ...(cursor && { id: { lt: cursor } }),
      },
      orderBy: {
        id: "desc",
      },
      take: limit,
    });
    res.json({
      chats: chats.reverse(),
      nextCursor: chats.length ? chats[chats.length - 1]!.id : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages." });
  }
};

export { createRoom, roomShapes, getChats };
