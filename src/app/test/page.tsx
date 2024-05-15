"use client";

import { useAtom, useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import Circuit from "./Circuit";
import { ResistanceAllAtom, currentPointAtom } from "./store";

const Page = () => {
  const offset = 20;

  const [currentPoint, setCurrentPoint] = useAtom(currentPointAtom);

  const [PointsUsed, setPointsUsed] = useState<{ x: number; y: number }[]>([]);
  const setResistance = useSetAtom(ResistanceAllAtom);
  const setPoint = useCallback(
    (point: { x: number; y: number }) => {
      if (currentPoint.x === -1) {
        setCurrentPoint(point);
      } else {
        setPointsUsed((points) => [...points, currentPoint, point]);
        setResistance((resistances) => [
          ...resistances,
          {
            name: `${currentPoint.x}__${currentPoint.y}___${point.x}__${point.y}`,
            value: 1,
            node1: `${currentPoint.x}__${currentPoint.y}`,
            node2: `${point.x}__${point.y}`,
          },
        ]);
        setCurrentPoint({ x: -1, y: -1 });
      }
    },
    [currentPoint, setResistance, setCurrentPoint]
  );
  return (
    <div className="w-2/3 h-[50vh] m-auto mt-5 ">
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
  );
};

export default Page;
