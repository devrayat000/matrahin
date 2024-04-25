import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";
import NumInputWithSliderProp from "~/components/abstract/NumInputWithSliderProp";
import {
  COLLISION_TYPES,
  DEFAULT_VALUES,
  MAXIMUMs,
  MINIMUMs,
  TwoDCollisionValueType,
  collisionTypeAtom,
  twoDCollisionInputsAtom,
  vectorType,
} from "~/components/project/collision-2d/store";
import {
  checkTendsToZero,
  deepCopy,
  getUpdatedUSelf,
  getUpdatedV,
} from "~/components/project/collision-2d/utils";
import Chip from "~/components/ui/chip";

const Velocity = ({ count }: { count: 0 | 1 }) => {
  const [format, setFormat] = useState<"xy" | "vtheta">("xy");
  const [velocity, setVelocity] = useAtom(twoDCollisionInputsAtom);
  const [unit, setUnit] = useState(1);
  const collisionType = useAtomValue(collisionTypeAtom);

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
          value * Math.cos((inputs[initOrFinal].y * Math.PI) / 180);
        newValues[count].V[initOrFinal].y =
          value * Math.sin((inputs[initOrFinal].y * Math.PI) / 180);
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
        newValues[1].V.i,
        collisionType
      );

      newValues[0].V.f = { ...v1 };
      newValues[1].V.f = { ...v2 };
    } else {
      // final velocity is changed
      if (collisionType == COLLISION_TYPES.INELASTIC) {
        // formula: V = (m1 * u1 + m2 * u2) / (m1 + m2)
        // so, u1 = ((m1 + m2) * V - m2 * u2) / m1
        newValues[1 - count].V.f = { ...newValues[count].V.f };
        newValues[count].V.i = {
          x:
            ((newValues[count].M + newValues[1 - count].M) *
              newValues[count].V.f.x -
              newValues[1 - count].M * newValues[1 - count].V.i.x) /
            newValues[count].M,
          y:
            ((newValues[count].M + newValues[1 - count].M) *
              newValues[count].V.f.y -
              newValues[1 - count].M * newValues[1 - count].V.i.y) /
            newValues[count].M,
        };
      } else {
        if (newValues[0].M !== newValues[1].M) {
          newValues[count].V.i = getUpdatedUSelf(
            newValues[0].M,
            newValues[1].M,
            newValues[count].V.f,
            newValues[Math.abs(1 - count)].V.i,
            collisionType
          );
        } else {
          newValues[Math.abs(1 - count)].V.i = newValues[count].V.f;
        }
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

      <table className="w-full " align="center">
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
export default Velocity;
