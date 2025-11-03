import { ShapeType } from "@repo/common";
import { SetStateAction } from "react";
import { DimentionType } from "@repo/common";

export type User = {
  username: string;
  email: string;
};

export type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export interface ShapeStore {
  shapes: ShapeType[];
  setShapes: (shapes: SetStateAction<ShapeType[]>) => void;
}

export type ParticipantType = {
  id: string;
  username: string;
};

export interface ParticipantStore {
  participants: ParticipantType[];
  setParticipants: (participants: ParticipantType[]) => void;
}

export enum ESocketStatus {
  "connecting",
  "connected",
  "disconnected",
}

export interface SocketStatusStore {
  socketStatus: ESocketStatus;
  setSocketStatus: (status: ESocketStatus) => void;
}

export type ToolType =
  | "rectangle"
  | "circle"
  | "diamond"
  | "arrow"
  | "line"
  | "pencil"
  | "text"
  | "eraser"
  | "pan"
  | "select";

export type ShapeTypeStore = {
  activeTool: ToolType;
  setActive: (shapeType: ToolType) => void;
};

export type Action = "none" | "move" | "draw" | "resize" | "erase" | "pan";

export type TextInput = { cords: DimentionType; value: string };

export type IndexStore = {
  index: number;
  setIndex: (updater: number | ((prev: number) => number)) => void;
};

export type CurrCanvasStore = {
  currCanvas: ShapeType[][];
  setCurrCanvas: (
    updater: ShapeType[][] | ((prev: ShapeType[][]) => ShapeType[][])
  ) => void;
};

export interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
  username?: string;
}

export interface ChatStore {
  chatMessages: ChatMessage[];
  typingUser: string | null;
  setChatMessages: (messages: ChatMessage[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  setTypingUser: (user: string | null) => void;
  clearChat: () => void;
}

export interface ChatUser {
  id: string;
  username: string;
}
