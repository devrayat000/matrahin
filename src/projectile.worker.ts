import { exposeWorker } from "react-hooks-worker";

function getProjectileMotion(time: number) {
  const data = new Array(100)
    .fill(0)
    .map((_, i) => ({ time, position: 3 + Math.sin((i / 100) * time) }));

  console.log("running worker", data);
  return [data];
}

exposeWorker(getProjectileMotion);
