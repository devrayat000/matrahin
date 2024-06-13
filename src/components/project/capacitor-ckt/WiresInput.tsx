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
import {
  CapacitanceAllAtom,
  CapacitorHistoryAtom,
  CapacitorRedoListAtom,
  USER_ACTION,
  Wire,
  WiresCapacitorAtom,
} from "./store";
import { getCoordinatesById } from "./utils";

const WiresInput = () => {
  const [selectedWire, setSelectedWire] = useState<number | null>(null);
  const [wireList, setWireList] = useAtom(WiresCapacitorAtom);


  const setCapacitorList = useSetAtom(CapacitanceAllAtom);
  const setHistory = useSetAtom(CapacitorHistoryAtom);
  const setRedoList = useSetAtom(CapacitorRedoListAtom);

  const addCapacitor = useCallback(
    (node1: string, node2: string) => {
      setCapacitorList((prev) => [
        ...prev,
        { name: `C${prev.length + 1}`, value: 1, node1, node2 },

  const setResistanceList = useSetAtom(CapacitanceAllAtom);

  const setCapacitorList = useSetAtom(CapacitanceAllAtom);

  const setHistory = useSetAtom(CapacitorHistoryAtom);
  const setRedoList = useSetAtom(CapacitorRedoListAtom);

  const addCapacitor = useCallback(
    (node1: string, node2: string) => {
      setCapacitorList((prev) => [
        ...prev,

        { name: `R${prev.length + 1}`, value: 1, node1, node2 },


        { name: `C${prev.length + 1}`, value: 1, node1, node2 },

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


    [setCapacitorList]

    [setResistanceList]


    [setCapacitorList]

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


              id="wire"



              id="wire"

              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="black"
              strokeWidth={2}


              opacity={1}



              opacity={1}

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


                  addCapacitor(wire.start, wire.end);

                  addResistance(wire.start, wire.end);


                  addCapacitor(wire.start, wire.end);

                }}
                className="flex  gap-3"
              >
                <RefreshCcw />


                Make Capacitor

                Make Resistor


                Make Capacitor

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
