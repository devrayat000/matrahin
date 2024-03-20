"use client";

import { MathJaxContext } from "better-react-mathjax";
import { useSetAtom } from "jotai";
import { Slack } from "lucide-react";
import { useState } from "react";
import NumInputWithSliderProp from "~/components/abstract/NumInputWithSliderProp";
import Chip from "~/components/ui/chip";
import { twoDCollisionInputsAtom } from "./store";
import { deepCopy, getUpdatedV } from "./utils";

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

const Velocity = ({ count }: { count: number }) => {
  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between w-full gap-3 p-1">
        <p className="text-lg xl:text-xl ">Initial Velocity</p>

        <select className="border rounded-md border-slate-900 w-fit ">
          <option>m/s</option>
          <option>km/h</option>
        </select>
      </div>
      <div className="flex flex-row items-center justify-between w-full gap-3 p-1">
        <p className="text-md  ">Velocity format</p>

        <Chip selected={true} onClick={() => {}}>
          <span>
            V<sub>x</sub> <i>i</i> + V<sub>y</sub> <i>j</i>
          </span>
        </Chip>
        <Chip selected={true} onClick={() => {}}>
          <span>
            |V| ,<i>θ</i>
          </span>
        </Chip>
      </div>

      <table className="w-full" align="center">
        <thead>
          <tr>
            <th> </th>
            <th className="w-1/3 ">Vx</th>
            <th className="w-1/3 ">Vy</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Initial</th>
            <td className="w-1/3 ">
              <NumInputWithSliderProp
                value={0}
                min={-10}
                max={10}
                onChange={() => {}}
              />
            </td>
            <td className="w-1/3 ">
              <NumInputWithSliderProp
                value={0}
                min={-10}
                max={10}
                onChange={() => {}}
              />
            </td>
          </tr>
          <tr>
            <th>Final</th>
            <td className="w-1/3 ">
              <NumInputWithSliderProp
                value={0}
                min={-10}
                max={10}
                onChange={() => {}}
              />
            </td>
            <td className="w-1/3 ">
              <NumInputWithSliderProp
                value={0}
                min={-10}
                max={10}
                onChange={() => {}}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const Object1 = ({ count }: { count: 0 | 1 }) => {
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

const Mass = ({ count }: { count: 0 | 1 }) => {
  const setValues = useSetAtom(twoDCollisionInputsAtom);
  const [mass, setMass] = useState({
    value: 0,
    unit: 1,
  });

  const handleMassChange = (value: number, count: 0 | 1) => {
    setValues((values) => {
      const newValues = deepCopy(values);
      newValues[count].M = value;
      const { v1, v2 } = getUpdatedV(newValues);
      newValues[0].V.f = v1;
      newValues[1].V.f = v2;
      return newValues;
    });
  };

  return (
    <div className="flex flex-row items-center justify-between w-full gap-3 p-1">
      <p className="text-lg xl:text-xl text-left ">Mass</p>
      <div className="flex items-center justify-around gap-2">
        <NumInputWithSliderProp
          value={mass.value}
          min={0.001}
          max={100}
          onChange={(value) => {
            setMass({ ...mass, value });
            handleMassChange(value * mass.unit, count);
          }}
        />
        <select
          className="border rounded-md border-slate-900 w-fit px-2"
          defaultValue={1}
          onChange={(e) => {
            setMass({ ...mass, unit: Number(e.target.value) });
          }}
        >
          <option value={0.001}>g</option>
          <option value={1}>kg</option>
        </select>
      </div>
    </div>
  );
};

const KineticEnergy = ({ count }: { count: 0 | 1 }) => {
  return (
    <>
      <div className="flex flex-row items-center justify-between w-full gap-3 p-1">
        <p className="text-lg xl:text-xl text-left ">Kinetic Energy</p>
        <p className="text-lg xl:text-xl "> kgm/s</p>
      </div>
      <div className="flex justify-around items-center gap-2 w-full">
        <div>Initial</div>

        <div>0</div>

        <div>Final</div>
        <div>1</div>
      </div>
    </>
  );
};
const Momentum = ({ count }: { count: 0 | 1 }) => {
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
            <td className="w-1/3 text-center">0</td>
            <td className="w-1/3 text-center">0</td>
          </tr>
          <tr>
            <th>Final</th>
            <td className="w-1/3 text-center">1</td>
            <td className="w-1/3 text-center">1</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
};
const page = () => {
  return (
    <MathJaxContext version={3} config={config}>
      <div className="">
        <h1 className=" text-center m-auto text-4xl font-bold">Test</h1>
        <div className="flex justify-around items-center mx-2">
          {/* <Canvas>
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="hotpink" />
            </mesh>
          </Canvas> */}
          <Object1 count={0} />
          <Object1 count={1} />
        </div>
      </div>
    </MathJaxContext>
  );
};

export default page;
