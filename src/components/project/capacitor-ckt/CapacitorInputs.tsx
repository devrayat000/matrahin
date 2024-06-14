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
import HighlightComponent from "../breadboard/HighlightComponent";
import Capacitor from "./Capacitor";
import { getCoordinatesById } from "../equi-resistance//utils";
import {
  Capacitance,
  CapacitanceAllAtom,
  CapacitorHistoryAtom,
  CapacitorRedoListAtom as RedoListAtom,
  USER_ACTION,
  WiresCapacitorAtom,
} from "./store";

const CapacitorInputs = () => {
  const [capacitanceList, setCapacitanceList] = useAtom(CapacitanceAllAtom);
  const [selectedR, setSelectedR] = useState<number | null>(null);
  const setHistory = useSetAtom(CapacitorHistoryAtom);
  const setRedoList = useSetAtom(RedoListAtom);
  const setWire = useSetAtom(WiresCapacitorAtom);
  const handleCapacitanceRemove = useCallback(
    (capacitance: Capacitance, index: number) => {
      setCapacitanceList((prev) => prev.filter((_, i) => i !== index));
      setHistory((prev) => [
        ...prev,
        {
          action: USER_ACTION.REMOVE_RESISTANCE,
          params: { ...capacitance },
        },
      ]);
      setRedoList([]);
    },
    [setCapacitanceList]
  );

  const handleRValueChange = useCallback(
    (capacitance: Capacitance, index: number, value: number) => {
      setCapacitanceList((prev) => {
        prev[index].value = value;
        return [...prev];
      });
    },
    [setCapacitanceList]
  );

  const addWire = useCallback(
    (node1: string, node2: string) => {
      setWire((prev) => [...prev, { start: node1, end: node2 }]);
      setHistory((prev) => [
        ...prev,
        {
          action: USER_ACTION.ADD_WIRE,
          params: { start: node1, end: node2 },
        },
      ]);
      setRedoList([]);
    },
    [setWire]
  );
  return capacitanceList.map((r, index) => {
    const start = getCoordinatesById(r.node1);
    const end = getCoordinatesById(r.node2);

    const handleCapacitorClick = () => {
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
          <g onClick={handleCapacitorClick}>
            <Capacitor
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
                    if (Number(e.target.value) < 0) return;
                    handleRValueChange(r, index, Number(e.target.value));
                  }}
                  min={0}
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
                  handleCapacitanceRemove(r, index);
                  addWire(r.node1, r.node2);
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
                  handleCapacitanceRemove(r, index);
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

export default CapacitorInputs;
