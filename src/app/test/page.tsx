"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Slack } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import NumInputWithSliderProp from "~/components/abstract/NumInputWithSliderProp";
import Chip from "~/components/ui/chip";
import Collision2DAnimation from "./Collision2DAnimation";
import PauseResumeControl from "./PauseResumeControl";
import {
  DEFAULT_VALUES,
  MAXIMUMs,
  MINIMUMs,
  TwoDCollisionValueType,
  calculatedValuesAtom,
  twoDCollisionInputsAtom,
  vectorType,
} from "./store";
import {
  checkTendsToZero,
  deepCopy,
  getUpdatedUSelf,
  getUpdatedV,
} from "./utils";

const PRECISION = 2;

const TwoInputs = () => {
  return (
    <div className="flex items-center justify-between pl-3 gap-2 p-1">
      <div className="flex items-center justify-items-end gap-2">
        <p className="text-xl">
          V<sub>x</sub>
        </p>
        <input
          type="number"
          className="w-20 p-2  border rounded-md border-slate-900"
        />
        <Slack />
      </div>

      {/* <NumInputWithSliderPop
        label={
          <>
            V<sub>x</sub>
          </>
        }
        value={0}
        min={-10}
        max={10}
        onChange={(value) => console.log(value)}
      /> */}
    </div>
  );
};
const Velocity2 = () => {
  return (
    <div>
      <div className="flex flex-row items-center justify-between w-full gap-3 p-1">
        <p className="text-lg xl:text-xl ">Initial Velocity</p>

        <select className="border rounded-md border-slate-900 w-fit ">
          <option>m/s</option>
          <option>km/h</option>
        </select>
      </div>
      <TwoInputs />
      <div className="flex gap-2 justify-center items-center">
        <hr className="w-1/3" />
        Or
        <hr className="w-1/3" />
      </div>

      <TwoInputs />
    </div>
  );
};

