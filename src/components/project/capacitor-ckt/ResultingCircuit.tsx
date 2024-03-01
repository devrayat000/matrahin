import { useCallback } from "react";
import Breadboard from "../breadboard/Breadboard";
<<<<<<< HEAD
import { getCoordinatesById } from "../equi-resistance/utils";
import Capacitor from "./Capacitor";
import VoltageSourceComp from "./VoltageSource";
=======
import TerminalNodes from "../breadboard/TerminalNode";
import { getCoordinatesById } from "../equi-resistance/utils";
import Capacitor from "./Capacitor";
>>>>>>> dffe9c0 (Equivalent Capacitor done)
import { StepsInfo } from "./store";

const ResultingCircuit = ({
  Circuit,
  Wires,
  removedCapacitances,
  resultingCapacitances,
<<<<<<< HEAD
  VoltageSource: vSource,
=======
  terminal1,
  terminal2,
>>>>>>> dffe9c0 (Equivalent Capacitor done)
}: StepsInfo) => {
  const getX = useCallback(
    (node: string) => Number(node.split("h")[0].split("__")[0]),
    []
  );
  const getY = useCallback(
    (node: string) => Number(node.split("h")[0].split("__")[1]),
    []
  );

  const calculateCircuitRange = () => {
    const arrX = [
      ...Circuit.flatMap((r) => [getX(r.node1), getX(r.node2)]),
      ...Wires.flatMap((w) => [getX(w.start), getX(w.end)]),
    ];

    const arrY = [
      ...Circuit.flatMap((r) => [getY(r.node1), getY(r.node2)]),
      ...Wires.flatMap((w) => [getY(w.start), getY(w.end)]),
    ];

    const minX = Math.min(...arrX) - 1;
    const maxX = Math.max(...arrX) + 3; // + 2 to show the label of the R
    const minY = Math.min(...arrY) - 1;
    const maxY = Math.max(...arrY) + 1;

    return {
      minX,
      maxX,
      minY,
      maxY,
    };
  };
<<<<<<< HEAD
  return (
    <Breadboard rangeForComponents={calculateCircuitRange()}>
      {Circuit.map((c, index) => (
        <Capacitor key={index} R={c} onClick={() => {}} />
=======

  return (
    <Breadboard rangeForComponents={calculateCircuitRange()}>
      {Circuit.map((resistance, index) => (
        <Capacitor key={index} R={resistance} onClick={() => {}} />
>>>>>>> dffe9c0 (Equivalent Capacitor done)
      ))}

      {/* Wires */}
      {Wires.map((wire, index) => {
        const start = getCoordinatesById(wire.start);
        const end = getCoordinatesById(wire.end);

        return (
          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="black"
            strokeWidth={2}
          />
        );
      })}
      {removedCapacitances.map((resistance, index) => (
        <Capacitor key={index} R={resistance} onClick={() => {}} color="red" />
      ))}
      {resultingCapacitances.map((resistance, index) => (
        <Capacitor key={index} R={resistance} onClick={() => {}} color="blue" />
      ))}

<<<<<<< HEAD
      <VoltageSourceComp R={vSource} onClick={() => {}} color="black" />
=======
      <TerminalNodes terminals={[terminal1, terminal2]} />
>>>>>>> dffe9c0 (Equivalent Capacitor done)
    </Breadboard>
  );
};

export default ResultingCircuit;
