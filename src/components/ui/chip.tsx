import React from "react";
import { cn } from "~/lib/utils";

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, selected, onClick }) => {
  return (
    <div
      className={cn(
        "m-auto rounded-full cursor-pointer border-2 text-md px-4 py-1 text-white",
        {
          "border-green-500 bg-green-500  ": selected,
          "border-gray-500 bg-gray-500 ": !selected,
        }
      )}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default Chip;
