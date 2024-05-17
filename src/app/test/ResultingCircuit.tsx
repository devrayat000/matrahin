import Points from "./Points";
import Resistor from "./Resistor";
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
    <svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
      <Points setPoint={() => {}} />
      {Circuit.map((resistance, index) => (
        <Resistor
          key={index}
          R={resistance}
          onClick={() => {
            // alert(index);
          }}
        />
      ))}
      <WiresComponent WiresList={Wires} onClick={() => {}} />

      {removedResistances.map((resistance, index) => (
        <Resistor key={index} R={resistance} onClick={() => {}} color="red" />
      ))}
      {resultingResistances.map((resistance, index) => (
        <Resistor key={index} R={resistance} onClick={() => {}} color="blue" />
      ))}
    </svg>
  );
};

export default ResultingCircuit;
