import { useAtomValue } from "jotai";
import { calculatedValuesAtom } from "~/components/project/collision-2d/store";

const PRECISION = 2;
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

export default KineticEnergy;
