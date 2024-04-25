import { useAtomValue } from "jotai";
import React from "react";
import { calculatedValuesAtom } from "~/components/project/collision-2d/store";

const PRECISION = 2;
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

export default Momentum;
