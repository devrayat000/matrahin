// @ts-nocheck

import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { Chart } from "react-google-charts";
import { pointsAtom } from "./AnimationHelper";

const GraphsBasic = () => {
  const points = useAtomValue(pointsAtom);

  const resultPoints = useMemo(() => {
    // skip the intermediate points and contains only about 50 points
    const skip = Math.floor(points.length / 50);
    const reducedPoints = points.filter((_, i) => i % skip === 0);

    // also take the last point
    return [...reducedPoints, points[points.length - 1]];
  }, [points]);
  // console.log("resultPoints");
  const graph = useMemo(
    () => [
      {
        data: [
          ["time", "y"],
          ...resultPoints.map((point) => [point.t, point.y]),
        ],
        title: "Height vs Time",
        hAxisTitle: "Time (t)",
        vAxisTitle: "Height (m)",
      },
      {
        data: [["x", "y"], ...resultPoints.map((point) => [point.x, point.y])],
        title: "Height vs Distance",
        hAxisTitle: "Distance (x)",
        vAxisTitle: "Height (m)",
      },
      {
        data: [
          ["time", "v"],
          ...resultPoints.map((point) => [
            point.t,
            Math.sqrt(point.vx ** 2 + point.vy ** 2),
          ]),
        ],
        title: "Speed vs Time",
        hAxisTitle: "Time (t)",
        vAxisTitle: "Speed (m/s)",
      },
      {
        data: [
          ["theta", "v"],
          ...resultPoints.map((point) => [
            Math.atan2(point.vy, point.vx) * (180 / Math.PI),
            Math.sqrt(point.vx ** 2 + point.vy ** 2),
          ]),
        ],
        title: "Speed vs Angle",
        hAxisTitle: "Angle (θ)",
        vAxisTitle: "Speed (m/s)",
      },
      {
        data: [
          ["time", "vy"],
          ...resultPoints.map((point) => [point.t, point.vy]),
        ],
        title: "Vy vs Time",
        hAxisTitle: "Time (t)",
        vAxisTitle: "Vy (m/s)",
      },
    ],
    [resultPoints]
  );
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
    <div className="flex flex-col flex-wrap w-full md:flex-row m-2 items-center justify-between  ">
      {graph.map((g, i) => (
        <div key={i} className="md:w-1/2">
          <Chart
            loader={<div>Loading Graphs...</div>}
            chartType="LineChart"
            // width="1000"
            height={500}
            data={g.data}
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

export default GraphsBasic;
