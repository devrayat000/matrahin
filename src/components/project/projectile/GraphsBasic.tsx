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
        \\begin{gather}
          \\text{Equation: } y = (usin\\theta_0)t - \\frac{1}{2}gt^2 \\\\
          y = ax - bx^2 \\text{(Parabola)} \\\\
          \\frac{dy}{dt}  = v = usin\\theta_0 - gt \\\\
          \\frac{d^2y}{dt^2}  = -g   \\text{  (-ve)}  \\\\
          
          y_{max}\\text{ can be}   \\text{ found at}  \\frac{dy}{dt}  =  0 \\\\
          \\implies v = usin\\theta_0  - gt  = 0 \\\\
          \\implies t  = \\frac{usin\\theta_0}{g} \\\\
          \\text{which is half of the Time of flight} \\\\
          \\text{Substituting this value in the y(t)} \\\\
          y  = (usin\\theta_0)t - \\frac{1}{2}gt^2 \\\\
          y_{max} = (usin\\theta_0) \\cdot \\frac{usin\\theta_0}{g} - \\frac{1}{2}g \\cdot \\left(\\frac{usin\\theta_0}{g}\\right)^2 \\\\
          y_{max} = \\frac{u^2sin^2\\theta_0}{g} - \\frac{u^2sin^2\\theta_0}{2g} \\\\
          y_{max} = \\frac{u^2sin^2\\theta_0}{2g} \\\\
           \\text{Maximum Height, }H_{max}   = \\frac{u^2sin^2\\theta_0}{2g}\\\\
          \\text{And,Total time of flight, } T  = \\frac{2 \\cdot u sin\\theta_0}{g}\\\\
        \\end{gather}
        
        `,
      },
      {
        data: [["x", "y"], ...resultPoints.map((point) => [point.x, point.y])],
        title: "Height vs Distance",
        hAxisTitle: "Distance (x)",
        vAxisTitle: "Height (m)",

        description: `
        \\begin{gather} 
          \\text{Equation: } y = xtan\\theta_0 - \\frac{gx^2}{2u^2cos^2\\theta_0} \\\\
          y = ax - bx^2 \\text{(Parabola)} \\\\
          \\text{Where, } 
          a = tan\\theta_0, \\space b = \\frac{g}{2u^2cos^2\\theta_0} \\\\
          \\frac{dy}{dx} = a - 2bx ,
          \\frac{d^2y}{dx^2} = -2b \\text{  (-ve)} \\\\
          h_{max}\\text{ can be found at} \\frac{dy}{dx} = 0 \\\\
          \\implies a - 2bx = 0 
          \\implies x = \\frac{a}{2b}\\\\  
          \\text{which is half of the Horizontal range} \\\\
          \\text{Substituting this value to } y(x) \\\\
          y_{max} = a \\cdot \\frac{a}{2b} - b \\cdot \\left(\\frac{a}{2b}\\right)^2 \\\\
           = \\frac{a^2}{2b}  - \\frac{a^2}{4b} 
           = \\frac{a^2}{4b} 
            = \\frac{tan^2\\theta_0}{4 \\cdot \\frac{g}{2u^2cos^2\\theta_0}} \\\\
            = \\frac{ tan^2\\theta_0 \\cdot u^2cos^2\\theta_0}{2g} 
            = \\frac{u^2sin^2\\theta_0}{2g}\\\\

          x_{max} = 2 \\times \\frac{a}{2b} = \\frac{a}{b} 
          = \\frac{tan\\theta_0}{\\frac{g}{2u^2cos^2\\theta_0}} \\\\
          = \\frac{tan\\theta_0 \\cdot 2u^2cos^2\\theta_0}{g} 
          = \\frac{2u^2sin\\theta_0cos\\theta_0}{g} \\\\
           = \\frac{u^2sin2\\theta_0}{g}\\\\         
          \\text{So, Maximum Height, } h_{max}  = \\frac{u^2sin^2\\theta_0}{2g} \\\\
          \\text{And, Total Horizontal range, } R = \\frac{u^2sin2\\theta_0}{g}\\\
          \\end{gather} 
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
        \\begin{gather}
          \\text{Equation: } \\\\
          v = \\sqrt{(v_x^2 + v_y^2)} \\\\
          v = \\sqrt{(ucos\\theta_0)^2 + (usin\\theta_0 - gt)^2} \\\\
          
          v = \\sqrt{u^2 - 2usin\\theta_0 gt + g^2t^2} \\\\
          v = \\sqrt{u^2 - 2usin\\theta_0 gt + g^2t^2} \\\\
          v^2 = u^2 - 2usin\\theta_0 gt + g^2t^2 \\\\
          \\implies y^2 = c  - bx+ ax^2 \\\
        \\end{gather}
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
        \\begin{gather}
          \\text{Equation: } v_y = usin\\theta_0 - gt \\\\
          v_y = c - mx \\text{ (Straight Line)} \\\\
          \\frac{dv_y}{dt}  = -g \\\\
          \\text{Slope of the}  \\text{ line} = -g
        \\end{gather}
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
          \\begin{gather}
          \\text{Equation: } v = \\sqrt{(v_x^2 + v_y^2)} \\\\
          \\theta = tan^{-1} \\left(\\frac{v_y}{v_x}\\right) \\\\

          \\end{gather}
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
