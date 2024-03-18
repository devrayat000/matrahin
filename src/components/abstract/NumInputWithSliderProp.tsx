import { PopoverContentProps } from "@radix-ui/react-popover";
import { FC } from "react";
import {
  Label,
  NumInput,
  SliderPopoverContent,
  SliderTrigger,
} from "../ui/num-input";
import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
} from "../ui/popover";

interface NumInputWithSliderPopProps {
  label?: string | JSX.Element;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  sliderSide?: PopoverContentProps["side"];
  onChange: (value: number) => void;
  needsSlider?: boolean;
}

/**
 * A component that combines a number input with a slider, displayed as popover.
 *
 * @component
 * @example
 * ```tsx
 * <NumInputWithSliderPop
 *   label="Value"  // or <p>Value</p>
 *   value={50}
 *   min={0}
 *   max={100}
 *   step={1}
 *   sliderSide="top" // or "bottom", "left", "right"
 *   onChange={(value) => console.log(value)}
 *   needsSlider={false} // or true
 * />
 * ```
 *
 * @param {object} props - The component props.
 * @param {string | JSX.Element} [props.label] - The label for the input.
 * @param {number} props.value - The current value of the input.
 * @param {number} [props.min=0] - The minimum value of the input.
 * @param {number} [props.max=100] - The maximum value of the input.
 * @param {number} [props.step=1] - The step value of the input.
 * @param {PopoverContentProps["side"]} [props.sliderSide="top"] - The side on which the slider popover should appear.
 * @param {(value: number) => void} props.onChange - The callback function called when the value of the input changes.
 * @param {boolean} [props.needsSlider=false] - Whether the slider should be displayed.
 *
 * @returns {JSX.Element} The rendered component.
 */
const NumInputWithSliderPop: FC<NumInputWithSliderPopProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  sliderSide = "top",
  onChange,
  needsSlider = true,
}) => {
  return (
    <div className="flex items-center justify-items-end gap-2">
      {label ? <Label>{label}</Label> : null}

      <NumInput
        value={value === 0 ? "" : value}
        min={min}
        max={max}
        step={step}
      />
      {needsSlider ? (
        <Popover>
          <SliderTrigger />
          <PopoverPortal>
            <PopoverContent side={sliderSide}>
              <SliderPopoverContent
                numValue={value}
                onChangeValue={onChange}
                max={max}
                min={min}
                step={step}
              />

              <PopoverClose />
              <PopoverArrow />
            </PopoverContent>
          </PopoverPortal>
        </Popover>
      ) : null}
    </div>
  );
};

export default NumInputWithSliderPop;
