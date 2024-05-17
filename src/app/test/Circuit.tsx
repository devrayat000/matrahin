import { memo } from "react";
import ResistanceComponent from "./Resistor";

import { Resistance, Wire } from "./store";
import WiresComponent from "./Wires";

const Circuit = memo(
  ({
    ResistanceAll,
    Wires,
  }: {
    ResistanceAll: Resistance[];
    Wires: Wire[];
  }) => {
    return (
      <>
        {ResistanceAll.map((resistance, index) => (
          <ResistanceComponent
            key={index}
            R={resistance}
            onClick={() => {
              // alert(index);
            }}
          />
        ))}
        <WiresComponent WiresList={Wires} onClick={() => {}} />
      </>
    );
  }
);

Circuit.displayName = "Circuit";

export default Circuit;
