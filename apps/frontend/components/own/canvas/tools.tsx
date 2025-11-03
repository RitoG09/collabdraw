"use client";

import { ReactNode, useState } from "react";
import { ToolType } from "../../../types/types";
import { useActiveStore } from "../../../store/useActiveStore";
import { Button } from "../../ui/button";
import {
  Arrow,
  Circle,
  Diamond,
  Eraser,
  Line,
  Pan,
  Pencil,
  Rectangle,
  Select,
  Text,
} from "../../../icons/icon";

export function Tool({
  children,
  onClick,
  name,
  toolTip,
}: {
  children: ReactNode;
  onClick: () => void;
  name: ToolType;
  toolTip: string;
}) {
  const activeTool = useActiveStore((s) => s.activeTool);
  const [hovered, setHovered] = useState(false);

  return (
    <Button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={`flex justify-center items-center hover:bg-white/5 hover:scale-110 hover:cursor-pointer w-9 h-9 rounded-lg transition-all ease-in-out duration-300 ${activeTool === name ? `text-yellow-300 scale-110 bg-neutral-600/30` : ``}`}
    >
      {children}
      {hovered && (
        <div className="absolute top-full mt-2 left-1 -translate-x-5 px-2 py-0.5 rounded bg-white text-neutral-900 whitespace-nowrap z-10 shadow-lg text-sm">
          {toolTip}
        </div>
      )}
    </Button>
  );
}

// export function SelectTool() {
//   const setActiveTool = useActiveStore((s) => s.setActive);
//   const selectedTool = (tool: ToolType) => {
//     setActiveTool(tool);
//   };
//   return (
//     <div className="bg-neutral-800/60 backdrop-blur-md p-2 sm:px-3.5 sm:py-4 rounded-lg">
//       <div className="flex flex-col gap-3">
//         <div className="flex flex-col gap-2">
//           <Tool
//             name="rectangle"
//             toolTip="Rectangle"
//             onClick={() => selectedTool("rectangle")}
//           >
//             <Rectangle />
//           </Tool>
//           <Tool
//             name="circle"
//             toolTip="Circle"
//             onClick={() => selectedTool("circle")}
//           >
//             <Circle />
//           </Tool>
//           <Tool
//             name="diamond"
//             toolTip="Diamond"
//             onClick={() => selectedTool("diamond")}
//           >
//             <Diamond />
//           </Tool>
//           <Tool
//             name="arrow"
//             toolTip="Arrow"
//             onClick={() => selectedTool("arrow")}
//           >
//             <Arrow />
//           </Tool>
//         </div>
//         <div className="w-full h-px bg-neutral-700/50 my-1"></div>
//         <div className="flex flex-col gap-2">
//           <Tool onClick={() => selectedTool("line")} name="line" toolTip="Line">
//             <Line />
//           </Tool>
//           <Tool
//             onClick={() => selectedTool("pencil")}
//             name="pencil"
//             toolTip="Pencil"
//           >
//             <Pencil />
//           </Tool>
//           <Tool onClick={() => selectedTool("text")} name="text" toolTip="Text">
//             <Text />
//           </Tool>
//         </div>

//         <div className="w-full h-px bg-neutral-700/50 my-1"></div>

//         <div className="flex flex-col gap-2">
//           <Tool
//             onClick={() => selectedTool("eraser")}
//             name="eraser"
//             toolTip="Eraser"
//           >
//             <Eraser />
//           </Tool>

//           <Tool
//             onClick={() => selectedTool("pan")}
//             name="pan"
//             toolTip="Hand - Panning tool"
//           >
//             <Pan />
//           </Tool>
//           <Tool
//             onClick={() => selectedTool("select")}
//             name="select"
//             toolTip="Select"
//           >
//             <Select />
//           </Tool>
//         </div>
//       </div>
//     </div>
//   );
// }

export function SelectTool() {
  const setActiveTool = useActiveStore((s) => s.setActive);
  const selectedTool = (tool: ToolType) => {
    setActiveTool(tool);
  };
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-neutral-800/60 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg">
      <div className="flex flex-row gap-3 items-center">
        <div className="flex flex-row gap-2">
          <Tool
            name="rectangle"
            toolTip="Rectangle"
            onClick={() => selectedTool("rectangle")}
          >
            <Rectangle />
          </Tool>
          <Tool
            name="circle"
            toolTip="Circle"
            onClick={() => selectedTool("circle")}
          >
            <Circle />
          </Tool>
          <Tool
            name="diamond"
            toolTip="Diamond"
            onClick={() => selectedTool("diamond")}
          >
            <Diamond />
          </Tool>
          <Tool
            name="arrow"
            toolTip="Arrow"
            onClick={() => selectedTool("arrow")}
          >
            <Arrow />
          </Tool>
        </div>
        <div className="h-6 w-px bg-neutral-700/50 mx-1"></div>
        <div className="flex flex-row gap-2">
          <Tool onClick={() => selectedTool("line")} name="line" toolTip="Line">
            <Line />
          </Tool>
          <Tool
            onClick={() => selectedTool("pencil")}
            name="pencil"
            toolTip="Pencil"
          >
            <Pencil />
          </Tool>
          <Tool onClick={() => selectedTool("text")} name="text" toolTip="Text">
            <Text />
          </Tool>
        </div>

        <div className="h-6 w-px bg-neutral-700/50 mx-1"></div>

        <div className="flex flex-row gap-2">
          <Tool
            onClick={() => selectedTool("eraser")}
            name="eraser"
            toolTip="Eraser"
          >
            <Eraser />
          </Tool>

          <Tool
            onClick={() => selectedTool("pan")}
            name="pan"
            toolTip="Hand - Panning tool"
          >
            <Pan />
          </Tool>
          <Tool
            onClick={() => selectedTool("select")}
            name="select"
            toolTip="Select"
          >
            <Select />
          </Tool>
        </div>
      </div>
    </div>
  );
}
