"use client";

import { useAtom, useAtomValue } from "jotai";
import {
  DatabaseZap,
  DraftingCompass,
  Gauge,
  GaugeCircle,
  LineChart,
  MinusSquare,
  MoveUp,
  Pi,
  PlusSquare,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import Pendulum from "./Pendulum";
import { pendulumStore } from "./store";

// const PendulumResults = forwardRef<PendulumResultRefs>(({}, ref) => {
const PendulumResults = ({
  pendulumRef,
}: {
  pendulumRef: React.RefObject<Pendulum>;
}) => {
  const [resultShowingLive, setResultShowingLive] = useAtom(
    pendulumStore.resultShowingLiveAtom
  );

  // refs for showing results live
  const angleResultRef = useRef<HTMLParagraphElement>(null);
  const velocityResultRef = useRef<HTMLParagraphElement>(null);
  const accelarationResultRef = useRef<HTMLParagraphElement>(null);
  const heightResultRef = useRef<HTMLParagraphElement>(null);
  const potentialEnergyResultRef = useRef<HTMLParagraphElement>(null);
  const kineticEnergyResultRef = useRef<HTMLParagraphElement>(null);
  const totalEnergyResultRef = useRef<HTMLParagraphElement>(null);

  const animating = useAtomValue(pendulumStore.isPlayingAtom);

  const timeCounter = useRef(0);
  const timeInterval = 100;
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (animating) {
      interval = setInterval(() => {
        timeCounter.current += timeInterval / 1000;

        if (angleResultRef.current) {
          angleResultRef.current.innerText =
            (((pendulumRef.current?.angle ?? 0) * 180) / Math.PI).toFixed(2) ||
            "0";
        }

        if (velocityResultRef.current) {
          velocityResultRef.current.innerText =
            pendulumRef.current?.velocity.toFixed(2) || "0";
        }

        if (accelarationResultRef.current) {
          accelarationResultRef.current.innerText =
            pendulumRef.current?.accelaration.toFixed(2) || "0";
        }

        if (heightResultRef.current) {
          heightResultRef.current.innerText =
            (pendulumRef.current?.height * 100).toFixed(2) || "0";
        }

        if (potentialEnergyResultRef.current) {
          potentialEnergyResultRef.current.innerText =
            pendulumRef.current?.potentialEnergy.toFixed(2) || "0";
        }

        if (kineticEnergyResultRef.current) {
          kineticEnergyResultRef.current.innerText =
            pendulumRef.current?.kineticEnergy.toFixed(2) || "0";
        }
      }, timeInterval);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [animating]);

  const angle = useAtomValue(pendulumStore.angleAtom);
  const length = useAtomValue(pendulumStore.lengthAtom);
  const mass = useAtomValue(pendulumStore.massAtom);
  const gravity = useAtomValue(pendulumStore.gravityAtom);

  const [currentAngle, setCurrentAngle] = useState(angle);

  useEffect(() => {
    setCurrentAngle(angle);
  }, [angle]);
  /**
   * chosen colors:
   * #fbeec1
   * #05386b
   * #2f4454
   * #b4dfe5
   * #a1c3d1
   */
  const resultStyle =
    "flex flex-row justify-between   mx-3 p-3 px-4 my-2 flex-wrap items-center lg:gap-1   font-mono rounded-xl  text-white  shadow-[0_5px_10px_rgb(0,0,0,0.4)] bg-[#2f4454]";

  const resultParams = useMemo(
    () => [
      {
        label: "Height",
        value: 100 * length * (1 - Math.cos((currentAngle * Math.PI) / 180)), // l(1-cos(θ))
        unit: "cm",
        ref: heightResultRef,
        icon: <MoveUp />,
      },
      {
        label: "Velocity",
        value: Math.sqrt(
          2 *
            gravity *
            length *
            (Math.cos((currentAngle * Math.PI) / 180) -
              Math.cos((angle * Math.PI) / 180))
        ), // √(2gl(1-cos(θ))
        unit: "m/s",
        ref: velocityResultRef,
        icon: <Gauge />,
      },
      {
        label: "Acceleration",
        value: gravity * Math.sin((currentAngle * Math.PI) / 180), // gsin(θ)
        unit: "m/s²",
        ref: accelarationResultRef,
        icon: <GaugeCircle />,
      },
      {
        label: "Potential Energy",
        value:
          mass *
          gravity *
          length *
          (1 - Math.cos((currentAngle * Math.PI) / 180)), // mgh
        unit: "J",
        ref: potentialEnergyResultRef,
        icon: <DatabaseZap />,
      },

      // adding this makes ui visually unstable for mobile devices

      {
        label: "Kinetic Energy",
        value:
          mass *
          gravity *
          length *
          (Math.cos((currentAngle * Math.PI) / 180) -
            Math.cos((angle * Math.PI) / 180)), // 1/2mv^2 = mgl(cos(alpha) -cos(θ))
        unit: "J",
        ref: kineticEnergyResultRef,
        icon: <LineChart />,
      },
      {
        label: "Total Energy",
        value:
          mass * gravity * length * (1 - Math.cos((angle * Math.PI) / 180)), // mgl(1-cos(alpha))
        unit: "J",
        ref: undefined,
        icon: <Pi />,
      },
    ],
    [angle, currentAngle, length, mass, gravity]
  );

  return (
    <div className="w-full   flex-col  rounded-lg   items-center border-gray-950">
      {/* <div className="w-full lg:w-5/6  flex-col border-2 rounded-lg bg-[#42b6c5]  items-center border-gray-950"> */}
      <p className="text-center text-3xl ">Results</p>
      <div className="flex flex-row items-center pt-2 mx-5  lg:mx-4 justify-between gap-2 lg:px-4">
        {/* result options goes here */}
        <Button
          onClick={() => setResultShowingLive(true)}
          className={cn(
            resultShowingLive
              ? "bg-[#2f4454] text-white"
              : "bg-slate-100 text-black",
            "hover:text-black hover:shadow-2xl hover:bg-[#a1c6e2] rounded-xl"
          )}
        >
          Live
        </Button>
        <Button
          onClick={() => setResultShowingLive(false)}
          className={cn(
            !resultShowingLive
              ? "bg-[#2f4454] text-white"
              : "bg-slate-100 text-black",
            "hover:text-black hover:shadow-2xl hover:bg-[#a1c6e2] rounded-xl"
          )}
        >
          At Angle (°)
        </Button>
      </div>
      {/* angle input */}
      <div className={resultStyle}>
        <DraftingCompass />
        <p>Angle </p>
        <div className="flex flex-row items-center justify-between gap-1">
          {resultShowingLive ? (
            <p
              className={cn(
                "font-bold w-[7ch] text-center",
                !resultShowingLive ? "hidden" : "visible"
              )}
              ref={angleResultRef}
            >
              {angle}
            </p>
          ) : (
            <div className="flex flex-row items-center justify-between gap-1">
              <button
                disabled={currentAngle === -Math.abs(angle)}
                onMouseDown={() => {
                  setCurrentAngle((prev) => prev - 1);
                }}
                // className="bg-red-500 px-3 text-white p-1 rounded-xl"
                className="  disabled:opacity-50 "
              >
                <MinusSquare />
              </button>
              <input
                onChange={(e) => {
                  setCurrentAngle(Number(e.target.value));
                }}
                className="text-black w-[4em] px-2 h-8 border rounded-xl disabled:opacity-50 "
                min={-Math.abs(angle)}
                max={Math.abs(angle)}
                type="number"
                value={currentAngle}
              />
              <button
                disabled={currentAngle === Math.abs(angle)}
                onClick={() => {
                  setCurrentAngle((prev) => prev + 1);
                }}
                // className="bg-green-500 px-3 text-white p-1 rounded-xl  disabled:opacity-50 "
                className="  disabled:opacity-50 "
              >
                <PlusSquare />
              </button>
            </div>
          )}
          <p>°</p>
        </div>
      </div>

      {resultParams.map((param, index) => (
        <div key={index} className={resultStyle}>
          <div>{param.icon}</div>
          <p>{param.label}</p>
          <div className="flex flex-row items-center justify-between gap-1">
            <p
              className="font-bold w-[8ch]"
              ref={resultShowingLive ? param.ref : undefined}
            >
              {param.value.toFixed(2)}
            </p>
            <p>{param.unit}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendulumResults;
