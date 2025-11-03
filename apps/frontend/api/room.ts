import axios, { AxiosError } from "axios";
import { HTTP_URL } from "../config";

export const createRoom = async (roomData: { linkId: string }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token");
      return;
    }
    const response = await axios.post(`${HTTP_URL}/room/create`, roomData, {
      headers: { authorization: token },
    });
    return response.data.result;
  } catch (error: any) {
    console.error("Axios createRoom error:", error.response?.data);
    throw new Error(
      error.response?.data?.error || "Room not created, creation failed"
    );
  }
};

export const getExistingShapes = async (roomId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("no token");
      return;
    }
    const response = await axios.get(`${HTTP_URL}/room/shapes/${roomId}`, {
      headers: { authorization: token },
    });
    const allShapes = response.data.result.shapes;

    const shapes = allShapes.map((currShape: { shape: string }) => {
      const shape = currShape.shape;
      return shape;
    });
    console.log(shapes);
    return shapes;
  } catch (error) {
    const err = error as AxiosError<{ error: string }>;
    throw new Error(
      err.response?.data.error || `Failed to fetch shapes ${error}`
    );
  }
};

export const getExistingChat = async (roomId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("no token");
      return;
    }
    const response = await axios.get(`${HTTP_URL}/room/chats/${roomId}`, {
      headers: { authorization: token },
    });
    console.log("API response:", response.data);
    const allMessages = response.data.chats;

    return allMessages.map((msg: any) => ({
      sender: msg.senderId.toString(),
      message: msg.message,
      timestamp: msg.createdAt || msg.timestamp || new Date().toISOString(),
    }));
  } catch (error) {
    const err = error as AxiosError<{ error: string }>;
    throw new Error(
      err.response?.data.error || `Failed to fetch chats ${error}`
    );
  }
};
