import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import Circuit from "./Circuit";
import Points from "./Points";
import {
  BreadboardInfoAtom,
  ComponentSelectedAtom,
  PointUsedAtom,
  ResistanceAllAtom,
  WiresAtom,
  currentPointAtom,
} from "./store";
import { getIndexFromPosition } from "./utils";

const InputCircuit = () => {
  const [currentPoint, setCurrentPoint] = useAtom(currentPointAtom);

  const [pointsUsed, setPointsUsed] = useAtom(PointUsedAtom);
  const ResistanceAll = useAtomValue(ResistanceAllAtom);
  const Wires = useAtomValue(WiresAtom);
  const ComponentSelectionType = useAtomValue(ComponentSelectedAtom);

  const setBreadboardInfo = useSetAtom(BreadboardInfoAtom);
  const setResistance = useSetAtom(ResistanceAllAtom);
  const setWires = useSetAtom(WiresAtom);

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
    <svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
      <Points setPoint={setPoint} />
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

      <Circuit ResistanceAll={ResistanceAll} Wires={Wires} />
      {/* to make clickable the points that have been used in Rs */}

      {pointsUsed.map((point, index) => (
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
  );
};

export default InputCircuit;
