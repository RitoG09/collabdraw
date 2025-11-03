import { persist } from "zustand/middleware";
import { create } from "zustand";
import { IndexStore } from "../types/types";

export const useIndexStore = create<IndexStore>()(
  persist(
    (set) => ({
      index: 0,
      setIndex: (updater: number | ((prevIndex: number) => number)) =>
        set((state) => ({
          index: typeof updater === "function" ? updater(state.index) : updater,
        })),
    }),
    {
      name: "index",
    }
  )
);
