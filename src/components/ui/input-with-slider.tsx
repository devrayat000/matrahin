import React from "react";
import { Slider } from "./slider";

export type InputWithSliderProps = {
  label: string;
  value: number;
  helperText?: string;
  id: number;
  onChangeInput: (id: number, value: string) => void;

  min?: number;
  max?: number;
  incrementPercentage?: number;
};
const InputWithSlider: React.FC<InputWithSliderProps> = ({
  label,
  value,
  helperText = "",
  id,
  onChangeInput,
  min = -10,
  max = 1000,
}) => {
  const maxChars = Math.max(max.toString().length, min.toString().length) + 5;
  return (
    <div className="flex flex-col gap-1 items-center mb-2 border px-6 py-3 bg-stone-50 ">
      <div className="text-xs mt-1 self-start text-gray-500">{helperText}</div>
      <div className="flex flex-row justify-between  w-full  gap-1 items-center">
        <label style={{ marginRight: "5px" }}>{label}</label>

        <input
          className="ml-1 p-2 border"
          style={{
            width: `${maxChars}ch`,
          }}
          type="number"
          step={0.1}
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChangeInput(id, e.target.value)}
        />
      </div>

      <Slider
        min={min}
        max={max}
        step={1}
        value={[value]}
        onValueChange={([val]) => onChangeInput(id, val.toString())}
        className="mt-2"
      />
      {/*  change by % : <numinput> */}
      {/* 
      <div className="flex flex-row justify-between w-full gap-1 items-center">
        <label style={{ marginRight: "5px" }}>Change by %</label>
        <input
          className="ml-1 p-2 border w-16"
          type="number"
          step={1}
          min={1}
          max={100}
          value={10}
        />
        <button className="p-2 px-4 bg-blue-500 text-white rounded-full  ">
          Apply
        </button>
      </div> */}
    </div>
  );
};

export default InputWithSlider;
