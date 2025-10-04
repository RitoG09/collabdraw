import { ShapeType } from "@repo/common/types";
import { SetStateAction } from "react";
import { StoreApi, UseBoundStore } from "zustand";

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

export type ShapeTypeStore = {
  activeTool: ToolType;
  setActive: (shapeType: ToolType) => void;
}
