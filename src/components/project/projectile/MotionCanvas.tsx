import { useAtom, useAtomValue } from "jotai";
import {
  ChevronsDown,
  ChevronsUp,
  Pause,
  Play,
  PlayCircle,
  RotateCcw,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { drawArrowByAngle } from "~/lib/utils/drawArrow";
import {
  GROUND_LEVEL_IN_CANVAS,
  INITIAL,
  MARGIN_X,
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

  const [ctx, setContext] = useState<
    CanvasRenderingContext2D | null | undefined
  >(null);
  const result = useAtomValue(projectileAtom)!;
  const [scale, setScale] = useAtom(scaleAtom);
  const points = useAtomValue(pointsAtom);
  const animatingPoints = useAtomValue(animatingPointsAtom);

  const [animationSpeed, setAnimationSpeed] = useState(1); // [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2
  const animationSpeedMain = useMemo(
    () => Math.floor(animationSpeed * 4 + scale * 4 * animationSpeed),
    [scale, animationSpeed]
  );

  const calculateScale = (maxRange: number) => {
    return (INITIAL.canvasDimension.x - 150) / maxRange;
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
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    console.log(ctx.globalAlpha);

    // const devicePixelRatio = window.devicePixelRatio || 1;

    // // // Scale the canvas based on the device pixel ratio
    // canvas.width = INITIAL.canvasDimension.x * devicePixelRatio;
    // canvas.height = INITIAL.canvasDimension.y * devicePixelRatio;

    // // Scale the context
    // ctx.scale(devicePixelRatio, devicePixelRatio);
    // ctx.imageSmoothingEnabled = false; // or true
    // ctx.imageSmoothingQuality = "high"; // or low
    setContext(ctx);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    setScale(calculateScale(result.xm));
  }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    reset();
  }, [scale]); // eslint-disable-line react-hooks/exhaustive-deps

  let currentIndex = bufferIndex;

  const checkNotReachedGround = (): boolean => {
    // 0 as base line
    return currentIndex < points.length && points[currentIndex].y * scale >= 0;
  };

  // main animation starts here.
  useEffect(() => {
    if (!ctx) return;

    let animationFrameId: number;
    // for storing the values when paused

    const animate = () => {
      if (checkNotReachedGround()) {
        render(animatingPoints[currentIndex], points[currentIndex]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        currentIndex += animationSpeedMain;
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setEnded(true);
      }
    };

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
    if (!ctx || animatingPoints.length == 0) return;

    ctx.beginPath();
    ctx.setLineDash([4, 4]);
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

    if (!ctx) return;

    render(
      {
        ...points[0],
        x: values.objectPosition.x,
        y: values.objectPosition.y,
      },
      points[0]
    );
  };

  /**
   * @brief Renders the velocity arrows on the canvas
   *        velocity magnitude is scaled by the scale factor of the canvas
   *
   * @param ctx context of the canvas
   * @param currentPosition
   * @param vx
   * @param vy
   */
  const renderVelocityArrows = (
    ctx: CanvasRenderingContext2D,
    currentPosition: { x: number; y: number },
    vx: number,
    vy: number
  ) => {
    // vx arrow:
    drawArrowByAngle(ctx, currentPosition, 0, vx * scale, 15, "green");

    // vy arrow:
    drawArrowByAngle(
      ctx,
      currentPosition,
      (Math.PI / 2) * (vy > 0 ? 1 : -1),
      Math.abs(vy * scale),
      15,
      "blue"
    );

    // resultant velocity arrow
    const resultantVelocity = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
    const resultantAngle = Math.atan(vy / vx);

    drawArrowByAngle(
      ctx,
      currentPosition,
      resultantAngle,
      resultantVelocity * scale,
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
    // this point is the position in the canvas.

    if (!point) return;
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
        `${text} :\t${value.toFixed(1)} ${unit}`,
        120,
        30 + 20 * index
      );
    });

    // Draw right annotations
    rightLegends.forEach(({ text, value, unit }, index) => {
      ctx.fillText(
        `${text} :  ${value.toFixed(1)} ${unit}`,
        ctx.canvas.width - 160,
        30 + 20 * index
      );
    });
  };

  const drawBallObject = (
    ctx: CanvasRenderingContext2D,
    { x, y }: { x: number; y: number }
  ) => {
    ctx.fillStyle = "#0033ff";
    ctx.beginPath();
    ctx.arc(x, y, objectSize, 0, 2 * Math.PI);
    ctx.fill();
  };
  const drawOuterStructure = (ctx: CanvasRenderingContext2D) => {
    // if initial height available
    ctx.fillStyle = "#c2b280";
    ctx.fillRect(
      0,
      INITIAL.canvasDimension.y - (values.height + GROUND_LEVEL_IN_CANVAS),
      2 * objectSize,
      values.height
    );

    drawGroundLevel(ctx);

    // // Draw h=0 annotation
    // ctx.fillStyle = "black";
    // ctx.font = "14px Arial";
    // ctx.fillText(
    //   `h=${values.height}`,
    //   15 * objectSize,
    //   INITIAL.canvasDimension.y - values.height / 2
    // );
  };

  const drawGroundLevel = (ctx: CanvasRenderingContext2D) => {
    const offset: number = objectSize + GROUND_LEVEL_IN_CANVAS;
    const roadWidth: number = 10;
    // creating road-like view for the ground level
    ctx.setLineDash([]);
    ctx.fillStyle = "#aaaaaa";
    ctx.fillRect(
      0,
      INITIAL.canvasDimension.y - offset - roadWidth,
      INITIAL.canvasDimension.x,
      roadWidth * 2
    );

    ctx.strokeStyle = "#000";
    // middle dotted line ground level for the ball object to fall
    ctx.beginPath();
    ctx.setLineDash([15, 15]);
    ctx.moveTo(0, INITIAL.canvasDimension.y - offset);
    ctx.lineTo(INITIAL.canvasDimension.x, INITIAL.canvasDimension.y - offset);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = "black";
  };
  const clearCanvas = (ctx: CanvasRenderingContext2D) => {
    // clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = "#000 ";
    ctx.setLineDash([]);
  };

  const renderScaleX = (ctx: CanvasRenderingContext2D) => {
    const scaleHeight = 10;
    const scaleGap = 90;
    const scaleStart = MARGIN_X;
    const scaleEnd = ctx.canvas.width;
    const scaleTextY = ctx.canvas.height - 10;
    const scaleTextSize = 14;

    ctx.fillStyle = "black";
    ctx.font = `${scaleTextSize}px "Times New Roman"`;

    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(scaleStart, scaleTextY);
    ctx.lineTo(scaleEnd, scaleTextY);
    ctx.stroke();

    for (let i = scaleStart; i <= scaleEnd; i += scaleGap) {
      ctx.beginPath();
      ctx.moveTo(i, scaleTextY);
      ctx.lineTo(i, scaleTextY - scaleHeight);
      ctx.stroke();
      ctx.fillText(
        `${((i - MARGIN_X) / scale).toFixed(0)}`,
        i - 5,
        scaleTextY - scaleHeight - 5
      );
    }
  };

  const renderScaleY = (ctx: CanvasRenderingContext2D) => {
    const scaleHeight = 10;
    const scaleGap = 90;
    const scaleStart = ctx.canvas.height - GROUND_LEVEL_IN_CANVAS - objectSize;
    const scaleEnd = 0;
    const scaleTextX = 10;
    const scaleTextSize = 14;

    ctx.fillStyle = "black";
    ctx.font = `${scaleTextSize}px "Times New Roman"`;

    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(scaleTextX, scaleStart);
    ctx.lineTo(scaleTextX, scaleEnd);
    ctx.stroke();

    for (let i = scaleStart; i >= scaleEnd; i -= scaleGap) {
      ctx.beginPath();
      ctx.moveTo(scaleTextX, i);
      ctx.lineTo(scaleTextX + scaleHeight, i);
      ctx.stroke();
      ctx.fillText(
        `${((scaleStart - i) / scale).toFixed(0)}`,
        scaleTextX + scaleHeight + 5,
        i + 5
      );
    }
  };

  const render = (animatingPoint: Point, point: Point) => {
    if (!ctx) return;
    clearCanvas(ctx);
    drawOuterStructure(ctx);
    drawBallObject(ctx, animatingPoint);
    renderAnnotations(ctx, animatingPoint);
    renderLegends(ctx, point);
    drawProjectilePath(ctx);
    renderScaleX(ctx);
    renderScaleY(ctx);
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

  // const zoomIn = () => {
  //   setScale((scale) => scale * 1.15);
  // };
  // const zoomOut = () => {
  //   setScale((scale) => scale / 1.15);
  // };

  // const resetZoom = () => {
  //   setScale(calculateScale(result.xm));
  // };

  // todo: use this later

  // const ZoomControl: React.FC = () => {
  //   return (
  //     <>
  //       <div className="flex items-center  gap-3">
  //         <button onClick={zoomIn} title="Zoom In">
  //           <ZoomInIcon />
  //         </button>

  //         <button onClick={zoomOut} title="Zoom Out">
  //           <ZoomOutIcon />
  //         </button>
  //         <button onClick={resetZoom} title="Reset Zoom">
  //           <RotateCcw />
  //         </button>
  //       </div>
  //     </>
  //   );
  // };

  return (
    <div className="flex flex-col gap-4 mb-2">
      <canvas
        ref={canvasRef}
        width={INITIAL.canvasDimension.x}
        height={INITIAL.canvasDimension.y}
      />
      <div className="flex flex-row justify-evenly gap-3">
        <div className="flex items-center justify-evenly gap-3">
          {/* <ZoomControl /> */}
          <div className="grid place-items-center">
            <div className="flex gap-5 items-center">
              <Button
                title="slower"
                id="speed"
                variant="secondary"
                size="icon"
                disabled={animationSpeed <= 0.25}
                onClick={() => {
                  if (animationSpeed > 0.25)
                    setAnimationSpeed((prev) => prev - 0.25);
                  setBufferIndex(currentIndex);
                  setIsAnimating(false);
                }}
              >
                <ChevronsDown color={animationSpeed <= 0.5 ? "red" : "blue"} />
              </Button>
              <div className="w-28 text-center">
                Speed : <b>{animationSpeed}x</b>
              </div>
              <Button
                variant="secondary"
                title="faster"
                size="icon"
                disabled={animationSpeed >= 2}
                onClick={() => {
                  if (animationSpeed <= 2)
                    setAnimationSpeed((prev) => prev + 0.25);
                  setBufferIndex(currentIndex);
                  setIsAnimating(false);
                }}
              >
                <ChevronsUp color={animationSpeed >= 1.5 ? "red" : "blue"} />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-stretch gap-6">
          <Button
            onClick={motionControl}
            disabled={ended}
            className="flex-1"
            title={started ? (isAnimating ? "Pause" : "Resume") : "Start"}
          >
            {started ? isAnimating ? <Pause /> : <Play /> : <PlayCircle />}
          </Button>
          <Button
            onClick={reset}
            variant="destructive"
            title="Reset"
            className="flex-1"
          >
            <RotateCcw />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectileMotion;
