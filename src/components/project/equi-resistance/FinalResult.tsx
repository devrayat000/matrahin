import { useAtomValue } from "jotai";
import { FinalResultAtom } from "./store";

const FinalResult = () => {
  const FinalResult = useAtomValue(FinalResultAtom);
  return (
    FinalResult.value !== -1 && (
      <div className="m-auto  p-5 rounded-full bg-slate-300 w-fit text-3xl">
        Result {"   "}
        <span className="p-3 py-2 rounded-full bg-slate-50">
          {FinalResult.value} Ω
        </span>
      </div>
    )
  );
};

export default FinalResult;
