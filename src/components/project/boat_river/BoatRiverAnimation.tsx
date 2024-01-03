import { useAtomValue } from "jotai";
import {
  ChevronsDown,
  ChevronsUp,
  Pause,
  Play,
  PlayCircle,
  RotateCcw,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import drawArrow, {
  renderArcOfAngle,
  renderVelocityArrows,
} from "~/lib/utils/CanvasUtils";
import {
  INITIAL,
  animatingPointsAtom,
  animationSpeedAtom,
  scaleAtom,
} from "./animationHelper";
import { boatRiverAtom, pointType } from "./store";

const BoatRiverAnimation = () => {
  const result = useAtomValue(boatRiverAtom);
  const scale = useAtomValue(scaleAtom);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [bufferIndex, setBufferIndex] = useState<number>(0);
  const [ctx, setContext] = useState<
    CanvasRenderingContext2D | null | undefined
  >(null);

  const animatingPoints = useAtomValue(animatingPointsAtom);

  let currentIndex = bufferIndex;
  const animationSpeed = useAtomValue(animationSpeedAtom);
  const [animationSpeedView, setAnimationSpeedView] = useState<number>(1); //can be 0.25, 0.5, 1,1.25. 1.5, 1.75, 2

  const reset = useCallback(() => {
    console.log("in reset", animatingPoints, currentIndex);
    if (!ctx) return;

    setEnded(false);
    setIsAnimating(false);
    setStarted(false);
    setBufferIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    currentIndex = 0;

    render(animatingPoints[currentIndex]);
  }, [animatingPoints, ctx]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    setContext(ctx);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    reset();
  }, [reset, result]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    let animationFrameId: number;
    // for storing the values when paused
    const animate = () => {
      if (currentIndex < animatingPoints.length) {
        render(animatingPoints[currentIndex]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        currentIndex += Math.ceil(4 * animationSpeedView * animationSpeed);
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setEnded(true);
        return;
      }
    };
    if (isAnimating) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      currentIndex = bufferIndex;
      animate();
    }

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isAnimating]); // eslint-disable-line react-hooks/exhaustive-deps

  // rendering functions

  const renderAnnotations = (
    ctx: CanvasRenderingContext2D,
    position: pointType
  ) => {
    // console.log(position, centerOfBoat);
    renderVelocityArrows(ctx, position, [
      {
        magnitude: result.vb * scale,
        angle: result.angle_i,
      },
      {
        magnitude: result.vs * scale,
        angle: 0,
      },
      {
        magnitude: result.v * scale,
        angle: result.angle_r,
      },
    ]);

    if (Math.abs(result.angle_i - 90) > 0.01)
      // initial velocity
      renderArcOfAngle(
        ctx,
        position,
        (result.angle_i * Math.PI) / 180,
        result.vb * scale,
        "ɑ"
      );

    if (Math.abs(result.angle_r - 90) > 0.01)
      // resultant velocity
      renderArcOfAngle(
        ctx,
        position,
        (result.angle_r * Math.PI) / 180,
        result.v * scale
      );
  };
  const drawBankAndRiver = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "#13bdb8";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // banks
    ctx.fillStyle = "#c2b280";
    ctx.fillRect(0, 0, INITIAL.bankSize.x, INITIAL.bankSize.y);
    ctx.fillRect(
      0,
      INITIAL.canvasDimension.y - INITIAL.bankSize.y,
      INITIAL.bankSize.x,
      INITIAL.bankSize.y
    );
  };
  const clearCanvas = (ctx: CanvasRenderingContext2D) => {
    // clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = "#000 ";
    ctx.setLineDash([]);
  };
  const drawBoat = (ctx: CanvasRenderingContext2D, position: pointType) => {
    const point: { x: number; y: number } = {
      x: position.x - INITIAL.boatSize.x / 4,
      y: position.y,
    };

    ctx.strokeStyle = "#000";
    // stroke size large
    ctx.lineWidth = 2.5;

    // bottom half rectangle
    ctx.strokeRect(
      point.x,
      point.y,
      INITIAL.boatSize.x / 2,
      INITIAL.boatSize.y / 2
    );

    // inner dotted line
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.moveTo(point.x, point.y + INITIAL.boatSize.y / 4);
    ctx.lineTo(
      point.x + INITIAL.boatSize.x / 2,
      point.y + INITIAL.boatSize.y / 4
    );
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.closePath();

    // small circle to show the center of the boat
    ctx.arc(position.x, position.y, 5, 0, 2 * Math.PI);
    ctx.fill();

    // right arc of front of the boat
    ctx.beginPath();
    ctx.arc(point.x, point.y, INITIAL.boatSize.x / 2, 0, -Math.PI / 3, true);
    ctx.stroke();
    ctx.closePath();

    // left arc of front of the boat
    ctx.beginPath();
    ctx.arc(
      point.x + INITIAL.boatSize.x / 2,
      point.y,
      INITIAL.boatSize.x / 2,
      (-2 * Math.PI) / 3,
      Math.PI,
      true
    );
    ctx.stroke();

    // reset stroke size
    ctx.lineWidth = 1;
  };

  const renderWidthAnnotation = (
    ctx: CanvasRenderingContext2D,
    width: number
  ) => {
    const leftCenterPosition = { x: 20, y: INITIAL.canvasDimension.y / 2 };

    // draw upper arrow
    drawArrow(
      ctx,
      {
        x: leftCenterPosition.x,
        y: leftCenterPosition.y - 20,
      },
      {
        x: leftCenterPosition.x,
        y: INITIAL.bankSize.y, // end of river
      },
      10,
      "black",
      true
    );

    drawArrow(
      ctx,
      {
        x: leftCenterPosition.x,
        y: leftCenterPosition.y + 20,
      },
      {
        x: leftCenterPosition.x,
        y: INITIAL.canvasDimension.y - INITIAL.bankSize.y, // end of river
      },
      10,
      "black",
      true
    );

    ctx.fillStyle = "#000";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText(
      `${width.toFixed(2)} m`,
      leftCenterPosition.x - 10,
      leftCenterPosition.y + 6
    );
  };
  const render = (currentPoint: pointType) => {
    if (!ctx || !currentPoint) return;

    clearCanvas(ctx);
    drawBankAndRiver(ctx);
    renderAnnotations(ctx, currentPoint);
    drawBoat(ctx, currentPoint);
    renderWidthAnnotation(ctx, result.dy);
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
                disabled={animationSpeedView <= 0.25}
                onClick={() => {
                  if (animationSpeedView > 0.25)
                    setAnimationSpeedView((prev) => prev - 0.25);
                  setBufferIndex(currentIndex);
                  setIsAnimating(false);
                }}
              >
                <ChevronsDown
                  color={animationSpeedView <= 0.5 ? "red" : "blue"}
                />
              </Button>
              <div className="w-28 text-center">
                Speed : <b>{animationSpeedView}x</b>
              </div>
              <Button
                variant="secondary"
                title="faster"
                size="icon"
                disabled={animationSpeedView >= 2}
                onClick={() => {
                  if (animationSpeedView <= 2)
                    setAnimationSpeedView((prev) => prev + 0.25);
                  setBufferIndex(currentIndex);
                  setIsAnimating(false);
                }}
              >
                <ChevronsUp
                  color={animationSpeedView >= 1.5 ? "red" : "blue"}
                />
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

export default BoatRiverAnimation;
