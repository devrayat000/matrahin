import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import Breadboard from "./Breadboard";
import ResistanceInputs from "./ResistanceInputs";
import TerminalPoints from "./TerminalPointsInput";
import WiresInput from "./WiresInput";
import {
  ComponentSelectedAtom,
  PointsUsedAtom,
  ResistanceAllAtom,
  TerminalsAtom,
  WiresAtom,
  currentPointAtom,
} from "./store";

const InputCircuit = () => {
  const [currentPoint, setCurrentPoint] = useAtom(currentPointAtom);

  const pointsUsed = useAtomValue(PointsUsedAtom);
  const ComponentSelectionType = useAtomValue(ComponentSelectedAtom);

  const setTerminals = useSetAtom(TerminalsAtom);
  const setResistance = useSetAtom(ResistanceAllAtom);
  const setWires = useSetAtom(WiresAtom);

  const setPoint = useCallback(
    (point: { x: number; y: number }) => {
      if (ComponentSelectionType === "none") {
        //todo: show alert as toast
        // alert("Please select a component first");
        return;
      }

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
    <Breadboard setPoint={setPoint}>
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

      <ResistanceInputs />

      <WiresInput />

      {Array.from(pointsUsed).map((point, index) => (
        <g
          cursor="pointer"
          onClick={() => {
            setPoint({ ...point });
          }}
          key={index}
        >
          <circle cx={point.x} cy={point.y} r={5} fill="black" />
          {/* prevent pop up */}
          <circle cx={point.x} cy={point.y} r={10} fill="white" opacity={0} />
        </g>
      ))}
    </Breadboard>
  );
};

export default InputCircuit;
