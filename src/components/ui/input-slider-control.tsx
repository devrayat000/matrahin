"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { Slider } from "./slider";

interface InputSliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  id?: number;
}

const InputSliderControl: React.FC<InputSliderControlProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  id = "id",
  step = 1,
}) => {
  const handleIncrement = () => {
    onChange(value + step);
  };

  const handleDecrement = () => {
    onChange(value - step);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if (e.target.value === "") return onChange("");
    onChange(Number(e.target.value));
  };

  // prevent 3d canvas from moving when slider is clicked
  const preventCanvasRotation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <form>
      <Accordion
        type="single"
        defaultValue="Form"
        collapsible={true}
        className=" backdrop-blur-[1px] backdrop-brightness-75 text-white border-none "
      >
        <AccordionItem
          value="Form"
          className="px-2 rounded-xl border-2 border-border"
        >
          <div className="flex flex-row w-full gap-2  items-center">
            <AccordionTrigger className=" py-1 w-full"></AccordionTrigger>
            <div className="flex flex-row justify-between py-1  w-full  gap-1 items-center">
              <label htmlFor="quantity-input" className="text-sm font-medium">
                {label} :
              </label>
              <div className="relative flex items-center max-w-[8rem]">
                <button
                  disabled={value <= min}
                  type="button"
                  id="decrement-button"
                  className=" border  disabled:bg-gray-500 hover:bg-gray-600  border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                  onClick={handleDecrement}
                >
                  <svg
                    className="w-3 h-3 "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 2"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 1h16"
                    />
                  </svg>
                </button>
                <input
                  type="number"
                  value={value === 0 ? "" : value}
                  min={min}
                  max={max}
                  onChange={handleChange}
                  name="quantity-input"
                  id="quantity-input"
                  aria-describedby="helper-text-explanation"
                  className="backdrop-blur-[1px]   backdrop-brightness-75 bg-transparent border-2 text-white  border-x-0  min-w-[4ch] h-11 text-center  text-sm  focus:bg-gray-600  w-full py-2.5 "
                  placeholder="0"
                  required
                />
                <button
                  disabled={value >= max}
                  type="button"
                  id="increment-button"
                  className=" hover:bg-gray-600  border border-gray-300   rounded-e-lg p-3 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none 
                    disabled:bg-gray-500
                  "
                  onClick={handleIncrement}
                >
                  <svg
                    className="w-3 h-3 text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 18"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 1v16M1 9h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <AccordionContent className="text-xs lg:text-lg pb-1">
            <div
              onPointerDown={preventCanvasRotation}
              className="flex flex-col w-full items-center"
            >
              <Slider
                min={min}
                max={max}
                step={step}
                value={[value]}
                onValueChange={([val]) => onChange(val)}
                className="mt-2 mb-0 pb-0"
              />
              {/* add labels */}
              <div className="flex flex-row justify-between w-full text-sm gap-1 items-center">
                <label style={{ marginRight: "5px" }}>{min}</label>
                <label style={{ marginLeft: "5px" }}>{max}</label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </form>
  );
};

export default InputSliderControl;
