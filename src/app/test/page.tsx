"use client";

import { Slack } from "lucide-react";
import NumInputWithSliderPop from "~/components/abstract/NumInputWithSliderPop";

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

      <NumInputWithSliderPop
        label={
          <>
            V<sub>x</sub>
          </>
        }
        value={0}
        min={-10}
        max={10}
        onChange={(value) => console.log(value)}
      />
    </div>
  );
};
const Velocity = () => {
  return (
    <div>
      <div className="flex flex-row items-center justify-between w-full gap-3 p-1">
        <p className="text-2xl ">Initial Velocity</p>

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
const Object1 = () => {
  return (
    <div className="   flex flex-col items-center justify-center border w-fit rounded-md border-slate-900 ">
      <h1 className="text-2xl font-bold">Object 1</h1>
      {/* mass */}
      <div className="flex flex-row items-center justify-between w-full gap-3 p-1">
        <p className="text-2xl text-left ">Mass</p>
        <div className="flex items-center justify-around gap-2">
          <input
            type="number"
            className="w-20 p-2  border rounded-md border-slate-900"
          />
          <Slack />
          <select className="border rounded-md border-slate-900 w-fit ">
            <option>g</option>
            <option>kg</option>
          </select>
        </div>
      </div>

      <hr className="w-full mt-2" />
      {/* velocity 2d */}
      <Velocity />
      <hr className="w-full mt-2" />

      <Velocity />
      <hr className="w-full mt-2" />

      <div className="flex flex-row items-center justify-between w-full gap-3 p-1">
        <p className="text-2xl ">Momentum</p>
        <p className="text-2xl ">{0} kgm/s</p>
      </div>
      <hr className="w-full mt-2" />

      <div className="flex flex-row items-center justify-between w-full gap-3 p-1">
        <p className="text-2xl ">Kinetic Energy</p>
        <p className="text-2xl ">{0} J</p>
      </div>
    </div>
  );
};
const page = () => {
  return (
    <div className="">
      <h1 className=" text-center m-auto text-4xl font-bold">Test</h1>
      <div className="flex justify-between items-center mx-2">
        <Object1 />
        <Object1 />
      </div>
    </div>
  );
};

export default page;
