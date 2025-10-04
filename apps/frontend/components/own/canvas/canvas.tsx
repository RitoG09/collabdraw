"use client";

import React, { useState } from "react";
import { SelectTool } from "./tools";
import { useActiveStore } from "@/store/useActiveStore";
import useSocket from "@/hooks/useSocket";
import useSession from "@/hooks/useSession";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { DimentionType, ShapeType } from "@repo/common/types";
import rough from "roughjs";
import { useRef } from "react";

function getInitialShapes(): ShapeType[] {
  const rawCanvas = localStorage.getItem("current-canvas");
  const rawIndex = localStorage.getItem("index");
  if (!rawCanvas || !rawIndex) return [];

  try {
    const parsedCanvas = JSON.parse(rawCanvas);
    const parsedIndex = JSON.parse(rawIndex);
    const idx = parsedIndex.state?.index;
    const allCanvases = parsedCanvas.state?.currentCanvas as
      | ShapeType[][]
      | undefined;

    if (Array.isArray(allCanvases) && typeof idx === "number") {
      return allCanvases[idx] ?? [];
    }
  } catch (error) {
    console.error(error);
  }
  return [];
}

const generator = rough.generator();

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const [action, setAction] = useState<>("none");
  const [start, setStart] = useState({ x: 0, y: 0 });
  return (
    <div>
      <SelectTool />
    </div>
  );
}
