"use client";

import { useAtom } from "jotai";
import InputSliderControl from "~/components/ui/input-slider-control";
import { collisionInputsAtom } from "./store";

interface CollisionInputProps {
  resetPosition: () => void;
}

const CollisionInputs = (props: CollisionInputProps) => {
  const [{ massOne, massTwo, velocityOne, velocityTwo }, setInput] =
    useAtom(collisionInputsAtom);
  const { resetPosition } = props;

  return (
    <div style={{ userSelect: "auto" }} className="flex flex-col gap-1">
      <div>
        <InputSliderControl
          label="Mass 1"
          value={massOne}
          onChange={(num) => {
            setInput((prev) => ({ ...prev, massOne: num }));
            resetPosition();
          }}
          min={0.1}
          max={50}
        />
      </div>
      <div>
        <InputSliderControl
          label="Velocity 1"
          value={velocityOne}
          onChange={(num) => {
            setInput((prev) => ({ ...prev, velocityOne: num }));
            resetPosition();
          }}
          min={-15}
          max={15}
        />
      </div>
      <div>
        <InputSliderControl
          label="Mass 2"
          value={massTwo}
          onChange={(num) => {
            setInput((prev) => ({ ...prev, massTwo: num }));
            resetPosition();
          }}
          min={0.1}
          max={50}
        />
      </div>
      <div>
        <InputSliderControl
          label="Velocity 2"
          value={velocityTwo}
          onChange={(num) => {
            setInput((prev) => ({ ...prev, velocityTwo: num }));
            resetPosition();
          }}
          min={-15}
          max={15}
        />
      </div>
    </div>
  );
};

export default CollisionInputs;
