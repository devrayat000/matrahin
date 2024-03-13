"use client";

import { useState } from "react";
import InputSliderControl from "~/components/ui/input-slider-control";
import { DEFAULT_INPUTS } from "./store";

interface CollisionInputProps {
  inputChange: (param: string, value: number) => void;
}

const CollisionInputs = (props: CollisionInputProps) => {
  const [{ m1, m2, v1, v2 }, setInput] = useState(DEFAULT_INPUTS);
  // useAtom(collisionInputsAtom);

  const { inputChange } = props;

  return (
    <div style={{ userSelect: "auto" }} className="flex flex-col gap-1">
      <div>
        <InputSliderControl
          label="Mass 1"
          value={m1}
          onChange={(num) => {
            setInput((prev) => ({ ...prev, m1: num }));
            inputChange("m1", num);
          }}
          min={0.1}
          max={50}
        />
      </div>
      <div>
        <InputSliderControl
          label="Velocity 1"
          value={v1}
          onChange={(num) => {
            setInput((prev) => ({ ...prev, v1: num }));
            inputChange("v1", num);
          }}
          min={-15}
          max={15}
        />
      </div>
      <div>
        <InputSliderControl
          label="Mass 2"
          value={m2}
          onChange={(num) => {
            setInput((prev) => ({ ...prev, m2: num }));
            inputChange("m2", num);
          }}
          min={0.1}
          max={50}
        />
      </div>
      <div>
        <InputSliderControl
          label="Velocity 2"
          value={v2}
          onChange={(num) => {
            setInput((prev) => ({ ...prev, v2: num }));
            inputChange("v2", num);
          }}
          min={-15}
          max={15}
        />
      </div>
    </div>
  );
};

export default CollisionInputs;
