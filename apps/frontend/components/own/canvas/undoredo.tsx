import useUndoRedo from "@/hooks/useUndoRedo";
import { Undo, Redo } from "@/icons/icon";
import { Button } from "@/components/ui/button";

export function UndoRedo() {
  const { undo, redo } = useUndoRedo();

  return (
    <div className="absolute bottom-6 left-6">
      <div className="bg-neutral-800/60 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center">
          <Button
            className="p-2.5 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group rounded-l-xl hover:cursor-pointer"
            title="Undo — Ctrl + Z"
            onClick={() => undo()}
          >
            <Undo />
          </Button>

          <Button
            className="p-2.5 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group rounded-l-xl hover:cursor-pointer"
            title="Redo — Ctrl + Y"
            onClick={() => redo()}
          >
            <Redo />
          </Button>
        </div>
      </div>
    </div>
  );
}
