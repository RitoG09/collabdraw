import { WebSocketServer } from "ws";
import { authUser } from "./auth/auth.js";
import { prismaClient } from "@repo/db/client";
import {
  establishConnection,
  getUser,
  removeConnection,
  leaveRoom,
  joinRoom,
  createShape,
  updateShape,
  deleteShape,
  chat,
  typing,
} from "./users.js";
import { MessageType } from "./types.js";
import { connectKafkaProducer, consumeMessages } from "@repo/kafka/config";

const wss = new WebSocketServer({ port: 8000 });

(async () => {
  try {
    await connectKafkaProducer();
    console.log("Kafka producer connected..");

    const topic = "chats";
    await consumeMessages(topic);
    console.log(`Kafka consumer subscribed to topic: ${topic}`);
  } catch (error) {
    console.error("Kafka connection failed:", error);
  }
})();

wss.on("connection", async function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  console.log(url);

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const roomId = queryParams.get("roomId") || null;

  console.log("Extracted token:", token);
  const userId = authUser(token);
  if (!userId) {
    console.error("Connection rejected: invalid user");
    ws.close(4001, "Invalid user token");
    return;
  }

  const user = await prismaClient.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) {
    ws.close(4002, "User not found.");
    return;
  }
  console.log("roomId: ", roomId);

  establishConnection(ws, userId, user?.username);
  console.log(
    `New connection established for user: ${user.username} with ID: ${userId}`
  );

  if (roomId) {
    console.log("join");
    joinRoom(roomId, userId);
  }

  ws.on("close", () => {
    const user = getUser(userId);
    if (user) {
      user.rooms.forEach((roomId: string) => {
        leaveRoom(userId, roomId);
      });
    }
    removeConnection(userId);
  });

  ws.on("message", function message(data) {
    try {
      console.log("RAW MESSAGE: ", data);
      const parsedData = JSON.parse(data as unknown as string);
      console.log(parsedData);

      switch (parsedData.type) {
        case MessageType.join_room:
          console.log("join message receiving");
          joinRoom(userId, parsedData.payload.roomId);
          break;

        case MessageType.leave_room:
          leaveRoom(userId, parsedData.payload.roomId);
          break;

        case MessageType.create:
          console.log("create message receiving");
          createShape(
            userId,
            parsedData.payload.shape,
            parsedData.payload.roomId
          );
          break;

        case MessageType.update:
          console.log("update message receiving");
          updateShape(
            userId,
            parsedData.payload.shape,
            parsedData.payload.roomId
          );
          break;

        case MessageType.delete:
          console.log("delete message receiving");
          deleteShape(
            userId,
            parsedData.payload.shapeId,
            parsedData.payload.roomId
          );
          break;

        case MessageType.chat:
          console.log("chatting has started.");
          chat(userId, parsedData.payload.roomId, parsedData.payload.chats);
          break;

        case MessageType.typing:
          console.log("Someone is typing.");
          typing(userId, parsedData.payload.roomId);
          break;

        default:
          console.error("Unknown message type received");
      }
    } catch (error) {
      console.log(`Incorrect payload, ${error}`);
    }
  });
});
