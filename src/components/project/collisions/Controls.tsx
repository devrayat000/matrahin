import { ChevronsLeft, ChevronsRight, Play, RotateCcw } from "lucide-react";
import React from "react";

interface ControlProps {}

const SpeedControl: React.FC = () => {
  return (
    <div className="flex flex-row items-center gap-2">
      <ChevronsLeft />
      <span>1x</span>
      <ChevronsRight />
    </div>
  );
};

const Controls: React.FC<ControlProps> = () => {
  return (
    <div className="flex flex-row justify-around items-center gap-4 w-fit text-white">
      <div>
        <SpeedControl />
      </div>
      <div>
        <button>
          <Play />
        </button>
      </div>

      <div>
        <button>
          <RotateCcw />
        </button>
      </div>
    </div>
  );
};

export default Controls;
