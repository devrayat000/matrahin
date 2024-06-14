import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useRef } from "react";
import Breadboard from "../breadboard/Breadboard";
import CapacitanceInputs from "./CapacitorInputs";
import VoltageInput from "./VoltageInput";
import WiresInput from "./WiresInput";
import {
  CapacitanceAllAtom,
  CapacitorComponentSelectedAtom,
  CapacitorHistoryAtom,
  PointsUsedCapacitorAtom,
  CapacitorRedoListAtom as RedoListAtom,
  USER_ACTION,
  VoltageSource,
  VoltageSourceCapacitorAtom,
  Wire,
  WiresCapacitorAtom,
  currentPointCapacitorAtom,
} from "./store";
import { getPointFromIndex } from "./utils";

const InputCircuit = () => {
  const [currentPoint, setCurrentPoint] = useAtom(currentPointCapacitorAtom);
  const setHistory = useSetAtom(CapacitorHistoryAtom);
  const setRedoList = useSetAtom(RedoListAtom);
  const pointsUsed = useAtomValue(PointsUsedCapacitorAtom);
  const ComponentSelectionType = useAtomValue(CapacitorComponentSelectedAtom);

  const setVSource = useSetAtom(VoltageSourceCapacitorAtom);
  const setCapacitance = useSetAtom(CapacitanceAllAtom);
  const setWires = useSetAtom(WiresCapacitorAtom);

  const resistanceCount = useRef(0);

  const setPoint = useCallback(
    (point: { x: number; y: number }) => {
      if (ComponentSelectionType === "none") {
        //todo: show alert as toast
        // alert("Please select a component first");
        return;
      }

      if (currentPoint.x === -1) {
        setCurrentPoint({ ...point });
        return;
      }

      // check if same point is clicked
      if (currentPoint.x === point.x && currentPoint.y === point.y) {
        setCurrentPoint({ x: -1, y: -1 });
        return;
      }

      if (ComponentSelectionType === "v") {
        const voltageSource: VoltageSource = {
          node1: `${currentPoint.x}__${currentPoint.y}`,
          node2: `${point.x}__${point.y}`,
          value: 1,
        };
        setVSource({ ...voltageSource });
        setHistory((history) => [
          ...history,
          {
            action: USER_ACTION.ADD_VOLTAGE_SOURCE,
            params: { ...voltageSource },
          },
        ]);
        // setRedoList([]);
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
        // setRedoList([]);
      } else if (ComponentSelectionType === "C") {
        resistanceCount.current++;
        setCapacitance((resistances) => [
          ...resistances,
          {
            name: `C${resistanceCount.current}`,
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
              name: `C${resistanceCount.current}`,
              value: 1,
              node1: `${currentPoint.x}__${currentPoint.y}`,
              node2: `${point.x}__${point.y}`,
            },
          },
        ]);
      }
      setRedoList([]);

      setCurrentPoint({ x: -1, y: -1 });
    },
    [currentPoint, setCapacitance, setCurrentPoint]
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

      {/* <TerminalPoints /> */}
      <VoltageInput />
      <CapacitanceInputs />

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
