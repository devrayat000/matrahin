import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  drawElectron,
  drawMetalBars,
  drawTube,
  generateNewElectrons,
} from "./CanvasUtils";
import {
  AccelerationFactor,
  ELECTRON_CHARGE,
  ELECTRON_MASS,
  LightInputAtom,
  PlusLeftAtom,
  VoltageAtom,
  WorkFunctionAtom,
  hc,
} from "./store";

const TubeCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  const plusLeft = useAtomValue(PlusLeftAtom);
  const voltageAtomValue = useAtomValue(VoltageAtom);
  const voltage = useMemo(
    () => (plusLeft ? -voltageAtomValue : voltageAtomValue),
    [plusLeft, voltageAtomValue]
  );
  const { intensity, wavelength } = useAtomValue(LightInputAtom);
  const electronsRef = useRef<{ x: number; y: number; v: number }[]>([]);

  const workFunction = useAtomValue(WorkFunctionAtom);
  const energyOfLight = (hc * 10 ** 9) / wavelength;
  const workFunctionInJoules = workFunction * ELECTRON_CHARGE;
  let velocityOfElectron =
    energyOfLight > workFunctionInJoules
      ? Math.sqrt(
          (2 * (energyOfLight - workFunctionInJoules)) / ELECTRON_MASS
        ) / 100000
      : 0;

  const acceleration = useMemo(
    () => (AccelerationFactor * voltage) / 5000000000,
    [voltage]
  );
  useEffect(() => {
    if (ref.current) {
      const canvas = ref.current;
      const ctx = canvas.getContext("2d");
      drawTube(ctx);
      drawMetalBars(ctx);
    }
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const canvas = ref.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;
    let animationFrameId: number;
    let animationFrameCount = 0;

    const animate = () => {
      ctx.clearRect(0, 0, 1000, 1000);
      drawTube(ctx);
      drawMetalBars(ctx);
      animateElectrons(ctx, electronsRef.current);
      generateNewElectrons(electronsRef.current, intensity, velocityOfElectron);

      animationFrameCount++;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [voltage, intensity, wavelength]);

  const animateElectrons = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      electrons: { x: number; y: number; v: number }[]
    ) => {
      if (electrons.length === 0) return;
      for (let i = 0; i < electrons.length; i++) {
        if (electrons[i].v !== 0)
          drawElectron(ctx, electrons[i].x, electrons[i].y);
        electrons[i].x = electrons[i].x + electrons[i].v;
        electrons[i].v = electrons[i].v + acceleration;
        if (electrons[i].x > 900 || electrons[i].x < 100) {
          electrons.splice(i, 1);
        }
      }
    },
    [acceleration]
  );

  return <canvas ref={ref} id="tubeCanvas" width="1000" height="1000" />;
};

export default TubeCanvas;
