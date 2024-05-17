import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import Circuit from "./Circuit";
import Points from "./Points";
import TerminalPoints from "./TerminalPointsInput";
import {
  ComponentSelectedAtom,
  PointUsedAtom,
  ResistanceAllAtom,
  TerminalsAtom,
  WiresAtom,
  currentPointAtom,
} from "./store";

const InputCircuit = () => {
  const [currentPoint, setCurrentPoint] = useAtom(currentPointAtom);

  const [pointsUsed, setPointsUsed] = useAtom(PointUsedAtom);
  const ResistanceAll = useAtomValue(ResistanceAllAtom);
  const Wires = useAtomValue(WiresAtom);
  const ComponentSelectionType = useAtomValue(ComponentSelectedAtom);

  const setTerminals = useSetAtom(TerminalsAtom);
  const setResistance = useSetAtom(ResistanceAllAtom);
  const setWires = useSetAtom(WiresAtom);

  const setPoint = useCallback(
    (point: { x: number; y: number }) => {
      if (currentPoint.x === -1) {
        if (ComponentSelectionType === "t1")
          setTerminals((terminals) => [`${point.x}__${point.y}`, terminals[1]]);
        else if (ComponentSelectionType === "t2")
          setTerminals((terminals) => [terminals[0], `${point.x}__${point.y}`]);
        else setCurrentPoint(point);

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

      setCurrentPoint({ x: -1, y: -1 });
    },
    [currentPoint, setResistance, setCurrentPoint]
  );
  return (
    <svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg">
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

      <TerminalPoints />

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
