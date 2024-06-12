import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { LightInputAtom, WorkFunctionAtom } from "./store";

// const GraphsPhotoElectric = () => {
//   // return (
//   {
//     /* <svg
//         style={{
//           width: "40vh",
//           height: "50vh",
//         }}
//         viewBox="0 0 1000 1000"
//         xmlns="http://www.w3.org/2000/svg"
//         strokeWidth="4  "
//         stroke="black"
//         fill="none"
//       >
//         <line x1="500" y1="0" x2="500" y2="1000" />
//         <line x1="0" y1="500" x2="1000" y2="500" />
//       </svg> */
//   }
//   return (
//     <div>
//       <h1 className="text-2xl">Energy of Electron vs Frequency</h1>
//       <KMaxVsFrequencyGraph />
//     </div>
//   );
// };

const GraphsPhotoElectric = () => {
  const workFunction = useAtomValue(WorkFunctionAtom);

  const yAxisScale = 80;
  const xAxisScale = 300;
  const xAxisLevel = 800;
  return (
    <div className="m-auto">
      <h1 className="md:text-2xl text-center">
        Energy of Electron vs Frequency
      </h1>

      <svg
        className="md:h-[80vh]"
        // style={{
        //   width: "50vw",
        //   height: "50vh",
        // }}
        viewBox="-30 -30 1050 1050"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth="4"
        stroke="black"
        fill="none"
        transform="translate(1 1) scale(1 1)"
      >
        {/* x and y axis in the bottom*/}
        <line x1="0" y1={xAxisLevel} x2="1000" y2={xAxisLevel} />
        <line x1="100" y1="0" x2="100" y2="900" />

        {/* grid lines */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            x1={250 + 150 * i}
            y1="0"
            x2={250 + 150 * i}
            y2={xAxisLevel}
            stroke="black"
            strokeWidth={1}
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            x1="100"
            y1={xAxisLevel - yAxisScale * (i + 1)}
            x2="1000"
            y2={xAxisLevel - yAxisScale * (i + 1)}
            stroke="black"
            strokeWidth={1}
          />
        ))}

        {/* ticks showing axis values */}
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={i}>
            <line
              x1={250 + 150 * i}
              y1={xAxisLevel - 20}
              x2={250 + 150 * i}
              y2={xAxisLevel + 20}
              strokeWidth={6}
            />
            <text
              x={250 + 150 * i}
              y={xAxisLevel + 50}
              fontSize="30"
              strokeWidth={2}
              textAnchor="middle"
            >
              {(i + 1) * 0.5}
            </text>
          </g>
        ))}

        {/* x axis legend */}
        {/* <text x="550" y="950" fontSize="56" textAnchor="middle">
        Frequency ( x 10^15 Hz)
      </text> */}
        <foreignObject
          x="150"
          y="430"
          width="350"
          height="100"
          transform="scale(2 2)"
        >
          <p className="text-xl">
            Frequency ( x10<sup>15</sup> Hz)
          </p>
        </foreignObject>

        {/* y axis Legend */}
        {/* <text
        x="20"
        y="500"
        fontSize="56"
        textAnchor="middle"
        transform="rotate(-90 20,500)"
      >
        Energy (eV)
      </text> */}
        <foreignObject
          x="-100"
          y="218"
          width="350"
          height="100"
          transform="rotate(-90 20,500) scale(2 2)"
        >
          <p className="text-xl">Energy (eV)</p>
        </foreignObject>

        {/* ticks showing y axis values */}
        {Array.from({ length: 10 }).map((_, i) => (
          <g key={i}>
            <line
              x1="80"
              y1={xAxisLevel - yAxisScale * (i + 1)}
              x2="120"
              y2={xAxisLevel - yAxisScale * (i + 1)}
              strokeWidth={6}
            />
            <text
              x="50"
              y={xAxisLevel - yAxisScale * (i + 1) + 10}
              fontSize="30"
              strokeWidth="2"
              textAnchor="middle"
            >
              {i + 1}
            </text>
          </g>
        ))}

        {/* 1.6e-19/6.626e-34 = 0.2415e15  */}
        {/* for max 3e15 Hz, eV = 12.42375eV - WorkFunction */}
        <polyline
          points={`100,${xAxisLevel} ${
            100 + workFunction * xAxisScale * 0.2415
          } ${xAxisLevel}  1000 , ${
            xAxisLevel - (12.42375 - workFunction) * yAxisScale
          }`}
          stroke="blue"
          strokeWidth={6}
        />

        {/* some info, slope = plancks constant */}
        {/* <foreignObject
          x="30"
          y="45"
          width="350"
          height="100"
          transform="scale(2 2)"
        > */}
        {/* <MathJax>{`\\(\\text{Slope} = ${workFunction}\\) eV`}</MathJax> */}
        {/* <p className="text-xl">Slope = h =</p> */}
        {/* </foreignObject> */}

        <IndicatorPoint
          xAxisLevel={xAxisLevel}
          yAxisScale={yAxisScale}
          xAxisScale={xAxisScale}
        />
      </svg>
    </div>
  );
};

const IndicatorPoint = ({
  xAxisLevel,
  yAxisScale,
  xAxisScale,
}: {
  xAxisLevel: number;
  yAxisScale: number;
  xAxisScale: number;
}) => {
  const { wavelength } = useAtomValue(LightInputAtom);
  const workFunction = useAtomValue(WorkFunctionAtom);

  const minFToEmitElectron = useMemo(
    () => workFunction / 4.12145,
    [workFunction]
  );
  const frequency = useMemo(() => 300 / wavelength, [wavelength]);
  const energy = useMemo(
    () => Math.max(4.12145 * frequency - workFunction, 0),
    [frequency, workFunction]
  );

  return (
    <g>
      <circle
        cx={100 + frequency * xAxisScale}
        cy={xAxisLevel - energy * yAxisScale}
        r="10"
        fill="red"
      />
      {/* <text
        x={100 + frequency * xAxisScale}
        y={xAxisLevel - energy * yAxisScale - 40}
        fontSize="40"
        textAnchor="middle"
      >
        {energy.toFixed(2)} eV
      </text> */}
      <foreignObject
        x="60"
        y="10 "
        width="150"
        height="100"
        transform="scale(2 2)"
      >
        <div className="bg-white text-left text-xl border-2">
          Slope = h <br />E<sub>k(max)</sub> = {energy.toFixed(2)} eV <br />
          <i>f</i> = {frequency.toFixed(2)} THz
        </div>
      </foreignObject>

      <foreignObject
        x={minFToEmitElectron * xAxisScale}
        y={500}
        width={160}
        height={100}
        transform="translate(-100 -300) scale(1.5 1.5)"
      >
        <div className="text-xl text-left bg-white border-2">
          <span className="">To emit electron:</span>
          <br />f<sub>min</sub> = {minFToEmitElectron.toFixed(2)} THz <br />λ
          <sub>max</sub> = {(300 / minFToEmitElectron).toFixed(2)} nm
        </div>
      </foreignObject>

      <line
        strokeDasharray={"15,15"}
        x1={100 + minFToEmitElectron * xAxisScale}
        x2={100 + minFToEmitElectron * xAxisScale}
        y1="600"
        y2="800"
        stroke="black"
        strokeWidth={6}
      />
    </g>
  );
};
export default GraphsPhotoElectric;
