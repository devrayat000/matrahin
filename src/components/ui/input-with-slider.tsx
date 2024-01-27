import React from "react";

export type InputWithSliderProps = {
  label: string;
  value: number;
  helperText?: string;
  id: number;
  onChangeInput: (id: number, value: string) => void;
  min?: number;
};
const InputWithSlider: React.FC<InputWithSliderProps> = ({
  label,
  value,
  helperText = "",
  id,
  onChangeInput,
  min = -10,
}) => {
  return (
    <div className="flex flex-col gap-1 items-center mb-2 border p-2 bg-stone-100 ">
      <div className="flex flex-row justify-between  w-full  gap-1 items-center">
        <label style={{ marginRight: "5px" }}>{label}</label>

        <input
          className="ml-1 p-2 border"
          type="number"
          step={0.1}
          min={min}
          max={10}
          value={value}
          onChange={(e) => onChangeInput(id, e.target.value)}
        />
      </div>
      <input
        type="range"
        min={min}
        max={10}
        step={0.1}
        value={value}
        onChange={(e) => onChangeInput(id, e.target.value)}
      />
      <div className="text-xs text-gray-500">{helperText}</div>
    </div>
  );
};

export default InputWithSlider;
