import { useAtomValue } from "jotai";
import Chart from "react-google-charts";
import {
  accelerationAtom,
  displacementAtom,
  finalVelocityAtom,
  initialVelocityAtom,
  timeAtom,
} from "./store";

const MotionGraphs1D = () => {
  const s = Number(useAtomValue(displacementAtom));
  const u = Number(useAtomValue(initialVelocityAtom));
  const v = Number(useAtomValue(finalVelocityAtom));
  const a = Number(useAtomValue(accelerationAtom));
  const t = Number(useAtomValue(timeAtom));

  // console.log(s, u, v, a, t);
  const factor = 1000;

  const graph = [
    {
      data: [
        ["time", "s"],
        ...Array.from({ length: t * factor + 1 }, (_, i) => [
          i / factor,
          (u * i) / factor + 0.5 * a * (i / factor) ** 2,
        ]),
      ],
      title: "Displacement vs Time",
      hAxisTitle: "Time (t)",
      vAxisTitle: "Displacement (s)",
    },
    // v vs t
    {
      data: [
        ["time", "v"],
        ...Array.from({ length: t * factor + 1 }, (_, i) => [
          i / factor,
          u + a * (i / factor),
        ]),
      ],
      title: "Velocity vs Time",
      hAxisTitle: "Time (t)",
      vAxisTitle: "Velocity (v)",
    },
    // v vs s
    {
      data: [
        ["s", "v"],
        ...Array.from({ length: s * factor + 1 }, (_, i) => [
          i / factor,
          Math.sqrt(u ** 2 + 2 * a * (i / factor)),
        ]),
      ],
      title: "Velocity vs Displacement",
      hAxisTitle: "Displacement (s)",
      vAxisTitle: "Velocity (v)",
    },

    // a vs t
    {
      data: [
        ["time", "a"],
        ...Array.from({ length: t * factor + 1 }, (_, i) => [i / factor, a]),
      ],
      title: "Acceleration vs Time",
      hAxisTitle: "Time (t)",
      vAxisTitle: "Acceleration (a)",
    },
  ];

  const options = {
    titleTextStyle: {
      fontSize: 25,
      bold: true,
      italic: false,
      color: "black",
    },

    series: {
      0: { curveType: "function" },
    },
    legend: {
      position: "none",
    },
  };

  return (
    // <div className="flex flex-col md:flex-row flex-wrap items-center gap-4">
    <div className="flex flex-col flex-wrap w-full md:flex-row m-2 items-center justify-between  ">
      {graph.map((g, i) => (
        <div key={i} className="md:w-1/2">
          <Chart
            chartType="LineChart"
            height={500}
            data={g.data}
            loader={<div>Loading Graphs...</div>}
            options={{
              ...options,
              title: g.title,
              titleTextStyle: {
                italic: false,
                bold: true,
                fontSize: 20,
                color: "black",
              },
              hAxis: {
                title: g.hAxisTitle,
              },
              vAxis: {
                title: g.vAxisTitle,
              },
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default MotionGraphs1D;
