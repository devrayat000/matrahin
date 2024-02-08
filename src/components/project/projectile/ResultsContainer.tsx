import { useAtomValue } from "jotai";

import ResultTable from "./ResultTable";
// import Graphs from "./Graphs";
import GraphsBasic from "./GraphsBasic";
import ProjectileMotion from "./MotionCanvas";
import { projectileAtom } from "./store";

export default function ResultsContainer() {
  const projectileParams = useAtomValue(projectileAtom);

  if (!projectileParams) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-10 items-center justify-around lg:items-start">
        <ProjectileMotion />
        <ResultTable />
      </div>
      <GraphsBasic />
      {/* <Chart /> */}
    </>
  );
}
