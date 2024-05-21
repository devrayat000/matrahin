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
  return (
    <Breadboard setPoint={() => {}}>
      {Circuit.map((resistance, index) => (
        <Resistor
          key={index}
          R={resistance}
          onClick={() => {
            // alert(index);
          }}
        />
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
