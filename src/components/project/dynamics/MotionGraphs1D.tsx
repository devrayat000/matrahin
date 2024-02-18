import { MathJax } from "better-react-mathjax";
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
  const factor = 10;

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
      description: `
      \\begin{align*}
          \\text{Equation: } &s = ut + \\frac{1}{2}at^2 \\\\
          y = ax &+ bx^2 \\text{(Parabola)} \\\\

          \\frac{ds}{dt} & = v =  u + at \\\\
          \\frac{d^2s}{dt^2} & = a\\\\
          \\text{slope of the} & \\text{ curve} = a

        \\end{align*}

      `,
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
      description: `
      \\begin{align*}
        \\text{Equation: } &v = u + at \\\\
        y & = mx + c \\text{(Straight Line)} \\\\
        \\text{Differentiating, } \\frac{dv}{dt} & = m =  a \\\\
        slope & = a \\\\
        \\text{Integrating } \\\\
        \\int v dt & = \\int u dt + \\int at dt \\\\
        s & = ut + \\frac{1}{2}at^2 \\\\
        \\text{Area under the curve} & = \\text{Displacement} \\\\
        

      \\end{align*}
      `,
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
      description: `
      \\begin{align*}
        \\text{Equation: } &v^2 = u^2 + 2as \\\\
        y^2 &= c + 2ax \\text{(Parabola)} \\\\
        \\text{Main axis} & = x \\\\
        

      \\end{align*}
      `,
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

      description: `
      \\begin{align*}
        \\text{Equation: } &a = \\text{constant} \\\\
        y & = c \\text{(Straight Line)} \\\\
        \\text{Differentiating} \\\\
        \\frac{da}{dt} & = 0 \\\\
        slope  = 0 \\implies& \\text{ constant acceleration} \\\\
        
        \\end{align*}
        `,
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
        <div key={i} className=" w-full md:w-1/2">
          <Chart
            chartType={i === 1 ? "AreaChart" : "LineChart"}
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
          <span className="text-lg">
            <MathJax
              dynamic={true}
              renderMode="pre"
              text={g.description}
              typesettingOptions={{
                fn: "tex2chtml",
              }}
            />
          </span>
        </div>
      ))}
    </div>
  );
};

export default MotionGraphs1D;
