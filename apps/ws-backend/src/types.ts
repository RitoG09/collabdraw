import WebSocket from "ws";

export interface IUser {
  ws: WebSocket;
  userId: string;
  username: string;
  rooms: Set<string>;
}

export enum MessageType {
  join_room = "joinRoom",
  leave_room = "leaveRoom",
  create = "create",
  update = "update",
  delete = "delete",
}
