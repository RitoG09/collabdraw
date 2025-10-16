import WebSocket from "ws";
import { prismaClient } from "@repo/db/client";
import { IUser } from "./types.js";
import { ShapeType } from "@repo/common/types";

interface IShapeOperation {
  type: "create" | "update" | "delete";
  data?: any;
  shapeId?: string;
}

const users = new Map<string, IUser>();
const shapeOperationQueue: IShapeOperation[] = [];
let isProcessingQueue = false;

// export const processShapeQueue = async () => {
//   if (isProcessingQueue || shapeOperationQueue.length === 0) {
//     return;
//   }
//   isProcessingQueue = true;

//   const operation: any = shapeOperationQueue.shift();

//   try {
//     if (operation.type === "create") {
//       await prismaClient.shape.create({ data: operation.data });
//     } else if (operation.type === "update") {
//       await prismaClient.shape.update({
//         where: {
//           id: operation.data.id,
//         },
//         data: {
//           shape: operation.data.shape,
//         },
//       });
//     } else if (operation.type === "delete") {
//       await prismaClient.shape.delete({ where: { id: operation.shapeId } });
//     }
//   } catch (error) {
//     console.error("error");
//   }

//   isProcessingQueue = false;
//   setImmediate(processShapeQueue);
// };

export const processShapeQueue = async () => {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  while (shapeOperationQueue.length > 0) {
    const operation: any = shapeOperationQueue.shift();
    try {
      if (operation.type === "create") {
        await prismaClient.shape.create({ data: operation.data });
      } else if (operation.type === "update") {
        await prismaClient.shape.update({
          where: { id: operation.data.id },
          data: { shape: operation.data.shape },
        });
      } else if (operation.type === "delete") {
        await prismaClient.shape.delete({ where: { id: operation.shapeId } });
      }
    } catch (error) {
      console.error("Error processing shape operation:", error);
    }
  }

  isProcessingQueue = false;
};

export const establishConnection = (
  ws: WebSocket,
  userId: string,
  username: string
) => {
  users.set(userId, { ws, userId, username, rooms: new Set() });
  console.log(
    `connection established for ${username} and total size of the room is ${users.size}`
  );
};

export const removeConnection = (userId: string) => {
  const user = getUser(userId);
  if (user) {
    console.log(`User disconnected: ${user.username}`);
    users.delete(userId);
  }
};

export const getUser = (userId: string) => {
  return users.get(userId);
};

export const roomExists = async (roomId: string) => {
  try {
    if (!roomId || typeof roomId !== "string") return false;
    const room = await prismaClient.room.findFirst({
      where: { linkId: roomId },
    });
    return !!room;
  } catch (error) {
    console.error("Error checking room existence:", error);
    return false;
  }
};

export const getParticipants = (roomId: string) => {
  const participants = [];
  for (const user of users.values()) {
    if (user.rooms.has(roomId)) {
      participants.push({ id: user.userId, username: user.username });
    }
  }
  return participants;
};

export const broadcastToRoom = (roomId: string, msg: object) => {
  const serializedMsg = JSON.stringify(msg);
  for (const user of users.values()) {
    if (user.rooms.has(roomId)) {
      user.ws.send(serializedMsg);
    }
  }
};

export const joinRoom = async (roomId: string, userId: string) => {
  if (!(await roomExists(roomId))) {
    const user = getUser(userId);
    if (user) user.ws.send(JSON.stringify({ type: "roomNotFound" }));
    return;
  }
  const user = getUser(userId);
  if (!user || user.rooms.has(roomId)) return;
  user.rooms.add(roomId);
  console.log(user.rooms);
  broadcastToRoom(roomId, {
    type: "joinRoom",
    payload: { username: user.username },
  });
  broadcastToRoom(roomId, {
    type: "usersList",
    payload: { participants: getParticipants(roomId) },
  });
};

export const leaveRoom = async (userId: string, roomId: string) => {
  const user = getUser(userId);
  if (!user || !user.rooms.has(roomId)) return;
  user.rooms.delete(roomId);
  broadcastToRoom(roomId, {
    type: "leaveRoom",
    payload: { username: user.username },
  });
  broadcastToRoom(roomId, {
    type: "usersList",
    payload: { participants: getParticipants(roomId) },
  });
};

export const createShape = async (
  userId: string,
  shape: ShapeType,
  roomId: string
) => {
  if (!(await roomExists(roomId))) return;
  broadcastToRoom(roomId, {
    type: "create",
    payload: { shape },
  });

  shapeOperationQueue.push({
    type: "create",
    data: {
      id: shape.id,
      roomId,
      userId,
      shape,
    },
  });
  processShapeQueue();
};

export const updateShape = async (
  userId: string,
  shape: ShapeType,
  roomId: string
) => {
  if (!(await roomExists(roomId))) return;

  broadcastToRoom(roomId, {
    type: "update",
    payload: { shape },
  });

  shapeOperationQueue.push({
    type: "update",
    data: {
      id: shape.id,
      shape: shape,
    },
  });

  processShapeQueue();
};

export const deleteShape = async (
  userId: string,
  shapeId: string,
  roomId: string
) => {
  if (!(await roomExists(roomId))) return;

  broadcastToRoom(roomId, {
    type: "delete",
    payload: { shapeId },
  });

  shapeOperationQueue.push({
    type: "delete",
    shapeId: shapeId,
  });

  processShapeQueue();
};

export const chat = async (userId: string, roomId: string, chats: string) => {
  const timestamp = new Date().toISOString();
  if (!roomId || !chats) return;

  await prismaClient.chat.create({
    data: {
      roomId: roomId,
      senderId: userId,
      message: chats,
      createdAt: new Date(),
    },
  });

  if (!(await roomExists(roomId))) return;

  broadcastToRoom(roomId, {
    type: "chat",
    chat: chats,
    roomId,
    sender: userId,
    timestamp,
  });
};

export const typing = async (userId: string, roomId: string) => {
  const sender = userId;
  if (!(await roomExists(roomId))) return;
  broadcastToRoom(roomId, {
    type: "typing",
    sender,
    roomId,
  });
};
