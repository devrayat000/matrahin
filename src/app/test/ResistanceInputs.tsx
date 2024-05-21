import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "~/components/ui/popover";

import { useAtom, useSetAtom } from "jotai";
import { MinusCircle, RefreshCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "~/components/ui/button";
import HighlightComponent from "./HighlightComponent";
import Resistor from "./Resistor";
import { Resistance, ResistanceAllAtom, WiresAtom } from "./store";
import { getCoordinatesById } from "./utils";

const ResistanceInputs = () => {
  const [resistanceList, setResistanceList] = useAtom(ResistanceAllAtom);
  const [selectedR, setSelectedR] = useState<number | null>(null);
  const setWire = useSetAtom(WiresAtom);
  const handleResistanceRemove = useCallback(
    (resistance: Resistance, index: number) => {
      setResistanceList((prev) => prev.filter((_, i) => i !== index));
    },
    [setResistanceList]
  );

  const handleRValueChange = useCallback(
    (resistance: Resistance, index: number, value: number) => {
      setResistanceList((prev) => {
        prev[index].value = value;
        return [...prev];
      });
    },
    [setResistanceList]
  );

  const addWire = useCallback(
    (node1: string, node2: string) =>
      setWire((prev) => [...prev, { start: node1, end: node2 }]),
    [setWire]
  );
  return resistanceList.map((r, index) => {
    const start = getCoordinatesById(r.node1);
    const end = getCoordinatesById(r.node2);

    const handleResistorClick = () => {
      if (selectedR === index) setSelectedR(null);
      else setSelectedR(index);
    };

    return (
      <Popover
        key={index}
        open={selectedR === index}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedR(null);
        }}
      >
        <PopoverTrigger className="cursor-grab">
          <g onClick={handleResistorClick}>
            <Resistor
              R={r}
              onClick={() => {}}
              color={selectedR === index ? "blue" : "black"}
            />
            <HighlightComponent
              start={start}
              end={end}
              isHighlighted={selectedR === index}
            />
          </g>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent side="top" className="w-fit pr-10 pt-10">
            <div className="flex flex-col  sm:flex-row  items-center justify-between w-fit gap-4 text-lg  ">
              <div className="flex flex-row items-center   justify-between w-full gap-2">
                <p>{r.name}:</p>
                <input
                  onChange={(e) => {
                    handleRValueChange(r, index, Number(e.target.value));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSelectedR(null);
                    }
                  }}
                  type="number"
                  className="w-24 p-2 py-1 border rounded-md border-slate-900"
                  value={r.value === 0 ? "" : r.value}
                />
              </div>

              <Button
                variant="success"
                onClick={() => {
                  setSelectedR(null);
                  addWire(r.node1, r.node2);
                  handleResistanceRemove(r, index);
                }}
                className="flex  gap-3 w-full"
              >
                <RefreshCcw />
                Make Wire
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setSelectedR(null);
                  handleResistanceRemove(r, index);
                }}
                className="flex  gap-3  w-full"
              >
                <MinusCircle />
                Remove
              </Button>
            </div>
            <PopoverClose />
            <PopoverArrow />
          </PopoverContent>
        </PopoverPortal>
      </Popover>
    );
  });
};

export default ResistanceInputs;
