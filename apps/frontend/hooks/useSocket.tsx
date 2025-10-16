"use client";

import { WS_URL } from "@/config";
import { ESocketStatus } from "@/types/types";
import { act, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import useSession from "./useSession";
import { useSocketStatusStore } from "@/store/useSockerStatusStore";
import { useParticipantsStore } from "@/store/useParticipantsStore";
import { useShapeStore } from "@/store/useShapeStore";
import { Shapes } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ShapeType } from "@repo/common/types";
import { useChatStore } from "@/store/useChatStore";

let wsInstance: WebSocket | null = null;
let connectionQueue: (() => void)[] = [];
let isConnecting: boolean = false;

const connect = (
  roomId: string | null,
  setSocketStatus: (status: ESocketStatus) => void,
  onConnectionEstablished?: () => void
) => {
  const token = localStorage.getItem("token");

  if (!token || !roomId) return;

  if (wsInstance || isConnecting) {
    return;
  }

  isConnecting = true;
  setSocketStatus(ESocketStatus.connecting);

  let wsUrl = `${WS_URL}?token=${token}`;
  if (roomId) {
    wsUrl += `&roomId=${roomId}`;
  }

  const ws = new WebSocket(wsUrl);
  wsInstance = ws;

  ws.onopen = () => {
    console.log("connection established.");
    isConnecting = false;
    setSocketStatus(ESocketStatus.connected);
    onConnectionEstablished?.();
    connectionQueue.forEach((action) => action());
    connectionQueue = [];
  };

  ws.onclose = () => {
    console.log("connection closed.");
    isConnecting = false;
    wsInstance = null;
    setSocketStatus(ESocketStatus.disconnected);
  };

  ws.onerror = () => {
    console.error("connection error");
    isConnecting = false;
    wsInstance = null;
    setSocketStatus(ESocketStatus.disconnected);
    toast.error("Websocket connection error");
  };

  return ws;
};

export default function useSocket() {
  const router = useRouter();
  const pathname = usePathname();
  const { roomId } = useSession();
  const { socketStatus, setSocketStatus } = useSocketStatusStore();
  const { participants, setParticipants } = useParticipantsStore();
  const { shapes, setShapes } = useShapeStore();
  const { chatMessages, setTypingUser, addChatMessage } = useChatStore();

  useEffect(() => {
    const ws = connect(roomId!, setSocketStatus);
    if (ws) {
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const { type, payload } = data;

          switch (type) {
            case "roomNotFound":
              toast.error("Room not found.");
              router.push("/room-not-found");
              break;

            case "joinRoom":
              toast.success(`${payload.username} has joined the room.`);
              if (pathname !== `/canvas/room/${roomId}`) {
                router.push(`/canvas/room/${roomId}`);
              }
              break;

            case "leaveRoom":
              toast.error(`${payload.username} has left the room`);
              break;

            case "initialShapes":
              setShapes(payload.shapes || []);
              break;

            case "usersList":
              setParticipants(payload.participants);
              break;

            case "create":
              setShapes((prev) => [...prev, payload.shape]);
              break;

            case "update":
              setShapes((prev) =>
                prev.map((s) => (s.id === payload.shape.id ? payload.shape : s))
              );
              break;

            case "delete":
              setShapes((prev) => prev.filter((s) => s.id !== payload.shapeId));
              break;

            case "chat":
              addChatMessage({
                sender: payload.sender,
                message: payload.chat,
                timestamp: payload.timestamp,
              });
              break;

            case "typing":
              setTypingUser(payload.sender);
              setTimeout(() => setTypingUser(null), 2000);
              break;

            default:
              console.warn("Unknown message type:", type);
          }
        } catch (error) {
          console.error("failed to parse message: ", error);
        }
      };
    }
  }, [roomId, setSocketStatus, setParticipants, setShapes]);

  const sendMessage = (type: string, payload: any) => {
    const action = () => {
      if (wsInstance?.readyState === WebSocket.OPEN) {
        console.log("Sending message.");
        wsInstance.send(JSON.stringify({ type, payload }));
      }
    };
    if (wsInstance?.readyState === WebSocket.OPEN) {
      console.log("Sending joining message here.");
      action();
    } else {
      console.log("Pushing join message in queue.");
      connectionQueue.push(action);
      if (!wsInstance && !isConnecting) {
        connect(roomId!, setSocketStatus);
      }
    }
  };

  const joinRoom = useCallback(
    (roomId: string) => {
      console.log("inside join room.");
      sendMessage("joinRoom", { roomId });
      if (pathname !== `/canvas/room/${roomId}`) {
        router.push(`/canvas/room/${roomId}`);
      }
    },
    [pathname, router, sendMessage]
  );

  const leaveRoom = useCallback(
    (roomId: string) => {
      sendMessage("leaveRoom", { roomId });
      wsInstance?.close();
      router.push("/draw-space");
    },
    [router]
  );

  const createShape = useCallback((roomId: string, shape: ShapeType) => {
    sendMessage("create", { roomId, shape });
  }, []);

  const updateShape = useCallback((roomId: string, shape: ShapeType) => {
    sendMessage("update", { roomId, shape });
  }, []);

  const deleteShape = useCallback((roomId: string, shapeId: string) => {
    sendMessage("delete", { roomId, shapeId });
  }, []);

  const sendChat = useCallback(
    (roomId: string, userId: string, message: string) => {
      if (!message.trim()) return;
      sendMessage("chat", {
        roomId,
        chats: message,
      });
    },
    []
  );

  const sendTyping = useCallback((roomId: string, userId: string) => {
    sendMessage("typing", { roomId });
  }, []);

  return {
    socketStatus,
    connect,
    joinRoom,
    leaveRoom,
    createShape,
    updateShape,
    deleteShape,
    sendChat,
    sendTyping,
  };
}
