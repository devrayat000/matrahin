import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "~/components/ui/popover";

import { MinusCircle } from "lucide-react";
import { FC, useState } from "react";
import { Button } from "~/components/ui/button";
import HighlightComponent from "./HighlightComponent";
import Resistor from "./Resistor";
import { Resistance } from "./store";
import { getCoordinatesById } from "./utils";

interface ResistanceInputsProps {
  resistanceList: Resistance[];
  onRemove: (resistance: Resistance, index: number) => void;
}
const ResistanceInputs: FC<ResistanceInputsProps> = ({
  resistanceList,
  onRemove,
}) => {
  const [selectedR, setSelectedR] = useState<number | null>(null);

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
            <Resistor R={r} onClick={() => {}} />
            <HighlightComponent
              start={start}
              end={end}
              isHighlighted={selectedR === index}
            />
          </g>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent side="top" className="w-max p-3 pt-8 pr-8">
            <div className=" m-auto w-fit ">
              <Button
                variant="destructive"
                onClick={() => {
                  setSelectedR(null);
                  onRemove?.(r, index);
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

export default ResistanceInputs;
