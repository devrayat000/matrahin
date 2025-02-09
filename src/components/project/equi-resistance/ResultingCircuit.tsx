import { useCallback } from "react";
import Breadboard from "../breadboard/Breadboard";
import TerminalNodes from "../breadboard/TerminalNode";
import Resistor from "./Resistor";
import { StepsInfo } from "./store";
import { getCoordinatesById } from "./utils";

const ResultingCircuit = ({
  Circuit,
  Wires,
  removedResistances,
  resultingResistances,
  terminal1,
  terminal2,
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

  return (
    <Breadboard rangeForComponents={calculateCircuitRange()}>
      {Circuit.map((resistance, index) => (
        <Resistor key={index} R={resistance} onClick={() => {}} />
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
      {removedResistances.map((resistance, index) => (
        <Resistor key={index} R={resistance} onClick={() => {}} color="red" />
      ))}
      {resultingResistances.map((resistance, index) => (
        <Resistor key={index} R={resistance} onClick={() => {}} color="blue" />
      ))}

      <TerminalNodes terminals={[terminal1, terminal2]} />
    </Breadboard>
  );
};

export default ResultingCircuit;
