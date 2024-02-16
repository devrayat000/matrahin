import { MathJax } from "better-react-mathjax";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import Chart from "react-google-charts";
import { pendulumStore } from "./store";

const Graphs = () => {
  const { angle, length, mass, gravity } = useAtomValue(
    pendulumStore.submittedInputsAtom
  );
  const options = {
    titleTextStyle: {
      fontSize: 25,
      bold: true,
      italic: false,
      color: "black",
    },

    // vAxis: { gridlines: { count: 10 } },
    curveType: "function",
    // aggregationTarget: "category",
    // selectionMode: "multiple",
    // Trigger tooltips
    // on selections.
    // tooltip: { trigger: "selection" },
    legend: {
      position: "none",
    },
    // animation: {
    //   duration: 1000,
    //   easing: "out",
    //   startup: true,
    // },
  };

  const graph = useMemo(
    () => [
      // T vs l
      {
        data: [
          ["Length", "Time Period"],
          ...Array.from({ length: 1000 }, (_, i) => [
            i / 100,
            2 * Math.PI * Math.sqrt(i / 100 / gravity),
          ]),
        ],
        title: "Time Period vs Length (θ < 10°)",
        hAxisTitle: "Length (m)",
        vAxisTitle: "Time Period (s)",
        formula: ` 
        $$
        \\begin{align*}
         T &=2\\pi\\sqrt{\\frac{l}{g}} = \\frac{2\\pi}{\\sqrt{g}} \\cdot \\sqrt{l} \\\\
         y &= c \\cdot \\sqrt{x} \\implies y^2 = c^2 \\cdot x \\text{ (Parabola)}
         \\\\
         \\text{where c }&= \\frac{2\\pi}{\\sqrt{g}} \\text{ , g = ${gravity} } m/s^2
        \\end{align*}
       $$ `,
      },
      // T vs g
      {
        data: [
          ["Gravity", "Time Period"],
          ...Array.from({ length: 1000 }, (_, i) => {
            const g = i / 100;
            const T = 2 * Math.PI * Math.sqrt(length / g);
            return [g, T];
          }),
        ],
        title: "Time Period vs Gravity (θ < 10°)",
        hAxisTitle: "Gravity (m/s²)",
        vAxisTitle: "Time Period (s)",
        formula: ` 
               
                \\begin{align*}
                T &= 2π\\sqrt{\\frac{l}{g}} = 2π\\sqrt{l} \\cdot \\frac{1}{\\sqrt{g}} \\\\
                y &= c \\cdot \\frac{1}{\\sqrt{x}}      \\\\
                \\text{where c }&= 2π\\sqrt{l} \\space ,\\space  l = ${length} m
                \\end{align*}
                
                 `,
      },
      // T^2 vs l graph
      {
        data: [
          ["Length", "Time Period Squared"],
          ...Array.from({ length: 1000 }, (_, i) => [
            i / 100,
            (4 * Math.PI * Math.PI * i) / 980,
          ]),
        ],
        title: "Time Period Squared vs Length (θ < 10°)",
        hAxisTitle: "Length (m)",
        vAxisTitle: "Time Period Squared (s²)",
        formula: ` 
            
              \\begin{align*} 
                T^2 &= 4π^2\\frac{l}{g} = \\frac{4π^2}{g} \\cdot l \\\\
                y &= m \\cdot x\\space \\text{(Straight Line)} \\\\
                \\text{where m  } &= \\frac{4π^2}{g} \\text{(slope) , } g = ${gravity} m/s^2
              \\end{align*}    
             
          `,
      },
      // a vs angle graph
      {
        data: [
          ["Angle", "Acceleration"],
          ...Array.from(
            { length: (2 * Math.abs(angle)) / 0.1 + 1 },
            (_, index) => [
              -angle + index * 0.1,
              9.8 * Math.sin((Math.PI * (-angle + index * 0.1)) / 180),
            ]
          ),
        ],
        title: "Acceleration vs Angle",
        hAxisTitle: "Angle (°)",
        vAxisTitle: "Acceleration (m/s²)",
        formula: ` 
            
              \\begin{align*} 
                a &= g \\cdot sin(\\theta) \\\\
                y &= A \\cdot sin(\\theta) \\text{    (Sine)} \\\\
                \\text{where } A &= g = ${gravity} m/s^2 \\space, \\space \\theta_{max} = ${angle}^\\circ \\\\
                \\text{For } a_{max}& ,\\space \\theta =\\theta_{max} = \\alpha = ${angle}^\\circ \\\\

                 a_{max} &= g sin(${angle}) = ${(
          Math.sin((angle * Math.PI) / 180) * gravity
        ).toFixed(2)} ms^{-2} \\\\

            \\text{For } a_{min}&\\space ,\\space \\theta = 0^\\circ \\\\
            a_{min} &= gsin0^\\circ = 0 ms^{-2}
              \\end{align*}    
            
          `,
      },
      // velocity vs angle graph
      {
        data: [
          ["Angle", "Velocity"],
          ...Array.from({ length: (2 * angle) / 0.1 + 1 }, (_, index) => [
            -angle + index * 0.1,
            Math.sqrt(
              2 *
                gravity *
                length *
                (Math.cos((Math.PI * (angle - index * 0.1)) / 180) -
                  Math.cos((Math.PI * angle) / 180))
            ),
          ]),
        ],
        title: "Velocity vs Angle",
        hAxisTitle: "Angle (°)",
        vAxisTitle: "Velocity (m/s)",
        formula: ` 
            
              \\begin{align*} 
                v &= \\sqrt{2gl (  cos\\theta -cos\\alpha )} \\\\
                \\text{where } l &= ${length} m ,\\space g = ${gravity} ms^{-2} \\text{ and } \\alpha = ${angle}^\\circ \\\\
                \\text{For } v_{max}& \\space ,\\space cos\\theta = 1 \\implies \\theta = 0^\\circ  \\\\
                v_{max} &= \\sqrt{2gl(1 - cos${angle}^\\circ)} 
                = ${Math.sqrt(
                  2 * gravity * length * (1 - Math.cos((angle * Math.PI) / 180))
                ).toFixed(2)} ms^{-1} \\\\


                \\text{For } v_{min} &\\space ,\\space cos\\theta = cos \\alpha \\implies \\theta = \\alpha= ${angle}  \\\\
                v_{min} &= \\sqrt{2gl(cos${angle}^\\circ - cos${angle}^\\circ)} = 0 ms^{-1}
              \\end{align*}    
            
          `,
      },
      // potential energy vs angle graph
      {
        data: [
          ["Angle", "Potential Energy"],
          ...Array.from({ length: (2 * angle) / 0.1 + 1 }, (_, index) => [
            -angle + index * 0.1,
            mass *
              gravity *
              length *
              (1 - Math.cos((Math.PI * (-angle + index * 0.1)) / 180)),
          ]),
        ],

        title: "Potential Energy vs Angle",
        hAxisTitle: "Angle (°)",
        vAxisTitle: "Potential Energy (J)",
        formula: ` 
            
              \\begin{align*} 
                E_p &= mgh = mgl(1 - cos\\theta) \\\\
                y &=  mgl( 1 - cos\\theta) \\\\
                y&= mgl\\cdot 2 sin^2(\\frac{\\theta}{2}) \\text{ (Squared Sine)}   \\\\
                
                \\text{where } m &= ${mass} kg ,\\space g = ${gravity} ms^{-2} ,\\space l = ${length} m \\\\
                \\text{For } E_{p_{max}}& ,\\space \\theta =\\theta_{max} = \\alpha = ${angle}^\\circ \\\\
                E_{p_{max}} &= mgl(1 - cos${angle}^\\circ) 
                = ${(
                  mass *
                  gravity *
                  length *
                  (1 - Math.cos((angle * Math.PI) / 180))
                ).toFixed(2)} J \\\\

                \\text{For } E_{p_{min}}&\\space ,\\space \\theta = 0^\\circ \\\\
                E_{p_{min}} &= mgl(1 - cos0^\\circ) = 0 J
               \\end{align*}    
            
          `,
      },
      // Kinetic energy vs angle graph
      {
        data: [
          ["Angle", "Kinetic Energy"],
          ...Array.from({ length: (2 * angle) / 0.1 + 1 }, (_, index) => [
            -angle + index * 0.1,
            mass *
              gravity *
              length *
              (Math.cos((Math.PI * (-angle + index * 0.1)) / 180) -
                Math.cos((Math.PI * angle) / 180)),
          ]),
        ],

        title: "Kinetic Energy vs Angle",
        hAxisTitle: "Angle (°)",
        vAxisTitle: "Kinetic Energy (J)",
        formula: ` 
            
              \\begin{align*} 
                E_k &= \\frac{1}{2}mv^2 = mgl(cos\\theta - cos\\alpha) \\\\
                E_k&= mgl(cos\\theta - cos${angle}^\\circ) \\\\
                
                \\text{where } m &= ${mass} kg ,\\space g = ${gravity} ms^{-2} ,\\space l = ${length} m \\\\
                \\text{For } E_{k_{max}}& ,\\space cos\\theta = 1 \\implies \\theta = 0^\\circ  \\\\
                E_{k_{max}} &= mgl(1 - cos${angle}^\\circ) 
                = ${(
                  mass *
                  gravity *
                  length *
                  (1 - Math.cos((angle * Math.PI) / 180))
                ).toFixed(2)} J \\\\

                \\text{For } E_{k_{min}}&\\space ,\\space \\theta =\\theta_{max} = \\alpha = ${angle}^\\circ \\\\
                E_{k_{min}} &= mgl(cos${angle}^\\circ - cos${angle}^\\circ) = 0 J
               \\end{align*}    
            
          `,
      },
      // kinetic and potential energy vs angle graph
      {
        data: [
          ["Angle", "Ep", "Ek", "E"],
          ...Array.from({ length: (2 * angle) / 0.1 + 1 }, (_, index) => [
            -angle + index * 0.1,
            mass *
              gravity *
              length *
              (1 - Math.cos((Math.PI * (-angle + index * 0.1)) / 180)),
            mass *
              gravity *
              length *
              (Math.cos((Math.PI * (-angle + index * 0.1)) / 180) -
                Math.cos((Math.PI * angle) / 180)),
            mass * gravity * length * (1 - Math.cos((Math.PI * angle) / 180)),
          ]),
        ],
        title: "Energy vs Angle",
        hAxisTitle: "Angle (°)",
        vAxisTitle: "Energy (J)",
        formula: ` 
            
              \\begin{align*} 
                E &= E_p + E_k \\\\
                E &= mgl(1 - cos\\theta) + mgl(cos\\theta - cos\\alpha) \\\\
                E &= mgl(1 - cos\\alpha) \\\\
                \\text{where } m &= ${mass} kg ,\\space g = ${gravity} ms^{-2} ,\\space l = ${length} m \\\\
                \\text{Total} &\\text{ Energy is constant, }\\\\
                \\space E_{total} &= mgl(1 - cos\\alpha) = ${(
                  mass *
                  gravity *
                  length *
                  (1 - Math.cos((angle * Math.PI) / 180))
                ).toFixed(2)} J
               \\end{align*}    
            
          `,
      },
    ],
    [angle, length, mass, gravity]
  );

  return (
    <>
      <p className="text-center text-3xl pt-3">Graphs</p>
      <hr className="my-2 w-5/6" />
      <div className="flex flex-col md:flex-row flex-wrap gap-2 m-2 md:gap-0 md:m-0 md:items-start items-center justify-center">
        {graph.map((g, i) => (
          <div key={i} className="w-full md:w-1/3  ">
            <Chart
              options={{
                ...options,
                title: g.title,
                titleTextStyle: {
                  italic: false,
                  bold: true,
                  fontSize: 20,
                  color: "black",
                },
                legend: {
                  position: i === 7 ? "bottom" : "none",
                },
                hAxis: {
                  title: g.hAxisTitle,
                },
                vAxis: {
                  title: g.vAxisTitle,
                },
              }}
              height={500}
              chartType="LineChart"
              loader={<div>Loading Graphs...</div>}
              data={g.data}
              rootProps={{ "data-testid": "1" }}
            />

            <span className="text-lg">
              <MathJax
                dynamic={true}
                renderMode="pre"
                text={g.formula}
                typesettingOptions={{
                  fn: "tex2chtml",
                }}
              />
            </span>
            <hr className="my-2 w-5/6  md:w-0 md:my-0" />
          </div>
        ))}
      </div>
    </>
  );
};

export default Graphs;
