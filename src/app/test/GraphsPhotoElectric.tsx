import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { LightInputAtom, WorkFunctionAtom } from "./store";

const GraphsPhotoElectric = () => {
  return (
    <div className="flex flex-row items-start justify-evenly gap-3 flex-wrap">
      {/* <svg
        style={{
          width: "40vh",
          height: "50vh",
        }}
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth="4  "
        stroke="black"
        fill="none"
      >
        <line x1="500" y1="0" x2="500" y2="1000" />
        <line x1="0" y1="500" x2="1000" y2="500" />
      </svg> */}
      <div>
        <h1 className="text-2xl">Energy of Electron vs Frequency</h1>
        <KMaxVsFrequencyGraph />
      </div>
    </div>
  );
};

export default GraphsPhotoElectric;

const KMaxVsFrequencyGraph = () => {
  const workFunction = useAtomValue(WorkFunctionAtom);

  const yAxisScale = 80;
  const xAxisScale = 300;
  const xAxisLevel = 800;
  return (
    <svg
      style={{
        width: "50vw",
        height: "50vh",
      }}
      viewBox="-30 -30 1050 1050"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="4"
      stroke="black"
      fill="none"
      // transform="translate(-30 100) scale(1.5 1.5)"
    >
      {/* x and y axis in the bottom*/}
      <line x1="0" y1={xAxisLevel} x2="1000" y2={xAxisLevel} />
      <line x1="100" y1="0" x2="100" y2="1000" />

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
            strokeWidth={10}
          />
          <text
            x={250 + 150 * i}
            y={xAxisLevel + 80}
            fontSize="40"
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
        y="450"
        width="350"
        height="100"
        transform="scale(2 2)"
      >
        <p className="text-3xl">
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
        <p className="text-3xl">Energy (eV)</p>
      </foreignObject>

      {/* ticks showing y axis values */}
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={i}>
          <line
            x1="80"
            y1={xAxisLevel - yAxisScale * (i + 1)}
            x2="120"
            y2={xAxisLevel - yAxisScale * (i + 1)}
            strokeWidth={10}
          />
          <text
            x="50"
            y={xAxisLevel - yAxisScale * (i + 1) + 10}
            fontSize="40"
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
        strokeWidth={10}
      />

      {/* some info, slope = plancks constant */}
      <foreignObject
        x="50"
        y="45"
        width="350"
        height="100"
        transform="scale(2 2)"
      >
        {/* <MathJax>{`\\(\\text{Slope} = ${workFunction}\\) eV`}</MathJax> */}
        <p className="text-2xl">
          Slope = h = 6.626 x 10 <sup>-34</sup> J.s
        </p>
      </foreignObject>

      <IndicatorPoint
        xAxisLevel={xAxisLevel}
        yAxisScale={yAxisScale}
        xAxisScale={xAxisScale}
      />
    </svg>
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
        r="20"
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
        x="80"
        y="85"
        width="300"
        height="100"
        transform="scale(2 2)"
      >
        <p className="text-xl text-left">
          E<sub>k(max)</sub> = {energy.toFixed(2)} eV
        </p>

        <p className="text-xl text-left">
          <i>f</i> = {frequency.toFixed(2)} THz
        </p>
      </foreignObject>
    </g>
  );
};
