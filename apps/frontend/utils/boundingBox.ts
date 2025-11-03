import { DimentionType, ShapeType } from "@repo/common";
import { RoughGenerator } from "roughjs/bin/generator";

export function getHandlerPositions(box: any, pad = 4) {
  const paddedBox = {
    minX: box.minX - pad,
    minY: box.minY - pad,
    maxX: box.maxX + pad,
    maxY: box.maxY + pad,
  };
  return {
    paddedBox,
    handlers: [
      { x: paddedBox.minX, y: paddedBox.minY },
      { x: paddedBox.maxX, y: paddedBox.minY },
      { x: paddedBox.maxX, y: paddedBox.maxY },
      { x: paddedBox.minX, y: paddedBox.maxY },
    ],
  };
}

export function getBoundingBox(
  shape: ShapeType,
  ctx: CanvasRenderingContext2D
) {
  if (!shape) return;

  switch (shape.type) {
    case "rectangle":
      return {
        minX: Math.min(shape.dimention[0]!.x, shape.dimention[1]!.x),
        minY: Math.min(shape.dimention[0]!.y, shape.dimention[1]!.y),
        maxX: Math.max(shape.dimention[0]!.x, shape.dimention[1]!.x),
        maxY: Math.max(shape.dimention[0]!.y, shape.dimention[1]!.y),
      };
    case "circle": {
      const r = shape.diameter / 2;

      return {
        minX: shape.dimention[0]!.x - r,
        minY: shape.dimention[0]!.y - r,
        maxX: shape.dimention[0]!.x + r,
        maxY: shape.dimention[0]!.y + r,
      };
    }
    case "diamond": {
      const xs = shape.diamondPoints.map(([x, _]) => x);
      const ys = shape.diamondPoints.map(([_, y]) => y);
      return {
        minX: Math.min(...xs),
        minY: Math.min(...ys),
        maxX: Math.max(...xs),
        maxY: Math.max(...ys),
      };
    }
    case "arrow":
    case "line": {
      const xs = [shape.dimention[0]!.x, shape.dimention[1]!.x];
      const ys = [shape.dimention[0]!.y, shape.dimention[1]!.y];
      return {
        minX: Math.min(...xs),
        minY: Math.min(...ys),
        maxX: Math.max(...xs),
        maxY: Math.max(...ys),
      };
    }
    case "text":
      ctx.font = shape.font || "24px Arial";
      const width = ctx.measureText(shape.text).width;
      const height = parseInt(shape.font || "24", 10);
      return {
        minX: shape.x,
        minY: shape.y,
        maxX: shape.x + width,
        maxY: shape.y + height,
      };
    case "pencil":
      if (!shape.points || shape.points.length === 0) return null;
      const xs = shape.points.map((p) => p.x);
      const ys = shape.points.map((p) => p.y);
      return {
        minX: Math.min(...xs),
        minY: Math.min(...ys),
        maxX: Math.max(...xs),
        maxY: Math.max(...ys),
      };
    default:
      return null;
  }
}

export function drawBoundingBoxAndHandlers(
  generator: RoughGenerator,
  roughCanvas: any,
  box: { minX: number; minY: number; maxX: number; maxY: number },
  panOffset: DimentionType,
  handleSize = 12
) {
  const pos = getHandlerPositions(box);

  const rectDrawable = generator.rectangle(
    pos.paddedBox.minX - panOffset.x,
    pos.paddedBox.minY - panOffset.y,
    pos.paddedBox.maxX - pos.paddedBox.minX,
    pos.paddedBox.maxY - pos.paddedBox.minY,
    {
      stroke: "#a8050d",
      strokeWidth: 0.7,
      roughness: 0.001,
      seed: 278,
      dashGap: 3,
      bowing: 0.8,
    }
  );
  roughCanvas.draw(rectDrawable);

  const handlers = pos.handlers;

  handlers.forEach((h) => {
    const circleDrawable = generator.circle(
      h.x - panOffset.x,
      h.y - panOffset.y,
      handleSize,
      {
        stroke: "#a8050d",
        fillStyle: "",
        roughness: 0.001,
        strokeWidth: 3,
        seed: 155,
      }
    );
    roughCanvas.draw(circleDrawable);
  });
}
