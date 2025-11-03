import { create } from "zustand";
import { ShapeType } from "@repo/common";
import { SetStateAction } from "react";
import { ShapeStore } from "../types/types";

export const useShapeStore = create<ShapeStore>()((set) => ({
  shapes: [],
  setShapes: (shapes: SetStateAction<ShapeType[]>) =>
    set((state) => ({
      shapes:
        typeof shapes === "function"
          ? (shapes as (prev: ShapeType[]) => ShapeType[])(state.shapes)
          : shapes,
    })),
}));
