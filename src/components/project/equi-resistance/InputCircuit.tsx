import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useRef } from "react";
import Breadboard from "../breadboard/Breadboard";
import ResistanceInputs from "./ResistanceInputs";
import TerminalPoints from "./TerminalPointsInput";
import WiresInput from "./WiresInput";
import {
  ComponentSelectedAtom,
  HistoryAtom,
  PointsUsedAtom,
  RedoListAtom,
  ResistanceAllAtom,
  TerminalsAtom,
  USER_ACTION,
  Wire,
  WiresAtom,
  currentPointAtom,
} from "./store";
import { getPointFromIndex } from "./utils";

const InputCircuit = () => {
  const [currentPoint, setCurrentPoint] = useAtom(currentPointAtom);
  const setHistory = useSetAtom(HistoryAtom);
  const setRedoList = useSetAtom(RedoListAtom);
  const pointsUsed = useAtomValue(PointsUsedAtom);
  const ComponentSelectionType = useAtomValue(ComponentSelectedAtom);

  const setTerminals = useSetAtom(TerminalsAtom);
  const setResistance = useSetAtom(ResistanceAllAtom);
  const setWires = useSetAtom(WiresAtom);

  const resistanceCount = useRef(0);

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
        else setCurrentPoint({ ...point });

        return;
      }

      // check if same point is clicked
      if (currentPoint.x === point.x && currentPoint.y === point.y) {
        setCurrentPoint({ x: -1, y: -1 });
        return;
      }

      if (ComponentSelectionType === "wire") {
        const newWire: Wire = {
          start: `${currentPoint.x}__${currentPoint.y}`,
          end: `${point.x}__${point.y}`,
        };
        setWires((wires) => [...wires, { ...newWire }]);
        setHistory((history) => [
          ...history,
          {
            action: USER_ACTION.ADD_WIRE,
            params: { ...newWire },
          },
        ]);
        setRedoList([]);
      } else if (ComponentSelectionType === "R") {
        resistanceCount.current++;
        setResistance((resistances) => [
          ...resistances,
          {
            name: `R${resistanceCount.current}`,
            value: 1,
            node1: `${currentPoint.x}__${currentPoint.y}`,
            node2: `${point.x}__${point.y}`,
          },
        ]);
        setHistory((history) => [
          ...history,
          {
            action: USER_ACTION.ADD_RESISTANCE,
            params: {
              name: `R${resistanceCount.current}`,
              value: 1,
              node1: `${currentPoint.x}__${currentPoint.y}`,
              node2: `${point.x}__${point.y}`,
            },
          },
        ]);
        setRedoList([]);
      }

      setCurrentPoint({ x: -1, y: -1 });
    },
    [currentPoint, setResistance, setCurrentPoint]
  );

  return (
    <Breadboard setPoint={setPoint}>
      {currentPoint.x !== -1 && (
        <circle
          cx={getPointFromIndex(currentPoint.x)}
          cy={getPointFromIndex(currentPoint.y)}
          r={8}
          fill="blue"
          cursor="pointer"
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
          <circle
            cx={getPointFromIndex(point.x)}
            cy={getPointFromIndex(point.y)}
            r={5}
            fill="black"
          />
          {/* prevent pop up */}
          <circle
            cx={getPointFromIndex(point.x)}
            cy={getPointFromIndex(point.y)}
            r={10}
            fill="white"
            opacity={0}
          />
        </g>
      ))}
    </Breadboard>
  );
};

export default InputCircuit;
