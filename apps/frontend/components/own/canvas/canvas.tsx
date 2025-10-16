"use client";

import { Dancing_Script } from "next/font/google";
import {
  getBoundingBox,
  drawBoundingBoxAndHandlers,
} from "@/utils/boundingBox";
import { cursorStyle } from "@/utils/cursorStyle";
import {
  handleMouseMovementOnMove,
  handleMouseMovementOnResize,
  makeShape,
} from "@/utils/mouseListeners/mouseMove";
import {
  checkIsCursorInShape,
  checkIsCursorOnHandlers,
  getShapeIndexOnPrecisePoint,
} from "@/utils/mouseListeners/mouseDown";
import { freeDraw, getDrawable, getText } from "@/utils/getDrawable";
import React, { useEffect, useLayoutEffect, useState } from "react";
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
import {
  SocketStatusStore,
  ESocketStatus,
  Action,
  TextInput,
} from "@/types/types";
import { useShapeStore } from "@/store/useShapeStore";
import { getExistingShapes } from "@/api/room";
import useUndoRedo from "@/hooks/useUndoRedo";
import { useIndexStore } from "@/store/useIndexStore";
import { useCurrCanvasStore } from "@/store/useCurrCanvasStore";
import { Users } from "lucide-react";
import { CollabPanel } from "./collabpanel";
import { UndoRedo } from "./undoredo";
import Logout from "../auth/logout";
import { Text } from "./text";
import Image from "next/image";
import { ChatPanel } from "./chatpanel";
import { useChatStore } from "@/store/useChatStore";

const dancingScript = Dancing_Script({
  weight: "700",
  subsets: ["latin"],
});

