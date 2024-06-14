import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "~/components/ui/popover";

import { useAtom, useSetAtom } from "jotai";
import { FlipHorizontal2, MinusCircle, RefreshCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "~/components/ui/button";
import HighlightComponent from "../breadboard/HighlightComponent";
import VoltageSourceComp from "./VoltageSource";
import {
  CapacitorHistoryAtom,
  CapacitorRedoListAtom,
  USER_ACTION,
  VoltageSource,
  VoltageSourceCapacitorAtom,
  WiresCapacitorAtom,
} from "./store";
import { getCoordinatesById } from "./utils";
const VoltageInput = () => {
  const [voltageSource, setVoltageSource] = useAtom(VoltageSourceCapacitorAtom);
  const [isSelected, setIsSelected] = useState(false);
  const setHistory = useSetAtom(CapacitorHistoryAtom);
  const setRedoList = useSetAtom(CapacitorRedoListAtom);
  const setWire = useSetAtom(WiresCapacitorAtom);
  const handleVSourceRemove = useCallback(
    (v: VoltageSource) => {
      setVoltageSource({
        node1: "-1__-1",
        node2: "-1__-1",
        value: 0,
      });
      setHistory((prev) => [
        ...prev,
        {
          action: USER_ACTION.REMOVE_RESISTANCE,
          params: { ...v },
        },
      ]);
      setRedoList([]);
    },
    [setVoltageSource]
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

  return (
    <Popover
      open={isSelected}
      onOpenChange={(isOpen) => {
        if (!isOpen) setIsSelected(false);
      }}
    >
      <PopoverTrigger className="cursor-grab">
        <g
          onClick={() => {
            setIsSelected((prev) => !prev);
          }}
        >
          <VoltageSourceComp
            R={voltageSource}
            onClick={() => {}}
            color={isSelected ? "blue" : "black"}
          />
          <HighlightComponent
            start={getCoordinatesById(voltageSource.node1)}
            end={getCoordinatesById(voltageSource.node2)}
            isHighlighted={isSelected}
          />
        </g>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent side="top" className="w-fit pr-10 pt-10">
          <div className="flex flex-col  sm:flex-row  items-center justify-between w-fit gap-4 text-lg  ">
            <div className="flex flex-row items-center   justify-between w-full gap-2">
              <input
                onChange={(e) => {
                  setVoltageSource((prev) => {
                    prev.value = Math.abs(Number(e.target.value));
                    return { ...prev };
                  });
                }}
                min={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsSelected(false);
                  }
                }}
                type="number"
                className="w-24 p-2 py-1 border rounded-md border-slate-900"
                value={voltageSource.value === 0 ? "" : voltageSource.value}
              />
            </div>

            <Button
              variant="success"
              onClick={() => {
                setIsSelected(false);
                handleVSourceRemove(voltageSource);
                addWire(voltageSource.node1, voltageSource.node2);
              }}
              className="flex  gap-3 w-full"
            >
              <RefreshCcw />
              Make Wire
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsSelected(false);
                handleVSourceRemove(voltageSource);
              }}
              className="flex  gap-3  w-full"
            >
              <MinusCircle />
              Remove
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setIsSelected(false);
                setVoltageSource((prev) => {
                  const temp = { ...prev };
                  (prev.node1 = temp.node2), (prev.node2 = temp.node1);
                  return { ...prev };
                });
              }}
              className="flex  gap-3  w-full"
            >
              <FlipHorizontal2 />
              Invert Polarity
            </Button>
          </div>
          <PopoverClose />
          <PopoverArrow />
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
};

export default VoltageInput;
