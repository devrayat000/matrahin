import { MathJax } from "better-react-mathjax";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import Chart from "react-google-charts";
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
        description: `
        \\begin{align*}
          \\text{Equation: } &y = (usin\\theta_0)t - \\frac{1}{2}gt^2 \\\\
          y = ax &- bx^2 \\text{(Parabola)} \\\\
          \\frac{dy}{dt}  = v =& usin\\theta_0 - gt \\\\
          \\frac{d^2y}{dt^2}  = &-g\\\\
        \\end{align*}
        `,
      },
      {
        data: [["x", "y"], ...resultPoints.map((point) => [point.x, point.y])],
        title: "Height vs Distance",
        hAxisTitle: "Distance (x)",
        vAxisTitle: "Height (m)",

        description: `
        \\begin{align*} 
          \\text{Equation: } &y = xtan\\theta_0 - \\frac{gx^2}{2u^2cos^2\\theta_0} \\\\
          y = ax &- bx^2 \\text{(Parabola)} \\\\
          \\text{Where,} 
          a &= tan\\theta_0, \\space b = \\frac{g}{2u^2cos^2\\theta_0} \\\\
          
          \\end{align*} 
        `,
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

        description: `
        \\begin{align*}
          &\\text{Equation: } \\\\
          v &= \\sqrt{(v_x^2 + v_y^2)} \\\\
          v &= \\sqrt{(ucos\\theta_0)^2 + (usin\\theta_0 - gt)^2} \\\\
          
          v &= \\sqrt{u^2 - 2usin\\theta_0 gt + g^2t^2} \\\\
          v &= \\sqrt{u^2 + g^2t^2 - 2usin\\theta_0 gt} \\\\
          v^2 &= u^2 + g^2t^2 - 2usin\\theta_0 gt \\\\
          \\implies y &= c + ax^2 - bx \\text{(Parabola)} \\\\
        \\end{align*}
        `,
      },

      {
        data: [
          ["time", "vy"],
          ...resultPoints.map((point) => [point.t, point.vy]),
        ],
        title: "Vy vs Time",
        hAxisTitle: "Time (t)",
        vAxisTitle: "Vy (m/s)",

        description: `
        \\begin{align*}
          \\text{Equation: } v_y =& usin\\theta_0 - gt \\\\
          v_y = c -& mx \\text{ (Straight Line)} \\\\
          \\frac{dv_y}{dt} & = -g \\\\
          \\text{slope of the} & \\text{ line} = -g
        \\end{align*}
        `,
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

        description: `
          \\begin{align*}
          \\text{Equation: } &v = \\sqrt{(v_x^2 + v_y^2)} \\\\
          \\theta = tan^{-1} &\\left(\\frac{v_y}{v_x}\\right) \\\\

          \\end{align*}
        `,
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
    <div className="flex flex-col w-full md:flex-row md:flex-wrap m-2 items-center md:items-start justify-evenly  ">
      {graph.map((g, i) => (
        <div key={i} className=" w-5/6 md:w-1/2">
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
          <span className="text-lg md:text-2xl">
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

export default GraphsBasic;
