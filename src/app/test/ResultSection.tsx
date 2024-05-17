import { useAtomValue } from "jotai";
import { SolvingStepsAtom, calculatingAtom } from "./store";

const ResultSection = () => {
  const calculating = useAtomValue(calculatingAtom);
  const solvingSteps = useAtomValue(SolvingStepsAtom);
  if (calculating) {
    return <div>Calculating...</div>;
  }
  return (
    <div>
      {solvingSteps.map((step, index) => {
        return (
          <div key={index}>
            <h1>Step {index + 1}</h1>
            <div></div>
          </div>
        );
      })}
    </div>
  );
};

export default ResultSection;
