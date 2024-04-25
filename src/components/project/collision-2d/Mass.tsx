import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import NumInputWithSliderProp from "~/components/abstract/NumInputWithSliderProp";
import {
  DEFAULT_VALUES,
  MAXIMUMs,
  MINIMUMs,
  collisionTypeAtom,
  twoDCollisionInputsAtom,
} from "~/components/project/collision-2d/store";
import { deepCopy, getUpdatedV } from "~/components/project/collision-2d/utils";

const Mass = ({ count }: { count: 0 | 1 }) => {
  const collisionType = useAtomValue(collisionTypeAtom);
  const setValues = useSetAtom(twoDCollisionInputsAtom);
  const [mass, setMass] = useState({
    value: DEFAULT_VALUES[count].M,
    unit: 1,
  });

  const handleMassChange = (value: number, count: 0 | 1) => {
    setValues((values) => {
      const newValues = deepCopy(values);
      newValues[count].M = value;
      const { v1, v2 } = getUpdatedV(
        newValues[0].M,
        newValues[1].M,
        newValues[0].V.i,
        newValues[1].V.i,
        collisionType
      );
      newValues[0].V.f = v1;
      newValues[1].V.f = v2;
      return newValues;
    });
  };

  const handleUnitChange = (value: number) => {
    // update the mass value on current unit

    setMass({ ...mass, unit: value });
    handleMassChange(mass.value * value, count);
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between w-full gap-3 p-1">
        <p className="text-lg xl:text-xl text-left ">Mass</p>
        <div className="flex items-center justify-around gap-2">
          <NumInputWithSliderProp
            value={mass.value}
            min={MINIMUMs.m}
            max={MAXIMUMs.m}
            onChange={(value) => {
              // setMass({ ...mass, value: value < 0 ? 0 : value });
              setMass({ ...mass, value: value });
              handleMassChange(value * mass.unit, count);
            }}
          />
          <select
            className="border rounded-md border-slate-900 w-fit px-2"
            defaultValue={1}
            onChange={(e) => handleUnitChange(Number(e.target.value))}
          >
            <option value={0.001}>g</option>
            <option value={1}>kg</option>
          </select>
        </div>
      </div>
      {mass.value === 0 && (
        <p className="text-red-500 text-sm">Mass cannot be zero</p>
      )}
    </>
  );
};

export default Mass;
