import { ShapeType } from "@repo/common";
import { useIndexStore } from "../store/useIndexStore";
import { useCurrCanvasStore } from "../store/useCurrCanvasStore";

export default function useUndoRedo() {
  const currCanvas = useCurrCanvasStore((s) => s.currCanvas);
  const setCurrCanvas = useCurrCanvasStore((s) => s.setCurrCanvas);
  const index = useIndexStore((s) => s.index);
  const setIndex = useIndexStore((s) => s.setIndex);

  const addAction = (newShapes: ShapeType[]) => {
    setCurrCanvas((prev) => {
      const updatedHistory = prev.slice(0, index + 1);
      const newHistory = [...updatedHistory, newShapes];
      return newHistory;
    });
    setIndex((prev) => prev + 1);
  };

  const undo = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const redo = () => {
    setIndex((prev) =>
      currCanvas && prev < currCanvas.length - 1 ? prev + 1 : prev
    );
  };

  const resetCanvas = () => {
    setCurrCanvas([[]]);
    setIndex(0);
  };

  return { addAction, undo, redo, resetCanvas };
}
