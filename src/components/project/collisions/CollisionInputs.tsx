"use client";

import { useAtom } from "jotai";
import InputSliderControl from "~/components/ui/input-slider-control";
import {
  massOneAtom,
  massTwoAtom,
  velocityOneAtom,
  velocityTwoAtom,
} from "./store";

const CollisionInputs = () => {
  const [massOne, setMassOne] = useAtom(massOneAtom);
  const [velocityOne, setvelocityOne] = useAtom(velocityOneAtom);
  const [massTwo, setMassTwo] = useAtom(massTwoAtom);
  const [velocityTwo, setvelocityTwo] = useAtom(velocityTwoAtom);

  return (
    <div style={{ userSelect: "auto" }} className="flex flex-col gap-1">
      <div>
        <InputSliderControl
          label="Mass 1"
          value={massOne}
          onChange={(num) => setMassOne(num)}
          min={0.1}
          max={50}
        />
      </div>
      <div>
        <InputSliderControl
          label="Velocity 1"
          value={velocityOne}
          onChange={(num) => setvelocityOne(num)}
          min={-15}
          max={15}
        />
      </div>
      <div>
        <InputSliderControl
          label="Mass 2"
          value={massTwo}
          onChange={(num) => setMassTwo(num)}
          min={0.1}
          max={50}
        />
      </div>
      <div>
        <InputSliderControl
          label="Velocity 2"
          value={velocityTwo}
          onChange={(num) => setvelocityTwo(num)}
          min={-15}
          max={15}
        />
      </div>
    </div>
  );
};

export default CollisionInputs;
