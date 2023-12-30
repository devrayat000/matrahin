import { useAtomValue } from "jotai";

import ResultTable from "./ResultTable";
// import Graphs from "./Graphs";
import Graphs from "./Graphs";
import ProjectileMotion from "./MotionCanvas";
import { projectileAtom } from "./store";

export default function ResultsContainer() {
  const projectileParams = useAtomValue(projectileAtom);

  if (!projectileParams) {
    return null;
  }

  return (
    <div>
      <div className="flex gap-10 items-start">
        <ProjectileMotion />
        <ResultTable />
      </div>
      <div>
        <Graphs />
      </div>
    </div>
  );
}
