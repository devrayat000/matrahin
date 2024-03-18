import { MinusSquare, PlusSquare, Settings2 } from "lucide-react";
import {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from "react";
import { cn } from "~/lib/utils";
import { PopoverTrigger } from "./popover";

import { Slider } from "./slider";

const Label = forwardRef<ElementRef<"span">, ComponentPropsWithRef<"span">>(
  ({ children, className, ...props }, ref) => {
    return (
      <span className={cn("text-xl", className)} {...props} ref={ref}>
        {children}
      </span>
    );
  }
);
Label.displayName = "Label";

const NumInput = forwardRef<
  ElementRef<"input">,
  ComponentPropsWithRef<"input">
>(({ className, ...props }, ref) => {
  return (
    <div className="flex items-center justify-items-end gap-2">
      <input
        ref={ref}
        type="number"
        className={cn("w-20 p-2 border rounded-md border-slate-900", className)}
        {...props}
      />
    </div>
  );
});

NumInput.displayName = "NumInput";

const SliderTrigger = forwardRef<
  ElementRef<"button">,
  ComponentPropsWithRef<"button">
>(({ className, children, ...props }, ref) => {
  return (
    <PopoverTrigger>
      <button
        ref={ref}
        className={cn(
          "w-[35px] h-[35px] inline-flex items-center justify-center text-violet11 bg-white hover:bg-slate-200 focus:shadow-[0_0_0_2px] focus:shadow-black cursor-pointer outline-none",
          className
        )}
        {...props}
      >
        {children ?? <Settings2 />}
      </button>
    </PopoverTrigger>
  );
});

SliderTrigger.displayName = "SliderTrigger";

interface SliderPopoverContentProps extends ComponentPropsWithoutRef<"div"> {
  numValue: number;
  min?: number;
  max?: number;
  step?: number;
  onChangeValue: (value: number) => void;
}

/**
 * Renders a slider popover content component.
 *
 *
 *
 * @component
 *
 * example
 * ```tsx
 * <SliderPopoverContent
 *  numValue={50}
 *  min={0}
 *  max={100}
 *  step={1}
 *  onChangeValue={(value) => console.log(value)}
 * />
 * ```
 *
 *
 * @param {Object} props - The component props.
 * @param {string} props.className - The class name for the component.
 * @param {ReactNode} props.children - The children elements to render inside the component.
 * @param {number} props.numValue - The current numeric value.
 * @param {number} [props.min=0] - The minimum value for the slider.
 * @param {number} [props.max=100] - The maximum value for the slider.
 * @param {number} [props.step=1] - The step value for the slider.
 * @param {Function} props.onChangeValue - The callback function to handle value changes.
 * @param {React.RefObject} ref - The ref object for the component.
 * @returns {JSX.Element} The rendered slider popover content component.
 */
const SliderPopoverContent = forwardRef<
  ElementRef<"div">,
  SliderPopoverContentProps
>(
  (
    {
      className,
      children,
      numValue,
      min = 0,
      max = 100,
      step = 1,
      onChangeValue,
      ...props
    },
    ref
  ) => {
    const handleDecrement = () => {
      if (numValue > min) {
        onChangeValue(numValue - step);
      }
    };

    const handleIncrement = () => {
      if (numValue < max) {
        onChangeValue(numValue + step);
      }
    };
    return (
      <div ref={ref} {...props}>
        <p className="text-center ">{10}</p>
        <div className="flex flex-row justify-between  w-full  gap-2 mt-1 items-center">
          <button
            name={`-${step.toFixed(0)}`}
            disabled={numValue <= min}
            className="disabled:opacity-50 hover:bg-slate-200 focus:shadow-[0_0_0_2px] focus:shadow-black cursor-pointer outline-none focus:outline-none"
            onClick={handleDecrement}
          >
            <MinusSquare />
          </button>
          <Slider
            min={min}
            max={max}
            step={step}
            value={[numValue]}
            onValueChange={([val]) => onChangeValue(val)}
            className="mt-2"
          />

          <button
            name={`+${step.toFixed(0)}`}
            disabled={numValue >= max}
            className="disabled:opacity-50 hover:bg-slate-200 focus:shadow-[0_0_0_2px] focus:shadow-black cursor-pointer outline-none focus:outline-none"
            onClick={handleIncrement}
          >
            <PlusSquare />
          </button>
        </div>
      </div>
    );
  }
);

SliderPopoverContent.displayName = "SliderPopoverContent";

export { Label, NumInput, SliderPopoverContent, SliderTrigger };
