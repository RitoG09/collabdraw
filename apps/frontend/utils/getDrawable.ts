import { DimentionType, ShapeType } from "@repo/common/types";
import { RoughGenerator } from "roughjs/bin/generator";
import { getSvgPathFromStroke } from "./getSvgPathFromStroke";
import { getStroke } from "perfect-freehand";

export const getDrawable = (
  shape: ShapeType,
  generator: RoughGenerator,
  panOffset: DimentionType
) => {
  if (!shape?.type) {
    console.log("shape type not defined");
    return;
  }

  switch (shape.type) {
    case "rectangle": {
      const { x, y, width, height, seed } = shape;
      return generator.rectangle(
        x - panOffset.x,
        y - panOffset.y,
        width,
        height,
        { stroke: "white", roughness: 1, seed }
      );
    }
    case "circle": {
      const { x, y, diameter, seed } = shape;
      return generator.circle(x - panOffset.x, y - panOffset.y, diameter, {
        stroke: "white",
        roughness: 1,
        seed,
      });
    }
    case "diamond": {
      const { diamondPoints, seed } = shape;

      const panDiamondPoints: [number, number][] = diamondPoints.map(
        ([x, y]) => [x - panOffset.x, y - panOffset.y]
      );
      return generator.polygon(panDiamondPoints, {
        stroke: "white",
        roughness: 1,
        seed,
      });
    }
    case "arrow": {
      const { x1, x2, y1, y2 } = shape.shaft;
      const { tip, left, right, seed } = shape;
      const shaft = generator.line(
        x1 - panOffset.x,
        y1 - panOffset.y,
        x2 - panOffset.x,
        y2 - panOffset.y,
        { stroke: "white", roughness: 1, seed }
      );

      const leftLine = generator.line(
        //@ts-ignore
        tip[0] - panOffset.x,
        //@ts-ignore
        tip[1] - panOffset.y,
        //@ts-ignore
        left[0] - panOffset.x,
        //@ts-ignore
        left[1] - panOffset.y,
        { stroke: "white", roughness: 1.5, seed }
      );

      const rightLine = generator.line(
        //@ts-ignore
        tip[0] - panOffset.x,
        //@ts-ignore
        tip[1] - panOffset.y,
        //@ts-ignore

        right[0] - panOffset.x,
        //@ts-ignore
        right[1] - panOffset.y,
        { stroke: "white", roughness: 1.5, seed }
      );
      return [shaft, leftLine, rightLine];
    }
    case "line": {
      const { x1, y1, x2, y2, seed } = shape;
      return generator.line(
        x1 - panOffset.x,
        y1 - panOffset.y,
        x2 - panOffset.x,
        y2 - panOffset.y,
        { stroke: "white", roughness: 0.4, seed }
      );
    }
    default:
      console.log("invalid shape type");
      return;
  }
};

export const getText = (
  ctx: CanvasRenderingContext2D,
  shape: ShapeType,
  panOffset: DimentionType
) => {
  if (shape.type !== "text") return;

  ctx.font = shape.font || "24px 'Indie Flower'";
  ctx.fillStyle = "#0ff";
  ctx.textBaseline = "top";
  ctx.fillText(shape.text, shape.x - panOffset.x, shape.y - panOffset.y);
};

export const freeDraw = (
  ctx: CanvasRenderingContext2D,
  points: DimentionType[],
  panOffset: DimentionType
) => {
  const panPoints = points.map((pt) => ({
    x: pt.x - panOffset.x,
    y: pt.y - panOffset.y,
  }));

  const stroke = getStroke(panPoints, {
    size: 3,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
  });

  const path = getSvgPathFromStroke(stroke);
  ctx.fillStyle = "#0ff";
  ctx.fill(new Path2D(path));
};
