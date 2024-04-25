"use client";

import { Slack } from "lucide-react";
import Collision2DAnimation from "../../../../../components/project/collision-2d/Collision2DAnimation";
import CollisionTypeInput from "../../../../../components/project/collision-2d/CollisionTypeInput";
import ObjectInput from "../../../../../components/project/collision-2d/ObjectInput";
import PauseResumeControl from "../../../../../components/project/collision-2d/PauseResumeControl";

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

const page = () => {
  return (
    <div className="flex flex-col gap-2 mb-3">
      <h1 className=" text-center m-auto text-4xl font-bold">Collision</h1>
      <div className="flex flex-col md:flex-row  justify-between items-center mx-2 gap-2">
        <div className="w-[90vw] md:w-2/3 ">
          <div className=" mb-2  border border-slate-500 md:h-[70vh] h-[40svh]  self-start">
            <Collision2DAnimation />
          </div>
          <div className="flex justify-center items-center">
            <PauseResumeControl />
          </div>
        </div>
        <div className="md:self-start ">
          <CollisionTypeInput />
          <div className="flex flex-col  items-center justify-center md:flex-row gap-2">
            <ObjectInput count={0} />
            <ObjectInput count={1} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
