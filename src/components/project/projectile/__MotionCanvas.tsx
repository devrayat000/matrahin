// this is a backup file, not used in the project

import { useEffect, useMemo, useRef, useState } from "react";
import drawArrow, { drawArrowByAngle } from "~/lib/utils/CanvasUtils";

import { useAtom, useAtomValue } from "jotai";
import { RotateCcw, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  INITIAL,
  animatingPointsAtom,
  modifyPoints,
  objectSize,
  pointsAtom,
  scaleAtom,
} from "./AnimationHelper";
import { LegendsType, Point, modifiedValues, projectileAtom } from "./store";

const theta = "θ";

export interface ProjectileMotionProps {}

const ProjectileMotion = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [bufferIndex, setBufferIndex] = useState(0);

  const result = useAtomValue(projectileAtom)!;
  const [scale, setScale] = useAtom(scaleAtom);
  const points = useAtomValue(pointsAtom);
  const animatingPoints = useAtomValue(animatingPointsAtom);

  const [animationSpeed, setAnimationSpeed] = useState(1); // [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2
  const animationSpeedMain = useMemo(
    () => Math.floor(animationSpeed * 4 + scale * 4 * animationSpeed),
    [scale, animationSpeed]
  );

  useEffect(() => {
    const updateScale = () => {
      setScale(calculateScale(result.xm));
    };
    updateScale();
  }, [result.xm, setScale]);

  const calculateScale = (maxRange: number) => {
    return (INITIAL.canvasDimension.x - 50) / maxRange;
  };
  // computed values from result
  const values: modifiedValues = useMemo(() => {
    const objectPosition = modifyPoints(0, result.yi, scale);

    return {
      objectPosition: objectPosition,
      objectSpeed: {
        magnitude: result.vi,
        angle: (result.angle * Math.PI) / 180,
      },
      height: result.yi,
    };
  }, [result, scale]);

  // initial render
  useEffect(() => {
    reset();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    reset();
  }, [values, scale]); // eslint-disable-line react-hooks/exhaustive-deps

  let currentIndex = bufferIndex;

  const checkNotReachedGround = (): boolean => {
    // 0 as base line
    return currentIndex < points.length && points[currentIndex].y * scale >= 0;
  };

  // main animation starts here.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    let animationFrameId: number;
    // for storing the values when paused

    const animate = () => {
      if (checkNotReachedGround()) {
        render(ctx, animatingPoints[currentIndex], points[currentIndex]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        currentIndex += animationSpeedMain;
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setEnded(true);
      }
    };
    drawProjectilePath(ctx);

    if (isAnimating) {
      currentIndex = bufferIndex;

      animate();
    }

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isAnimating]); // eslint-disable-line react-hooks/exhaustive-deps

  // Function to draw the projectile path on the canvas
  function drawProjectilePath(ctx: CanvasRenderingContext2D) {
    if (animatingPoints.length == 0) return;

    ctx.beginPath();
    ctx.moveTo(animatingPoints[0].x, animatingPoints[0].y);
    for (let i = 1; i < animatingPoints.length; i++) {
      ctx.lineTo(animatingPoints[i].x, animatingPoints[i].y);
    }

    ctx.stroke();
  }

  const reset = () => {
    setEnded(false);
    setIsAnimating(false);
    setStarted(false);
    setBufferIndex(0);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    render(
      ctx,
      {
        ...points[0],
        x: values.objectPosition.x,
        y: values.objectPosition.y,
      },
      points[0]
    );
  };

  const renderVelocityArrows = (
    ctx: CanvasRenderingContext2D,
    currentPosition: { x: number; y: number },
    vx: number,
    vy: number
  ) => {
    // vx arrow:
    // drawArrowByAngle(ctx, currentPosition, 0, vx, 15, "green");
    drawArrow(
      ctx,
      currentPosition,
      { x: currentPosition.x + vx, y: currentPosition.y },
      10,
      "green"
    );

    // vy arrow:
    // drawArrowByAngle(ctx, currentPosition, -Math.PI / 2, vy, 15, "blue");
    drawArrow(
      ctx,
      currentPosition,
      { x: currentPosition.x, y: currentPosition.y - vy },
      10,
      "blue"
    );

    // resultant velocity arrow
    const resultantVelocity = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
    const resultantAngle = Math.atan(vy / vx);
    // console.log(resultantAngle);
    drawArrowByAngle(
      ctx,
      currentPosition,
      resultantAngle,
      resultantVelocity,
      15,
      "black"
    );
  };

  const renderArcOfAngle = (
    ctx: CanvasRenderingContext2D,
    currentPosition: { x: number; y: number },
    resultantAngle: number,
    vx: number
  ) => {
    // draw arc of angle
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(
      currentPosition.x,
      currentPosition.y,
      Math.min(35, vx),
      resultantAngle > 0 ? 0 : -resultantAngle,
      resultantAngle > 0 ? -resultantAngle : 0,
      true
    );
    ctx.stroke();

    // Draw the text (theta) just outside the arc

    const textX = currentPosition.x + 50; // Adjust the X-coordinate as needed
    const textY = currentPosition.y - (resultantAngle > 0 ? 20 : 10); // Keep it close to the arc
    ctx.font = "14px Arial"; // Adjust the font size and family as needed
    ctx.fillStyle = "black"; // Set the text color
    ctx.fillText(
      `${theta} : ${((resultantAngle * 180) / Math.PI).toFixed(1)}°`,
      textX,
      textY
    );
  };

  const renderAnnotations = (ctx: CanvasRenderingContext2D, point: Point) => {
    const { x, y, vx, vy } = point;
    const currentPosition = { x, y };

    const resultantAngle = Math.atan(vy / vx);

    renderVelocityArrows(ctx, currentPosition, vx, vy);
    renderArcOfAngle(ctx, currentPosition, resultantAngle, vx);
  };

  const renderLegends = (ctx: CanvasRenderingContext2D, point: Point) => {
    // this point value is the calculated value, not the position in the canvas.
    // feel safe to use :)
    const { x, y, vx, vy, t } = point;

    ctx.setLineDash([]);
    const leftLegends: LegendsType = [
      {
        text: "Initial Velocity",
        value: result.vi,
        unit: "m/s",
      },
      {
        text: "Initial Angle ",
        value: result.angle,
        unit: "°",
      },
    ];

    const rightLegends: LegendsType = [
      {
        text: "Time",
        value: t,
        unit: "s",
      },
      {
        text: "x",
        value: x,
        unit: "m",
      },
      {
        text: "y",
        value: y,
        unit: "m",
      },
      {
        text: "Vx",
        value: vx,
        unit: "m/s",
      },
      {
        text: "Vy",
        value: vy,
        unit: "m/s",
      },
      {
        text: "V",
        value: Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2)),
        unit: "m/s",
      },
    ];

    // Draw annotations
    ctx.font = "14px Arial";
    ctx.fillStyle = "black";

    // Draw left annotations
    leftLegends.forEach(({ text, value, unit }, index) => {
      ctx.fillText(
        `${text} :\t${value.toFixed(2)} ${unit}`,
        20,
        30 + 20 * index
      );
    });

    // Draw right annotations
    rightLegends.forEach(({ text, value, unit }, index) => {
      ctx.fillText(
        `${text} :  ${value.toFixed(2)} ${unit}`,
        ctx.canvas.width - 160,
        30 + 20 * index
      );
    });
  };

  const drawBallObject = (
    ctx: CanvasRenderingContext2D,
    { x, y }: { x: number; y: number }
  ) => {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x, y, objectSize, 0, 2 * Math.PI);
    ctx.fill();
  };
  const drawOuterStructure = (ctx: CanvasRenderingContext2D) => {
    // if initial height available
    ctx.fillStyle = "#c2b280";
    ctx.fillRect(
      0,
      INITIAL.canvasDimension.y - values.height,
      2 * objectSize,
      values.height
    );

    // draw dotted line to show the ground level for the ball object to fall
    ctx.strokeStyle = "black";
    ctx.setLineDash([15, 15]);
    ctx.moveTo(0, INITIAL.canvasDimension.y - objectSize);
    ctx.lineTo(
      INITIAL.canvasDimension.x,
      INITIAL.canvasDimension.y - objectSize
    );
    ctx.stroke();
    ctx.setLineDash([]);
    // // Draw h=0 annotation
    // ctx.fillStyle = "black";
    // ctx.font = "14px Arial";
    // ctx.fillText(
    //   `h=${values.height}`,
    //   15 * objectSize,
    //   INITIAL.canvasDimension.y - values.height / 2
    // );
  };

  const clearCanvas = (ctx: CanvasRenderingContext2D) => {
    // clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };
  const render = (
    ctx: CanvasRenderingContext2D,
    animatingPoint: Point,
    point: Point
  ) => {
    clearCanvas(ctx);
    drawOuterStructure(ctx);
    drawBallObject(ctx, animatingPoint);
    renderAnnotations(ctx, animatingPoint);
    renderLegends(ctx, point);
    drawProjectilePath(ctx);
  };

  // utility functions
  const start = () => {
    setIsAnimating(true);
    setStarted(true);
  };

  const motionControl = () => {
    if (!started) {
      start();
    } else {
      setBufferIndex(currentIndex);
      setIsAnimating(!isAnimating);
    }
  };

  const zoomIn = () => {
    setScale(scale * 1.2);
  };
  const zoomOut = () => {
    setScale(scale / 1.2);
  };

  //todo : fix this
  const resetZoom = () => {
    // setScale(calculateScale());
  };

  return (
    <div className="flex flex-col gap-4">
      <canvas
        ref={canvasRef}
        width={INITIAL.canvasDimension.x}
        height={INITIAL.canvasDimension.y}
      />
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-evenly gap-3">
          <div className="flex items-center gap-3">
            <button onClick={zoomIn} title="Zoom In">
              <ZoomInIcon />
            </button>

            <button onClick={zoomOut} title="Zoom Out">
              <ZoomOutIcon />
            </button>
            {/* <label htmlFor="scale">Zoom : {scale.toFixed(3)}x</label> */}
            <button onClick={resetZoom} title="Reset Zoom">
              <RotateCcw />
            </button>
          </div>
          <div className="grid place-items-center">
            <div className="flex gap-5 items-center">
              <Button
                variant="outline"
                size="icon"
                disabled={animationSpeed <= 0.25}
                onClick={() => {
                  if (animationSpeed > 0.25)
                    setAnimationSpeed((prev) => prev - 0.25);
                  setBufferIndex(currentIndex);
                  setIsAnimating(false);
                }}
              >
                {"<<"}
              </Button>
              <label htmlFor="speed">
                Speed : <b>{animationSpeed}x</b>{" "}
              </label>
              <Button
                variant="outline"
                size="icon"
                disabled={animationSpeed >= 2}
                onClick={() => {
                  if (animationSpeed <= 2)
                    setAnimationSpeed((prev) => prev + 0.25);
                  setBufferIndex(currentIndex);
                  setIsAnimating(false);
                }}
              >
                {">>"}{" "}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-stretch gap-6">
          <Button onClick={motionControl} disabled={ended} className="flex-1">
            {started ? (isAnimating ? "Pause" : "Resume") : "Start"}
          </Button>
          <Button onClick={reset} className="flex-1">
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectileMotion;
