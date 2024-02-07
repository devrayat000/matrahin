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
  PlusSquare,
  Timer,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { pendulumStore } from "./store";

// const PendulumResults = forwardRef<PendulumResultRefs>(({}, ref) => {
const PendulumResults = ({
  angleResultRef,
  velocityResultRef,
  accelarationResultRef,
  heightResultRef,
  potentialEnergyResultRef,
  kineticEnergyResultRef,
  totalEnergyResultRef,
  periodCounterRef,
}: {
  angleResultRef: React.RefObject<HTMLParagraphElement>;
  velocityResultRef: React.RefObject<HTMLParagraphElement>;
  accelarationResultRef: React.RefObject<HTMLParagraphElement>;
  heightResultRef: React.RefObject<HTMLParagraphElement>;
  potentialEnergyResultRef: React.RefObject<HTMLParagraphElement>;
  kineticEnergyResultRef: React.RefObject<HTMLParagraphElement>;
  totalEnergyResultRef: React.RefObject<HTMLParagraphElement>;
  periodCounterRef: React.RefObject<HTMLParagraphElement>;
}) => {
  const [resultShowingLive, setResultShowingLive] = useAtom(
    pendulumStore.resultShowingLiveAtom
  );

  const angle = useAtomValue(pendulumStore.angleAtom);
  const length = useAtomValue(pendulumStore.lengthAtom);
  const mass = useAtomValue(pendulumStore.massAtom);
  const gravity = useAtomValue(pendulumStore.gravityAtom);

  //   const angleResultRef = useRef<HTMLParagraphElement>(null);
  //   const velocityResultRef = useRef<HTMLParagraphElement>(null);
  //   const accelarationResultRef = useRef<HTMLParagraphElement>(null);
  //   const heightResultRef = useRef<HTMLParagraphElement>(null);
  //   const potentialEnergyResultRef = useRef<HTMLParagraphElement>(null);
  //   const kineticEnergyResultRef = useRef<HTMLParagraphElement>(null);
  //   const totalEnergyResultRef = useRef<HTMLParagraphElement>(null);

  //   useImperativeHandle(ref, () => ({
  //     angleResultRef,
  //     velocityResultRef,
  //     accelarationResultRef,
  //     heightResultRef,
  //     potentialEnergyResultRef,
  //     kineticEnergyResultRef,
  //     totalEnergyResultRef,
  //   }));
  const [currentAngle, setCurrentAngle] = useState(angle);
  /**
   * chosen colors:
   * #fbeec1
   * #05386b
   * #2f4454
   * #b4dfe5
   * #a1c3d1
   */
  const resultStyle =
    "flex flex-row justify-between flex-wrap items-center gap-1 m-3 font-mono rounded-xl  text-white  shadow-[0_5px_10px_rgb(0,0,0,0.4)] bg-[#2f4454] p-3 px-4";

  const velocityAtAngle = useMemo(
    () =>
      // √(2gl(1-cos(θ))
      Math.sqrt(
        2 *
          gravity *
          length *
          (Math.cos((currentAngle * Math.PI) / 180) -
            Math.cos((angle * Math.PI) / 180))
      ),
    [length, currentAngle, angle, gravity]
  );
  const accelarationAtAngle = useMemo(
    () =>
      // gsin(θ)
      gravity * Math.sin((currentAngle * Math.PI) / 180),
    [currentAngle, gravity]
  );

  const heightAtAngle = useMemo(
    () =>
      // l(1-cos(θ))
      length * (1 - Math.cos((currentAngle * Math.PI) / 180)),
    [length, currentAngle]
  );

  const potentialEnergyAtAngle = useMemo(
    () =>
      // mgh
      mass * gravity * heightAtAngle,
    [mass, gravity, heightAtAngle]
  );

  const kineticEnergyAtAngle = useMemo(
    () =>
      // 1/2mv^2
      0.5 * mass * velocityAtAngle ** 2,
    [mass, velocityAtAngle]
  );

  const totalEnergyAtAngle = useMemo(
    () =>
      // mgh + 1/2mv^2
      potentialEnergyAtAngle + kineticEnergyAtAngle,
    [potentialEnergyAtAngle, kineticEnergyAtAngle]
  );
  return (
    <div className="w-full   flex-col  rounded-lg   items-center border-gray-950">
      {/* <div className="w-full lg:w-5/6  flex-col border-2 rounded-lg bg-[#42b6c5]  items-center border-gray-950"> */}
      <p className="text-center text-3xl pt-3">Results</p>
      <div className="flex flex-row items-center pt-2 justify-between gap-2 px-4">
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
      {/* angle */}
      <div className={resultStyle}>
        <DraftingCompass />
        <p>Angle </p>
        <div className="flex flex-row items-center justify-between gap-1">
          {resultShowingLive ? (
            <p
              className={cn(
                "font-bold w-[5ch] text-center",
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

      {/* velocity  */}
      <div className={resultStyle}>
        <Gauge />
        <p>Velocity </p>
        <div className="flex flex-row items-center justify-between gap-1">
          <p
            className="font-bold w-[5ch]"
            ref={resultShowingLive ? velocityResultRef : undefined}
          >
            {velocityAtAngle.toFixed(4)}
          </p>
          <p>m/s</p>
        </div>
      </div>

      {/* accelaration */}
      <div className={resultStyle}>
        <GaugeCircle />
        <p>Acceleration </p>
        <div className="flex flex-row items-center justify-between gap-1">
          <p
            className="font-bold w-[5ch]"
            ref={resultShowingLive ? accelarationResultRef : undefined}
          >
            {accelarationAtAngle.toFixed(4)}
          </p>
          <p>
            m/s<sup>2</sup>
          </p>
        </div>
      </div>

      {/* height */}
      <div className={resultStyle}>
        <MoveUp />
        <p>Height </p>
        <div className="flex flex-row items-center justify-between gap-1">
          <p
            className="font-bold w-[5ch]"
            ref={resultShowingLive ? heightResultRef : undefined}
          >
            {heightAtAngle.toFixed(4)}
          </p>
          <p>cm</p>
        </div>
      </div>

      {/* Potential Energy */}
      <div className={resultStyle}>
        <DatabaseZap />
        <p className="text-left">Potential Energy </p>
        <div className="flex flex-row items-center justify-between gap-1">
          <p
            className="font-bold w-[8ch]"
            ref={resultShowingLive ? potentialEnergyResultRef : undefined}
          >
            {potentialEnergyAtAngle.toFixed(4)}
          </p>
          <p>J</p>
        </div>
      </div>

      {/* Kinetic Energy */}
      <div className={resultStyle}>
        <LineChart />
        <p>Kinetic Energy </p>
        <div className="flex flex-row items-center justify-between gap-1">
          <p
            className="font-bold  w-[8ch]"
            ref={resultShowingLive ? kineticEnergyResultRef : undefined}
          >
            {kineticEnergyAtAngle.toFixed(4)}
          </p>
          <p>m</p>
        </div>
      </div>

      {/* Total Energy */}
      <div className={resultStyle}>
        <Zap />
        <p>Total Energy </p>
        <div className="flex flex-row items-center justify-between gap-1">
          <p
            className="font-bold w-[8ch]"
            ref={resultShowingLive ? totalEnergyResultRef : undefined}
          >
            {totalEnergyAtAngle.toFixed(4)}
          </p>
          <p>J</p>
        </div>
      </div>

      {resultShowingLive && (
        <div className="flex flex-row justify-between flex-wrap items-center gap-1 m-3 font-mono rounded-xl  text-white  shadow-[0_5px_10px_rgb(0,0,0,0.4)] bg-[#2f4454] p-3 px-4">
          <Timer />
          <p>Time Period </p>
          <div className="flex flex-row items-center justify-between gap-1">
            <p
              className="font-bold w-[4ch]"
              ref={resultShowingLive ? periodCounterRef : undefined}
            >
              0
            </p>
            <p>s</p>
          </div>
        </div>
      )}
      {/* results done */}
    </div>
  );
};

export default PendulumResults;