function getInitialShapes(): ShapeType[] {
  const rawCanvas = localStorage.getItem("curr-canvas");
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
  const [action, setAction] = useState<Action>("none");
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [previewShape, setPreviewShape] = useState<ShapeType | null>(null);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(
    null
  );
  const [resizeHandlerIndex, setResizeHandlerIndex] = useState<number | null>(
    null
  );
  const [dragOffset, setDragOffset] = useState<{
    dx: number;
    dy: number;
  } | null>(null);
  const activeTool = useActiveStore((s) => s.activeTool);
  const { mode, roomId } = useSession();
  const shapes = useShapeStore((s) => s.shapes);
  const setShapes = useShapeStore((s) => s.setShapes);
  const { undo, redo, addAction } = useUndoRedo();
  const [textInput, setTextInput] = useState<TextInput | null>(null);
  const [currPoints, setCurrPoints] = useState<DimentionType[]>([]);
  const [panOffset, setPanOffset] = useState<DimentionType>({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState<DimentionType | null>(null);
  const currCanvas = useCurrCanvasStore((s) => s.currCanvas);
  const index = useIndexStore((s) => s.index);
  const [hasMoved, setHasMoved] = useState(false);
  const [showCollabPanel, setShowCollabPanel] = useState(false);
  const { createShape, updateShape, deleteShape, socketStatus } = useSocket();
  const router = useRouter();
  const [chatOpen, setChatOpen] = useState(false);

  // const { chatOpen,sumOpen,toggleChat,toggleSum } = useChatStore();

  useLayoutEffect(() => {
    function resizeCanvas() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = window.devicePixelRatio || 1;
      const h = parent.clientHeight;
      const w = parent.clientWidth;

      canvas.height = h * dpr;
      canvas.width = w * dpr;
      canvas.style.height = `${h}px`;
      canvas.style.width = `${w}px`;

      const ctx = canvas.getContext("2d", {
        desynchronized: true,
        alpha: false,
      });
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      }
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    const restoredShapes = async () => {
      if (mode === "collaboration" && roomId) {
        try {
          const initialShapes = await getExistingShapes(roomId);
          setShapes(initialShapes);
        } catch (error) {
          toast.error("Failed to load existing shapes.");
        }
      } else if (mode === "solo") {
        const initialShapes = getInitialShapes();
        setShapes(initialShapes);
      }
    };
    restoredShapes();
  }, [roomId, mode, setShapes]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const primary = e.ctrlKey || e.metaKey;
      if (primary && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (primary && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);
    ctx.save();

    shapes.forEach((shape: ShapeType) => {
      if (!shape) return;
      if (shape.type === "pencil") {
        freeDraw(ctx, shape.points, panOffset);
        if (currPoints.length > 0) {
          freeDraw(ctx, shape.points, panOffset);
        }
      } else if (shape.type === "text") {
        getText(ctx, shape, panOffset);
      } else {
        const draw = getDrawable(shape, generator, panOffset);
        if (draw) {
          if (Array.isArray(draw)) {
            draw.forEach((d) => roughCanvas.draw(d));
          } else {
            roughCanvas.draw(draw);
          }
        }
      }
    });

    if (previewShape) {
      if (previewShape.type === "text") {
        getText(ctx, previewShape, panOffset);
      } else {
        const draw = getDrawable(previewShape, generator, panOffset);
        if (draw) {
          if (Array.isArray(draw)) {
            draw.forEach((d) => roughCanvas.draw(d));
          } else {
            roughCanvas.draw(draw);
          }
        }
      }
    }

    if (action === "draw" && activeTool === "pencil" && currPoints.length > 0) {
      freeDraw(ctx, currPoints, panOffset);

      if (currPoints.length > 0) {
        freeDraw(ctx, currPoints, panOffset);
      }
    }

    if (activeTool === "select" && selectedShapeIndex !== null) {
      const shape = shapes[selectedShapeIndex];
      const box = getBoundingBox(shape!, ctx);
      if (!box) return;
      drawBoundingBoxAndHandlers(generator, roughCanvas, box, panOffset);
    }

    ctx.restore();
  }, [
    shapes,
    previewShape,
    activeTool,
    selectedShapeIndex,
    currPoints,
    panOffset,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.cursor = cursorStyle[activeTool];
  }, [activeTool]);

  useEffect(() => {
    setShapes(currCanvas[index] || []);
  }, [currCanvas, index]);

  function getRelativeCoords(event: any) {
    const rect = event.target.getBoundingClientRect();
    return {
      x: event.clientX - rect.left + panOffset.x,
      y: event.clientY - rect.top + panOffset.y,
    };
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const cords = getRelativeCoords(event);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setHasMoved(false);

    if (activeTool === "pan") {
      setPanStart({ x: event.clientX, y: event.clientY });
      setAction("pan");
    } else if (activeTool === "select") {
      const handlerIndex = checkIsCursorOnHandlers(
        cords,
        selectedShapeIndex,
        shapes,
        ctx
      );

      if (typeof handlerIndex === "number" && selectedShapeIndex !== null) {
        setAction("resize");
        setResizeHandlerIndex(handlerIndex);
      } else {
        const index = checkIsCursorInShape(
          cords,
          shapes,
          setSelectedShapeIndex,
          setDragOffset,
          ctx
        );
        if (index !== -1) {
          setAction("move");
        }
      }
    } else if (activeTool === "eraser") {
      setAction("erase");
    } else if (activeTool === "pencil") {
      setAction("draw");
      setCurrPoints([cords]);
    } else {
      setAction("draw");
      setStart(cords);
      setSelectedShapeIndex(null);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const cords = getRelativeCoords(event);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (action === "pan" && panStart) {
      const dx = event.clientX - panStart.x;
      const dy = event.clientY - panStart.y;
      setPanOffset((prev) => ({
        x: prev.x - dx,
        y: prev.y - dy,
      }));
      setPanStart({ x: event.clientX, y: event.clientY });
    } else if (action === "draw" && activeTool === "pencil") {
      setCurrPoints((prev) => [...prev, cords]);
    } else if (action === "draw") {
      const shape = makeShape(activeTool, start, cords);
      if (!shape) return;
      setPreviewShape(shape);
    } else if (action === "move" && selectedShapeIndex !== null && dragOffset) {
      setHasMoved(true);
      handleMouseMovementOnMove(
        cords,
        setShapes,
        selectedShapeIndex,
        dragOffset
      );
    } else if (action === "resize" && selectedShapeIndex != null) {
      setHasMoved(true);
      handleMouseMovementOnResize(
        cords,
        shapes,
        setShapes,
        selectedShapeIndex,
        resizeHandlerIndex,
        ctx
      );
    } else if (action === "erase") {
      const hitIndex = getShapeIndexOnPrecisePoint(cords, shapes, ctx);
      if (hitIndex !== -1) {
        setShapes((prev: ShapeType[]) =>
          prev.filter((_shape, index) => index !== hitIndex)
        );
        if (mode === "collaboration" && roomId) {
          const shape = shapes[hitIndex];
          deleteShape(roomId, shape!.id);
        }
      }
    }
  };

  const handleMouseUp = () => {
    if (action === "pan") {
      setPanStart(null);
      setAction("none");
    } else if (
      action === "draw" &&
      activeTool === "pencil" &&
      currPoints.length > 0
    ) {
      const freeDraw: ShapeType = {
        id: uuidv4(),
        type: "pencil",
        points: currPoints,
      };
      addAction([...shapes, freeDraw]);
      setShapes((prev: ShapeType[]) => [...prev, freeDraw]);
      setCurrPoints([]);
      if (mode === "collaboration" && roomId) {
        createShape(roomId, freeDraw);
      }
    } else if (action === "draw") {
      if (previewShape) {
        addAction([...shapes, previewShape]);
        setShapes((prev: ShapeType[]) => [...prev, previewShape]);
        if (mode === "collaboration" && roomId) {
          createShape(roomId, previewShape);
        }
      }
    } else if (action === "move") {
      if (mode === "collaboration" && roomId && hasMoved) {
        const shape = shapes[selectedShapeIndex!];
        updateShape(roomId, shape!);
      }
      addAction(shapes);
    } else if (action === "resize") {
      if (mode === "collaboration" && roomId && hasMoved) {
        const shape = shapes[selectedShapeIndex!];
        updateShape(roomId, shape!);
      }
      addAction(shapes);
    } else if (action === "erase") {
      addAction(shapes);
    }
    setPreviewShape(null);
    setAction("none");
  };

  const handleMouseClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const cords = getRelativeCoords(event);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (activeTool === "select") {
      checkIsCursorInShape(
        cords,
        shapes,
        setSelectedShapeIndex,
        setDragOffset,
        ctx
      );
    } else if (activeTool === "text") {
      setTextInput({ cords, value: "" });
    } else if (activeTool !== "eraser") {
      setSelectedShapeIndex(null);
    }
  };

  const toggleCollaborationPanel = () => {
    setShowCollabPanel(!showCollabPanel);
  };

  const closeCollaborationPanel = () => {
    setShowCollabPanel(false);
  };

  return (
    <div className="relative overflow-y-hidden w-full h-screen">
      <canvas
        ref={canvasRef}
        width={1920}
        height={910}
        className="text-white"
        onPointerDown={handleMouseDown}
        onPointerMove={handleMouseMove}
        onPointerUp={handleMouseUp}
        onClick={handleMouseClick}
      ></canvas>

      <Text
        textInput={textInput}
        setShapes={setShapes}
        setTextInput={setTextInput}
        shapes={shapes}
        panOffset={panOffset}
      />

      <div className="absolute top-6 left-6 flex gap-2 items-center">
        <Image src="/logo.svg" alt="logo" height={50} width={30} />
        <text fontSize="50" fontWeight="600" fill="currentColor">
          Collab{" "}
          <tspan
            className={`${dancingScript.className} text-red-800 font-extrabold`}
            fontSize="25"
          >
            Draw
          </tspan>
        </text>
      </div>
      <div className="fixed top-8 right-6 z-20">
        <SelectTool />
      </div>
      {/* Chat Sidebar */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-80 shadow-lg border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-10 ${
          chatOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Chat Content */}
        <div className="h-full">
          <ChatPanel />
        </div>
      </div>

      {/* Overlay for mobile */}
      {/* {chatOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-5 lg:hidden md:hidden"
          onClick={() => toggleChat()}
        />
      )} */}
      <div>
        {mode === "solo" ? <UndoRedo /> : <Logout />}
        {mode === "collaboration" && (
          <div>
            <button
              onClick={toggleCollaborationPanel}
              className="fixed bottom-6 right-6 sm:bottom-6 sm:right-6 bg-neutral-700/60 hover:bg-neutral-800 hover:cursor-pointer text-white tracking-wider p-3 rounded-lg shadow-lg transition-colors flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              <span className="hidden md:inline">View Participants</span>
            </button>
            <CollabPanel
              isVisible={showCollabPanel}
              onclose={closeCollaborationPanel}
            />
          </div>
        )}
      </div>
    </div>
  );
}
