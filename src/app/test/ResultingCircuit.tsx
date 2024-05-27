import { useCallback } from "react";
import Breadboard from "./Breadboard";
import Resistor from "./Resistor";
import TerminalNodes from "./TerminalNode";
import WiresComponent from "./Wires";
import { StepsInfo } from "./store";

const ResultingCircuit = ({
  Circuit,
  Wires,
  removedResistances,
  resultingResistances,
  terminal1,
  terminal2,
}: StepsInfo) => {
  // calculate the portion required to show the circuit
  // and generate the breadboard accordingly

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
    const maxX = Math.max(...arrX) + 1;
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
    <Breadboard
      setPoint={() => {}}
      rangeForComponents={calculateCircuitRange()}
    >
      {Circuit.map((resistance, index) => (
        <Resistor key={index} R={resistance} onClick={() => {}} />
      ))}
      <WiresComponent WiresList={Wires} />

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
