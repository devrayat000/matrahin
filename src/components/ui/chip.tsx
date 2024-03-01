import React, { ComponentPropsWithRef, ElementRef, forwardRef } from "react";
import { cn } from "~/lib/utils";

interface ChipProps extends ComponentPropsWithRef<"div"> {
  label?: string | React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

const Chip = forwardRef<ElementRef<"div">, ChipProps>(
  ({ className, children, label, selected, onClick }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "m-auto rounded-full cursor-pointer border-2 text-md px-4 py-1 text-white w-fit",
          {
            "border-green-500 bg-green-500  ": selected,
            "border-gray-500 bg-gray-500 ": !selected,
          },
          className
        )}
        onClick={onClick}
      >
        {label ?? children}
      </div>
    );
  }
);

export default Chip;