const Velocity = ({ count }: { count: 0 | 1 }) => {
  const [format, setFormat] = useState<"xy" | "vtheta">("xy");
  const [velocity, setVelocity] = useAtom(twoDCollisionInputsAtom);
  const [unit, setUnit] = useState(1);

  const [inputs, setInputs] = useState(DEFAULT_VALUES[count].V);

  useEffect(() => {
    updateInputs(format === "xy" ? 0 : 1, velocity[count].V);
  }, [velocity[count].V.i, velocity[count].V.f]);
  /**
   *
   * @param vector the vector to be converted
   * @param mode 0 for xy and 1 for magnitude angle format
   * @returns the vector in the specified format
   */
  const getVectorInValueAngleFormat = useCallback(
    (vector: vectorType, mode: 0 | 1) => {
      if (mode === 0) {
        if (format === "xy")
          return {
            x: vector.x / unit,
            y: vector.y / unit,
          };
        const { x, y } = vector;
        return {
          x: (x * Math.cos(y * (Math.PI / 180))) / unit,
          y: (x * Math.sin(y * (Math.PI / 180))) / unit,
        };
      } else {
        const { x, y } = vector;
        const magnitude = Math.sqrt(x ** 2 + y ** 2);
        const angle = Math.atan2(y, x);
        return {
          x: magnitude / unit,
          y: Number((angle * (180 / Math.PI)).toFixed(4)),
        };
      }
    },
    [format, unit]
  );

  /**
   *
   * @param mode 0 for xy and 1 for magnitude angle format
   */
  const updateInputs = (
    mode: 0 | 1,
    inputs: {
      i: vectorType;
      f: vectorType;
    }
  ) => {
    let newInputs = { ...inputs };
    newInputs.i = getVectorInValueAngleFormat(inputs.i, mode);
    newInputs.f = getVectorInValueAngleFormat(inputs.f, mode);

    setInputs(newInputs);
  };

  const handleUnitChange = useCallback(
    (value: number) => {
      setUnit(value);
      setVelocity((values) => {
        const newValues = deepCopy(values);
        newValues[count].V.i.x *= value / unit;
        newValues[count].V.i.y *= value / unit;
        newValues[count].V.f.x *= value / unit;
        newValues[count].V.f.y *= value / unit;
        return newValues;
      });
    },
    [unit]
  );

  const handleVelocityChange = (
    value: number,
    axis: "x" | "y",
    initOrFinal: "i" | "f"
  ) => {
    const newValues: TwoDCollisionValueType = deepCopy(velocity);

    if (format === "vtheta") {
      if (axis === "x") {
        // currently changing the magnitude
        // Vx = V * cos(θ)
        newValues[count].V[initOrFinal].x =
          value * Math.cos(inputs[initOrFinal].y);
        newValues[count].V[initOrFinal].y =
          value * Math.sin(inputs[initOrFinal].y);
      } else {
        // currently changing the angle
        // Vy = V * sin(θ)

        newValues[count].V[initOrFinal].x =
          inputs[initOrFinal].x * Math.cos((value * Math.PI) / 180);
        newValues[count].V[initOrFinal].y =
          inputs[initOrFinal].x * Math.sin((value * Math.PI) / 180);
      }
    } else {
      newValues[count].V[initOrFinal][axis] = value;
    }
    if (initOrFinal === "i") {
      const { v1, v2 } = getUpdatedV(
        newValues[0].M,
        newValues[1].M,
        newValues[0].V.i,
        newValues[1].V.i
      );

      newValues[0].V.f = { ...v1 };
      newValues[1].V.f = { ...v2 };
    } else {
      if (newValues[0].M !== newValues[1].M) {
        newValues[count].V.i = getUpdatedUSelf(
          newValues[0].M,
          newValues[1].M,
          newValues[count].V.f,
          newValues[Math.abs(1 - count)].V.i
        );
      } else {
        newValues[Math.abs(1 - count)].V.i = newValues[count].V.f;
      }
    }

    setVelocity(newValues);
    if (format === "vtheta") {
      updateInputs(1, newValues[count].V);
    } else {
      setInputs(newValues[0].V);
    }
  };
  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between w-full gap-3 p-1">
        <p className="text-lg xl:text-xl ">Initial Velocity</p>

        <p className="text-lg xl:text-xl">m/s</p>
        {/* <select
          className="border rounded-md border-slate-900 w-fit "
          defaultValue={1}
          onChange={(e) => {
            handleUnitChange(Number(e.target.value));
          }}
        >
          <option value={1}>m/s</option>
          <option value={1 / 3.6}>km/h</option>
        </select> */}
      </div>
      <div className="flex flex-row items-center justify-between w-full gap-3 p-1">
        <p className="text-md  ">Format</p>
        <Chip
          selected={format === "xy"}
          onClick={() => {
            if (format !== "xy") updateInputs(0, inputs);
            setFormat("xy");
          }}
        >
          <span>
            V<sub>x</sub> <i>i</i> + V<sub>y</sub> <i>j</i>
          </span>
        </Chip>
        <Chip
          selected={format === "vtheta"}
          onClick={() => {
            if (format !== "vtheta") updateInputs(1, inputs);
            setFormat("vtheta");
          }}
        >
          <span>
            |V| ,<i>θ</i>
          </span>
        </Chip>
      </div>

      <table className="w-full" align="center">
        <thead>
          <tr>
            <th> </th>
            <th className="w-1/3 ">
              {format === "xy" ? (
                <>
                  V<sub>x</sub>
                </>
              ) : (
                <>|V|</>
              )}
            </th>
            <th className="w-1/3 ">
              {format === "xy" ? (
                <>
                  V<sub>y</sub>
                </>
              ) : (
                <i>θ</i>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Initial</th>
            <td className="w-1/3 ">
              <NumInputWithSliderProp
                value={checkTendsToZero(inputs.i.x)}
                min={MINIMUMs.modV}
                max={MAXIMUMs.modV}
                onChange={(value) => {
                  handleVelocityChange(value, "x", "i");
                }}
              />
            </td>
            <td className="w-1/3 ">
              <NumInputWithSliderProp
                value={checkTendsToZero(inputs.i.y)}
                min={format === "vtheta" ? MINIMUMs.angle : MINIMUMs.modV}
                max={format === "vtheta" ? MAXIMUMs.angle : MAXIMUMs.modV}
                onChange={(value) => {
                  handleVelocityChange(value, "y", "i");
                }}
              />
            </td>
          </tr>
          <tr>
            <th>Final</th>
            <td className="w-1/3 ">
              <NumInputWithSliderProp
                value={checkTendsToZero(inputs.f.x)}
                min={MINIMUMs.modV}
                max={MAXIMUMs.modV}
                onChange={(value) => {
                  handleVelocityChange(value, "x", "f");
                }}
              />
            </td>
            <td className="w-1/3 ">
              <NumInputWithSliderProp
                value={checkTendsToZero(inputs.f.y)}
                min={format === "vtheta" ? MINIMUMs.angle : MINIMUMs.modV}
                max={format === "vtheta" ? MAXIMUMs.angle : MAXIMUMs.modV}
                onChange={(value) => {
                  handleVelocityChange(value, "y", "f");
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const Mass = ({ count }: { count: 0 | 1 }) => {
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
        newValues[1].V.i
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
    <div className="flex flex-row items-center justify-between w-full gap-3 p-1">
      <p className="text-lg xl:text-xl text-left ">Mass</p>
      <div className="flex items-center justify-around gap-2">
        <NumInputWithSliderProp
          value={mass.value}
          min={MINIMUMs.m}
          max={MAXIMUMs.m}
          onChange={(value) => {
            setMass({ ...mass, value });
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
  );
};

const KineticEnergy = ({ count }: { count: 0 | 1 }) => {
  const {
    K: { i, f },
  } = useAtomValue(calculatedValuesAtom)[count];
  return (
    <>
      <div className="flex flex-row items-center justify-between w-full gap-3 p-1">
        <p className="text-lg xl:text-xl text-left ">Kinetic Energy</p>
        <p className="text-lg xl:text-xl "> kgm/s</p>
      </div>
      <div className="flex justify-around items-center gap-2 w-full">
        <div>Initial</div>

        <div>{i.toFixed(PRECISION)}</div>

        <div>Final</div>
        <div>{f.toFixed(PRECISION)}</div>
      </div>
    </>
  );
};
const Momentum = ({ count }: { count: 0 | 1 }) => {
  const {
    P: { i, f },
  } = useAtomValue(calculatedValuesAtom)[count];
  return (
    <>
      <div className="flex flex-row items-center justify-between w-full gap-3 p-1">
        <p className="text-lg xl:text-xl text-left ">Momentum</p>
        <p className="text-lg xl:text-xl "> kgm/s</p>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th> Case | Axis</th>
            <th className="w-1/3 text-center">X</th>
            <th className="w-1/3 text-center">Y</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Initial</th>
            <td className="w-1/3 text-center">{i.x.toFixed(PRECISION)}</td>
            <td className="w-1/3 text-center">{i.y.toFixed(PRECISION)}</td>
          </tr>
          <tr>
            <th>Final</th>
            <td className="w-1/3 text-center">{f.x.toFixed(PRECISION)}</td>
            <td className="w-1/3 text-center">{f.y.toFixed(PRECISION)}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

const Object = ({ count }: { count: 0 | 1 }) => {
  return (
    <div className="   flex flex-col items-center justify-center border w-fit rounded-md border-slate-900 ">
      <h1 className="text-lg xl:text-xl font-bold">Object {count + 1}</h1>
      {/* mass */}
      <Mass count={count} />

      <hr className="w-full mt-2" />

      <Velocity count={count} />

      <hr className="w-full mt-2" />
      <Momentum count={count} />
      <hr className="w-full mt-2" />
      <KineticEnergy count={count} />
    </div>
  );
};
const page = () => {
  return (
    <div className="">
      <h1 className=" text-center m-auto text-4xl font-bold">Test</h1>
      <div className="flex justify-between items-center mx-2 gap-2">
        <div className="w-2/3  border border-slate-500 h-[80vh] self-start">
          <Collision2DAnimation />
        </div>
        <Object count={0} />
        <Object count={1} />
      </div>
      <div className="flex justify-center items-center">
        <PauseResumeControl />
      </div>
    </div>
  );
};

export default page;
