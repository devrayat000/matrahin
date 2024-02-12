import { MinusSquare, PlusSquare } from "lucide-react";
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
  const inputStyle =
    "flex flex-row justify-between flex-wrap items-center gap-1 m-1 font-mono rounded-xl  text-white  shadow-[0_5px_10px_rgb(0,0,0,0.4)] bg-[#2f4454] p-3 px-4";

  return (
    // <div className="flex flex-col gap-1 items-center mb-2 border px-6 py-3 bg-stone-50 ">
    <div className={inputStyle}>
      <div className="flex flex-row justify-between  w-full  gap-1 items-center">
        <label className="mr-2 text-lg font-bold">{label}</label>

        <input
          className="ml-1 px-2 py-1 rounded-xl border text-white text-lg  bg-[#2f4454] w-[9ch] disabled:bg-gray-100 disabled:cursor-not-allowed"
          style={{
            width: `${maxChars}ch`,
          }}
          type="number"
          step={0.1}
          min={min}
          max={max}
          required
          value={value}
          onChange={(e) => onChangeInput(id, e.target.value)}
        />
      </div>

      <div className="flex flex-row justify-between  w-full  gap-2 mt-1 items-center">
        <button
          name="-1"
          disabled={value <= min}
          className="disabled:opacity-50"
          onClick={() => onChangeInput(id, (value - 1).toString())}
        >
          <MinusSquare />
        </button>
        <Slider
          min={min}
          max={max}
          step={1}
          value={[value]}
          onValueChange={([val]) => onChangeInput(id, val.toString())}
          className="mt-2"
        />

        <button
          name="+1"
          disabled={value >= max}
          className="disabled:opacity-50"
          onClick={() => onChangeInput(id, (value + 1).toString())}
        >
          <PlusSquare />
        </button>
      </div>

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
      <div className="text-xs mt-1 self-start text-gray-100">{helperText}</div>
    </div>
  );
};

export default InputWithSlider;
