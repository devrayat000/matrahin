import { useAtomValue } from "jotai";
import { memo } from "react";
import Resistance from "./Resistor";
import { ResistanceAllAtom } from "./store";

const Circuit = memo(() => {
  const ResistanceAll = useAtomValue(ResistanceAllAtom);

  return ResistanceAll.map((resistance, index) => (
    <Resistance
      key={index}
      R={resistance}
      onClick={() => {
        // alert(index);
      }}
    />
  ));
});

Circuit.displayName = "Circuit";

export default Circuit;
