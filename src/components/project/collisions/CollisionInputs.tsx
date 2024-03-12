"use client";

import { useAtomValue, useSetAtom } from "jotai";
import InputSliderControl from "~/components/ui/input-slider-control";
import { collisionInputsAtom, debouncedValueAtom } from "./store";

interface CollisionInputProps {
  resetPosition: () => void;
}

const CollisionInputs = (props: CollisionInputProps) => {
  const { massOne, massTwo, velocityOne, velocityTwo } =
    useAtomValue(collisionInputsAtom);
  const { resetPosition } = props;

  const setInput = useSetAtom(debouncedValueAtom);

  return (
    <div style={{ userSelect: "auto" }} className="flex flex-col gap-1">
      <div>
        <InputSliderControl
          label="Mass 1"
          value={massOne}
          onChange={(num) => {
            resetPosition();
            setInput((prev) => ({ ...prev, massOne: num }));
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
            resetPosition();
            setInput((prev) => ({ ...prev, velocityOne: num }));
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
            resetPosition();
            setInput((prev) => ({ ...prev, massTwo: num }));
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
            resetPosition();
            setInput((prev) => ({ ...prev, velocityTwo: num }));
          }}
          min={-15}
          max={15}
        />
      </div>
    </div>
  );
};

export default CollisionInputs;
