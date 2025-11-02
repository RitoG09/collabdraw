import { create } from "zustand";
import { ShapeType } from "@repo/common/types";
import { ShapeStore } from "types/types";
import { SetStateAction } from "react";

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
