import { create } from "zustand";
import { ShapeTypeStore } from "../types/types";

export const useActiveStore = create<ShapeTypeStore>()((set) => ({
  activeTool: "select",
  setActive: (activeTool) => set({ activeTool }),
}));
