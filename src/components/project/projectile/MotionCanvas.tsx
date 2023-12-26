import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import drawArrow, { drawArrowByAngle } from "~/lib/utils/drawArrow";

import { useAtomValue } from "jotai";
import { RotateCcw, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Point, projectileAtom } from "./store";

// constants

type INITIAL_CONSTANTS = {
  canvasDimension: {
    x: number;
    y: number;
  };
};

const objectSize = 5; //radius
const INITIAL: INITIAL_CONSTANTS = {
  canvasDimension: {
    x: 700,
    y: 400,
  },
  //   objectPosition: {
  //     x: objectSize,
  //     y: 400 - objectSize - properties.height,
  //   },
  //   objectSpeed: {
  //     angle: (properties.velocity.angle * Math.PI) / 180, //in radians
  //     dx:
  //       properties.velocity.magnitude *
  //       scale *
  //       Math.cos((properties.velocity.angle * Math.PI) / 180),
  //     dy:
  //       properties.velocity.magnitude *
  //       scale *
  //       Math.sin((properties.velocity.angle * Math.PI) / 180),
  //   },
};

const theta = "θ";

export interface ProjectileMotionProps {}
type modifiedValues = {
  objectPosition: {
    x: number;
    y: number;
  };
  objectSpeed: {
    magnitude: number;
    angle: number;
  };
  height: number;
};
const ProjectileMotion = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [bufferIndex, setBufferIndex] = useState(0);
  // const [points, setPoints] = useAtom(pointsAtom);

  const result = useAtomValue(projectileAtom)!;

  const calculateScale = useCallback(
    (): number => (INITIAL.canvasDimension.x - 50) / result.xm,
    [result]
  );
  const [scale, setScale] = useState(calculateScale());
  const [animationSpeed, setAnimationSpeed] = useState(1); // [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2
  const zoomScale = useMemo(
    () => Math.floor(animationSpeed * 4 + scale * 4 * animationSpeed),
    [scale, animationSpeed]
  );

  // change zoom scale when input and result changes
  useEffect(() => {
    setScale(calculateScale());
  }, [result, calculateScale]);

  // an utility function to modify the points to show in the canvas
  const modifyPoints = useCallback(
    (x: number, y: number): { x: number; y: number } => {
      // modify points to show in the canvas
      // eslint-disable-next-line prefer-const
      x = x * scale + objectSize;
      y = INITIAL.canvasDimension.y - y * scale - objectSize;
      return { x, y };
    },
    [scale]
  );
  // computed values from result
  const values: modifiedValues = useMemo(() => {
    const objectPosition = modifyPoints(0, result.yi);

    return {
      objectPosition: objectPosition,
      objectSpeed: {
        magnitude: result.vi,
        angle: (result.angle * Math.PI) / 180,
      },
      height: result.yi,
    };
  }, [result, modifyPoints]);

  const calculatePoints = useCallback(() => {
    // Example usage
    const initialVelocity = values.objectSpeed.magnitude;
    const initialHeight = values.height / scale; // in meters
    const timeStep = 0.05 / (10 * scale); // in seconds

    const g = result.g; // Acceleration due to gravity (m/s^2)
    const radians = values.objectSpeed.angle; // in radians;
    const cosTheta = Math.cos(radians);
    const tanTheta = Math.tan(radians);
    const sinTheta = Math.sin(radians);
    const v0squared = Math.pow(initialVelocity, 2);

    let x = 0,
      y = 0,
      vx = 0,
      vy = 0;

    const points = [];

    for (let t = 0; y >= 0; t += timeStep) {
      x = initialVelocity * cosTheta * t;
      y =
        x * tanTheta -
        (g * Math.pow(x, 2)) / (2 * v0squared * Math.pow(cosTheta, 2)) +
        initialHeight;
      vx = initialVelocity * cosTheta;
      vy = initialVelocity * sinTheta - g * t;
      points.push({ x, y, vx, vy, t });
    }
    return points;
  }, [values, result, scale]);

  const points: Point[] = useMemo(() => {
    const points = calculatePoints();
    return points;
  }, [calculatePoints]);

  const animatingPoints: Point[] = useMemo(
    () =>
      points.map((p) => ({
        ...p,
        x: p.x * scale + objectSize,
        y: INITIAL.canvasDimension.y - p.y * scale - objectSize,
      })),
    [points, scale]
  );

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
        render(ctx, canvas, animatingPoints[currentIndex]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        currentIndex += zoomScale;
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
    const tempPoints = animatingPoints;
    if (points.length == 0) return;
    ctx.beginPath();
    ctx.moveTo(tempPoints[0].x, tempPoints[0].y);
    for (let i = 1; i < tempPoints.length; i++) {
      ctx.lineTo(tempPoints[i].x, tempPoints[i].y);
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawOuterStructure(ctx, canvas);
    drawBallObject(ctx, {
      x: values.objectPosition.x,
      y: values.objectPosition.y,
    });

    const pointsCalculated = calculatePoints();
    drawProjectilePath(ctx);
    renderAnnotations(ctx, {
      ...pointsCalculated[0],
      x: values.objectPosition.x,
      y: values.objectPosition.y,
    });
  };

  const renderAnnotations = (ctx: CanvasRenderingContext2D, point: Point) => {
    const { x, y, vx, vy, t } = point;
    const currentPosition = { x, y };
    // const magnitude = values.objectSpeed.magnitude;

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

    // draw dotted line from center of the ball to the end of the canvas
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(values.objectPosition.x, values.objectPosition.y);
    ctx.lineTo(INITIAL.canvasDimension.x, values.objectPosition.y);
    ctx.stroke();
    // draw dotted line to show the ground level for the ball object to fall
    ctx.moveTo(0, INITIAL.canvasDimension.y - objectSize);
    ctx.lineTo(
      INITIAL.canvasDimension.x,
      INITIAL.canvasDimension.y - objectSize
    );
    ctx.stroke();
    ctx.setLineDash([]);

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

    // Draw angle annotation
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText(
      `Angle: ${((values.objectSpeed.angle * 180) / Math.PI).toFixed(2)}°`,
      20,
      20
    );

    // Draw velocity annotation
    ctx.fillText(
      `Initial Velocity: ${values.objectSpeed.magnitude.toFixed(2)} m/s`,
      20,
      40
    );

    // not needed
    // // ctx.fillText(`g : ${properties.g}m/s^2`, ctx.canvas.width - 160, 20);
    // ctx.fillText(
    //   `Radius of Ball : ${objectSize} m`,
    //   ctx.canvas.width - 160,
    //   40
    // );

    // Draw time annotation
    ctx.fillText(`Time: ${t.toFixed(2)} s`, ctx.canvas.width - 160, 60);
    // Draw range annotation
    ctx.fillText(
      `x: ${((x - objectSize) / scale).toFixed(2)} m`,
      ctx.canvas.width - 160,
      80
    );

    // Draw height annotation
    ctx.fillText(
      `y: ${((ctx.canvas.height - y - objectSize) / scale).toFixed(2)} m`,
      ctx.canvas.width - 160,
      100
    );

    // Draw velocity annotation

    ctx.fillText(`Vx: ${vx.toFixed(2)} m/s`, ctx.canvas.width - 160, 100 + 20);
    ctx.fillText(`Vy: ${vy.toFixed(2)} m/s`, ctx.canvas.width - 160, 100 + 40);
    ctx.fillText(
      `V: ${resultantVelocity.toFixed(2)} m/s`,
      ctx.canvas.width - 160,
      160
    );
  };

  const render = (
    ctx: CanvasRenderingContext2D,
    canvas = ctx.canvas,
    point: Point
  ) => {
    drawOuterStructure(ctx, canvas);
    drawBallObject(ctx, point);
    renderAnnotations(ctx, point);
    drawProjectilePath(ctx);
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
  const drawOuterStructure = (
    ctx: CanvasRenderingContext2D,
    canvas = ctx.canvas
  ) => {
    // complete canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // if initial height available
    ctx.fillStyle = "#c2b280";
    ctx.fillRect(
      0,
      INITIAL.canvasDimension.y - values.height,
      2 * objectSize,
      values.height
    );

    // // Draw h=0 annotation
    // ctx.fillStyle = "black";
    // ctx.font = "14px Arial";
    // ctx.fillText(
    //   `h=${values.height}`,
    //   15 * objectSize,
    //   INITIAL.canvasDimension.y - values.height / 2
    // );
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
    setScale((prev) => prev * 1.2);
  };
  const zoomOut = () => {
    setScale((prev) => prev / 1.2);
  };

  const resetZoom = () => {
    setScale(calculateScale());
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
