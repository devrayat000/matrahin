import { useAtomValue } from "jotai";
import { memo } from "react";
import Resistance from "./Resistor";
import { ResistanceAllAtom, WiresAtom } from "./store";
import { getCoordinatesById } from "./utils";

const Circuit = memo(() => {
  const ResistanceAll = useAtomValue(ResistanceAllAtom);
  const Wires = useAtomValue(WiresAtom);
  return (
    <>
      {ResistanceAll.map((resistance, index) => (
        <Resistance
          key={index}
          R={resistance}
          onClick={() => {
            // alert(index);
          }}
        />
      ))}
      {Wires.map((wire, index) => {
        const start = getCoordinatesById(wire.start);
        const end = getCoordinatesById(wire.end);
        return (
          <line
            key={index}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            style={{
              stroke: "black",
              strokeWidth: 2,
            }}
            onClick={() => {
              // alert(index);
            }}
          />
        );
      })}
    </>
  );
});

Circuit.displayName = "Circuit";

export default Circuit;
