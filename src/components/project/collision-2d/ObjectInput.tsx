import colors from "~/components/common/CanvasTHREE/colors";
import KineticEnergy from "./KineticEnergy";
import Mass from "./Mass";
import Momentum from "./Momentum";
import Velocity from "./Velocity";

const ObjectInput = ({ count }: { count: 0 | 1 }) => {
  return (
    <div className=" md:self-start  flex flex-col items-center justify-center border w-fit rounded-md border-slate-900 gap-1 ">
      <div
        className="rounded-md w-full text-lg  xl:text-xl font-bold flex items-center justify-center"
        style={{
          backgroundColor: colors[count * 2],
        }}
      >
        Object {count + 1}
      </div>

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
export default ObjectInput;
