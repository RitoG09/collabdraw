import { persist } from "zustand/middleware";
import { create } from "zustand";
import { CurrCanvasStore } from "types/types";

export const useCurrCanvasStore = create<CurrCanvasStore>()(
  persist(
    (set) => ({
      currCanvas: [[]],
      setCurrCanvas: (updater) =>
        set((state) => ({
          currCanvas:
            typeof updater === "function" ? updater(state.currCanvas) : updater,
        })),
    }),
    {
      name: "curr-canvas",
    }
  )
);
