import { useEffect, useMemo, useRef, useState } from "react";
import drawArrow, { drawArrowByAngle } from "~/lib/utils/drawArrow";

import { Button } from "~/components/ui/button";
import { useAtom, useAtomValue } from "jotai";
import { pointsAtom, projectileAtom } from "./store";
//var CanvasJSReact = require('@canvasjs/react-charts');

// constants
// scale is used to scale the velocity of boat
const scale = 0.1;

const objectSize = 10; //radius
export const INITIAL = {
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

const ProjectileMotion = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [bufferIndex, setBufferIndex] = useState(0);
  const [points, setPoints] = useAtom(pointsAtom);
  const result = useAtomValue(projectileAtom)!;

  const values = useMemo(
    () => ({
      objectPosition: {
        x: objectSize,
        y: 400 - objectSize - result.yi,
      },
      objectSpeed: {
        magnitude: result.vi,
        angle: (result.angle * Math.PI) / 180,
      },
      height: result.yi,
    }),
    [result]
  );

  useEffect(() => {
    reset();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    reset();
  }, [values]); // eslint-disable-line react-hooks/exhaustive-deps
  let currentIndex = bufferIndex;
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    let animationFrameId: number;
    // for storing the values when paused

    const animate = () => {
      if (
        currentIndex < points.length &&
        points[currentIndex].y >= objectSize
      ) {
        // console.log(points[currentIndex].y, canvas.height - objectSize);
        const { x, y, vx, vy, t } = points[currentIndex];
        render(ctx, canvas, x, canvas.height - y, vx, vy, t);
        currentIndex += animationSpeed * 4;
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setEnded(true);
      }
    };
    drawProjectilePath(ctx, canvas, points);

    if (isAnimating) {
      currentIndex = bufferIndex;
      animate();
    }

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isAnimating]); // eslint-disable-line react-hooks/exhaustive-deps

  // rendering functions
  // Function to simulate the projectile motion
  function simulateProjectileEquation(
    initialVelocity: number,
    launchAngle: number,
    initialHeight: number,
    timeStep: number
  ) {
    const g = 9.8; // Acceleration due to gravity (m/s^2)
    const radians = launchAngle;
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
      vy = initialVelocity * sinTheta - result.g * t;
      points.push({
        x: x * scale + objectSize,
        y: y * scale + objectSize,
        vx: vx,
        vy: vy,

        t: t,
      });
    }

    return points;
  }

  // Function to draw the projectile path on the canvas
  function drawProjectilePath(
    ctx: CanvasRenderingContext2D,
    canvas = ctx.canvas,
    points: { x: number; y: number }[]
  ) {
    if (points.length == 0) return;
    // console.log(points);
    ctx.beginPath();
    ctx.moveTo(points[0].x, canvas.height - points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, canvas.height - points[i].y);
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
    drawBallObject(ctx, values.objectPosition.x, values.objectPosition.y);
    // drawPath(ctx, canvas);
    // values.objectSpeed = { ...INITIAL.objectSpeed };

    const pointsCalculated = calculatePoints();
    drawProjectilePath(ctx, canvas, pointsCalculated);
    renderAnnotations(
      ctx,
      values.objectPosition.x,
      values.objectPosition.y,
      pointsCalculated[0].vx,
      pointsCalculated[0].vy,
      pointsCalculated[0].t
    );
  };

  const calculatePoints = () => {
    // Example usage
    const initialVelocity = values.objectSpeed.magnitude;
    const launchAngle = values.objectSpeed.angle; // in radians
    const initialHeight = values.height / scale; // in meters
    const timeStep = 0.05; // in seconds
    const points = simulateProjectileEquation(
      initialVelocity,
      launchAngle,
      initialHeight,
      timeStep
    );
    console.log(points);
    setPoints(points);
    return points;
  };
  const renderAnnotations = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    vx: number,
    vy: number,
    t: number
  ) => {
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
      50,
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
    ctx.fillText(`Initial Velocity: ${values.objectSpeed.magnitude}`, 20, 40);

    // ctx.fillText(`g : ${properties.g}m/s^2`, ctx.canvas.width - 160, 20);
    ctx.fillText(
      `Radius of Ball : ${objectSize} m`,
      ctx.canvas.width - 160,
      40
    );

    // Draw time annotation
    ctx.fillText(`Time: ${t.toFixed(2)} s`, ctx.canvas.width - 160, 60);
    // Draw range annotation
    ctx.fillText(`x: ${x.toFixed(2)} m`, ctx.canvas.width - 160, 80);

    // Draw height annotation
    ctx.fillText(
      `y: ${(ctx.canvas.height - y).toFixed(2)} m`,
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
    x: number,
    y: number,
    vx: number,
    vy: number,
    t: number
  ) => {
    drawOuterStructure(ctx, canvas);
    drawBallObject(ctx, x, y);
    renderAnnotations(ctx, x, y, vx, vy, t);
    drawProjectilePath(ctx, canvas, points);
  };

  const drawBallObject = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ) => {
    ctx.fillStyle = "red";
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
    // ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    // ctx.stroke();

    // if initial height available
    ctx.fillStyle = "#c2b280";
    ctx.fillRect(
      0,
      INITIAL.canvasDimension.y - values.height,
      2 * objectSize,
      values.height
    );

    // Draw angle annotation
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText(
      `h=${values.height}`,
      2.5 * objectSize,
      INITIAL.canvasDimension.y - values.height / 2
    );
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

  return (
    <div className="flex flex-col gap-4">
      <canvas
        ref={canvasRef}
        width={INITIAL.canvasDimension.x}
        height={INITIAL.canvasDimension.y}
      />
      <div className="flex flex-col gap-3">
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
              Animation Speed : <b>{animationSpeed}x</b>{" "}
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
