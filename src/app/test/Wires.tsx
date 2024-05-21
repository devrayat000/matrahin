import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "~/components/ui/popover";

import { MinusCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import HighlightComponent from "./HighlightComponent";
import { Wire } from "./store";
import { getCoordinatesById } from "./utils";

const WiresComponent = ({
  WiresList,
  onSelect,
  onRemove,
}: {
  WiresList: Wire[];
  onSelect?: (wire: Wire, index: number) => void;
  onRemove?: (wire: Wire, index: number) => void;
}) => {
  const [selectedWire, setSelectedWire] = useState<number | null>(null);

  return WiresList.map((wire, index) => {
    const start = getCoordinatesById(wire.start);
    const end = getCoordinatesById(wire.end);

    const handleWireClick = () => {
      if (selectedWire === index) setSelectedWire(null);
      else setSelectedWire(index);
      onSelect?.(wire, index);
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
          <PopoverContent side="top">
            <div className=" m-auto w-fit ">
              <Button
                variant="destructive"
                onClick={() => {
                  setSelectedWire(null);
                  onRemove?.(wire, index);
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

export default WiresComponent;
