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

