"use client";

import { useAtom, useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import { cn } from "~/lib/utils";
import Circuit from "./Circuit";
import {
  BreadboardInfoAtom,
  ComponentSelectedAtom,
  ResistanceAllAtom,
  WiresAtom,
  currentPointAtom,
} from "./store";

const offset = 20;
const getIndexFromPosition = (x: number, y: number) => {
  return {
    i: Math.floor((x - offset) / 30),
    j: Math.floor((y - offset) / 30),
  };
};

const Page = () => {
  const [currentPoint, setCurrentPoint] = useAtom(currentPointAtom);

  const [PointsUsed, setPointsUsed] = useState<{ x: number; y: number }[]>([]);
  const setBreadboardInfo = useSetAtom(BreadboardInfoAtom);
  const setResistance = useSetAtom(ResistanceAllAtom);

  const setWires = useSetAtom(WiresAtom);
  const [ComponentSelectionType, setComponentSelectionType] = useAtom(
    ComponentSelectedAtom
  );

  const setPoint = useCallback(
    (point: { x: number; y: number }) => {
      if (currentPoint.x === -1) {
        setCurrentPoint(point);
        return;
      }

      // check if same point is clicked
      if (currentPoint.x === point.x && currentPoint.y === point.y) {
        setCurrentPoint({ x: -1, y: -1 });
        return;
      }

      setPointsUsed((points) => [...points, currentPoint, point]);

      if (ComponentSelectionType === "wire") {
        setWires((wires) => [
          ...wires,
          {
            start: `${currentPoint.x}__${currentPoint.y}`,
            end: `${point.x}__${point.y}`,
          },
        ]);
      } else if (ComponentSelectionType === "R") {
        setResistance((resistances) => [
          ...resistances,
          {
            name: `R${resistances.length + 1}`,
            value: 1,
            node1: `${currentPoint.x}__${currentPoint.y}`,
            node2: `${point.x}__${point.y}`,
          },
        ]);
      }
      setBreadboardInfo((info) => {
        const newInfo = [...info];
        const currentIndex = getIndexFromPosition(
          currentPoint.x,
          currentPoint.y
        );
        const pointIndex = getIndexFromPosition(point.x, point.y);
        newInfo[currentIndex.i][currentIndex.j] = ComponentSelectionType;
        newInfo[pointIndex.i][pointIndex.j] = ComponentSelectionType;
        return newInfo;
      });

      setCurrentPoint({ x: -1, y: -1 });
    },
    [currentPoint, setResistance, setCurrentPoint]
  );
  return (
    <div className=" grid grid-cols-5  ">
      <div className="flex flex-col gap-3 items-center justify-start p-3 text-center">
        <div
          className={cn(
            "bg-slate-300 border border-slate-950 w-full p-5 m-2 font-mono text-3xl cursor-pointer",
            ComponentSelectionType === "R" && "bg-slate-950 text-white"
          )}
          onClick={() => setComponentSelectionType("R")}
        >
          Resistor
        </div>
        <div
          className={cn(
            "bg-slate-300 border border-slate-950 w-full p-5 m-2 font-mono text-3xl cursor-pointer",
            ComponentSelectionType === "wire" && "bg-slate-950 text-white"
          )}
          onClick={() => setComponentSelectionType("wire")}
        >
          Wire
        </div>
      </div>
      <div className="w-full col-span-3 m-auto ">
        <svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 20 }, (_, i) =>
            Array.from({ length: 12 }, (_, j) => (
              <g
                key={i * 10 + j}
                onClick={(e) => {
                  setPoint({
                    x: i * 30 + offset,
                    y: j * 30 + offset,
                  });
                }}
                style={{ cursor: "pointer" }}
                opacity={0.1}
              >
                <circle
                  cx={i * 30 + offset}
                  cy={j * 30 + offset}
                  r={15}
                  fill="white"
                />
                <circle
                  cx={i * 30 + offset}
                  cy={j * 30 + offset}
                  id="breadboardCircle"
                  r={10}
                  fill="white"
                  stroke="black"
                  strokeWidth={1.5}
                />
                <circle
                  cx={i * 30 + offset}
                  cy={j * 30 + offset}
                  r={5}
                  opacity={10}
                  fill="black"
                />
              </g>
            ))
          )}
          {currentPoint.x !== -1 && (
            <circle
              cx={currentPoint.x}
              cy={currentPoint.y}
              r={8}
              fill="blue"
              style={{ cursor: "pointer" }}
              onClick={() => setCurrentPoint({ x: -1, y: -1 })}
            />
          )}
          <Circuit />
          {/* to make clickable the points that have been used in Rs */}
          {PointsUsed.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={5}
              fill="black"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setPoint(point);
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default Page;
