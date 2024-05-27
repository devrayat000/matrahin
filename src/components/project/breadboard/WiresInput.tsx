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
import {
  HistoryAtom,
  RedoListAtom,
  ResistanceAllAtom,
  USER_ACTION,
  Wire,
  WiresAtom,
} from "../equi-resistance/store";
import { getCoordinatesById } from "../equi-resistance/utils";
import HighlightComponent from "./HighlightComponent";

const WiresInput = () => {
  const [selectedWire, setSelectedWire] = useState<number | null>(null);
  const [wireList, setWireList] = useAtom(WiresAtom);
  const setResistanceList = useSetAtom(ResistanceAllAtom);
  const setHistory = useSetAtom(HistoryAtom);
  const setRedoList = useSetAtom(RedoListAtom);

  const addResistance = useCallback(
    (node1: string, node2: string) => {
      setResistanceList((prev) => [
        ...prev,
        { name: `R${prev.length + 1}`, value: 1, node1, node2 },
      ]);
      setHistory((prev) => [
        ...prev,
        {
          action: USER_ACTION.ADD_RESISTANCE,
          params: { name: "temp", value: 1, node1, node2 },
        },
      ]);
      setRedoList([]);
    },
    [setResistanceList]
  );
  const handleWireRemove = useCallback(
    (wire: Wire, index: number) => {
      setWireList((prev) => prev.filter((_, i) => i !== index));
      setHistory((prev) => [
        ...prev,
        {
          action: USER_ACTION.REMOVE_WIRE,
          params: { ...wire },
        },
      ]);
      setRedoList([]);
    },
    [setWireList]
  );
  return wireList.map((wire, index) => {
    const start = getCoordinatesById(wire.start);
    const end = getCoordinatesById(wire.end);

    const handleWireClick = () => {
      if (selectedWire === index) setSelectedWire(null);
      else setSelectedWire(index);
    };

    return (
      <Popover
        key={index}
        open={selectedWire === index}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedWire(null);
        }}
      >
        <PopoverTrigger className="cursor-grab">
          <g onClick={handleWireClick}>
            <HighlightComponent
              start={start}
              end={end}
              isHighlighted={selectedWire === index}
            />
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="black"
              strokeWidth={2}
            />
          </g>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent side="top" className="w-fit pr-8">
            <div className="flex flex-row gap-3 items-center justify-between w-full ">
              <Button
                variant="success"
                onClick={() => {
                  setSelectedWire(null);
                  handleWireRemove(wire, index);
                  addResistance(wire.start, wire.end);
                }}
                className="flex  gap-3"
              >
                <RefreshCcw />
                Make Resistor
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setSelectedWire(null);
                  handleWireRemove(wire, index);
                }}
                className="flex  gap-3"
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

export default WiresInput;
