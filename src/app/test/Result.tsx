"use client";

import { Canvas } from "@react-three/fiber";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { useAtomValue } from "jotai";
import * as THREE from "three";
import { RainVelocityResultsType, resultAtom } from "./store";

const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
};

// const FinalResult = ({ v_rain, v_wind_object }: RainVelocityResultsType) => {
//   const resultAngle = (Math.atan2(-v_rain, v_wind_object) * 180) / Math.PI;

//   const vectorSum = () => (
//     <MathJax>
//       Velocity of rain relative to object:
//       {`
//         $$\\begin{gather}
//           \\overrightarrow{V}_{ro} = \\overrightarrow{V}_{rain} + \\overrightarrow{V}_{wo}  = ${v_wind_object.toFixed(
//             2
//           )}\\hat{i}- ${v_rain}\\hat{j} \\\\
//         \\end{gather}$$
//       `}
//     </MathJax>
//   );
//   const MagnitudeAndAngle = () => (
//     <MathJax>
//       Magnitude and Angle of rain relative to object:
//       {`
//         $$\\begin{gather}

//           \\left|\\overrightarrow{V}_{ro}\\right| = \\sqrt{(${v_wind_object.toFixed(
//             2
//           )})^2 + (${v_rain})^2} = ${Math.sqrt(
//         v_wind_object ** 2 + v_rain ** 2
//       ).toFixed(2)}\\space unit \\\\
//           \\theta = tan^{-1}\\left(\\frac{-${v_rain}}{${v_wind_object.toFixed(
//         2
//       )}}\\right) = ${resultAngle.toFixed(2)}^\\circ \\ \\\\
//         \\end{gather}$$

//         `}
//     </MathJax>
//   );

//   const UmbrellaPosition = () => (
//     <MathJax>
//       So, Umbrella should be tilted at ,{" "}
//       {`$
//           \\theta =180^\\circ ${resultAngle.toFixed(2)}^\\circ \\  = ${(
//         180 + resultAngle
//       ).toFixed(2)}^\\circ
//         $`}
//     </MathJax>
//   );
//   return (
//     <p>
//       <b>Step: 3</b>
//       <br />
//       {vectorSum()}
//       {MagnitudeAndAngle()}
//       {UmbrellaPosition()}
//     </p>
//   );
// };
const FinalResult = ({ v_rain, v_wind_object }: RainVelocityResultsType) => {
  const resultAngle = (Math.atan2(-v_rain, v_wind_object) * 180) / Math.PI;

  // Combine the calculations into a single function for clarity and efficiency
  const calculateAndRenderResults = () => {
    const magnitude = Math.sqrt(v_wind_object ** 2 + v_rain ** 2).toFixed(2);

    return (
      <>
        <MathJax key={"1"}>
          Velocity of rain relative to object:
          {`
            $$\\begin{gather}
              \\overrightarrow{V}_{ro} = \\overrightarrow{V}_{rain} + \\overrightarrow{V}_{wo} = ${v_wind_object.toFixed(
                2
              )}\\hat{i}- ${v_rain}\\hat{j} \\\\
            \\end{gather}$$
          `}
        </MathJax>
        <MathJax key={"2"}>
          Magnitude and Angle of rain relative to object:
          {`
            $$\\begin{gather}
              \\left|\\overrightarrow{V}_{ro}\\right| = \\sqrt{(${v_wind_object.toFixed(
                2
              )})^2 + (${v_rain})^2} = ${magnitude}\\space unit \\\\
              \\theta = tan^{-1}\\left(\\frac{-${v_rain}}{${v_wind_object.toFixed(
            2
          )}}\\right) = ${resultAngle.toFixed(2)}^\\circ \\\\
            \\end{gather}$$
          `}
        </MathJax>
      </>
    );
  };

  const UmbrellaPosition = () => (
    <MathJax key={"3"}>
      So, Umbrella should be tilted at,{" "}
      {`$
        \\theta = 180^\\circ - ${resultAngle.toFixed(2)}^\\circ = ${(
        180 + resultAngle
      ).toFixed(2)}^\\circ
      $`}
    </MathJax>
  );

  return (
    <p>
      <b>Step: 3</b>
      <br />
      {calculateAndRenderResults()}
      {UmbrellaPosition()}
    </p>
  );
};

const InitializeVariables = ({
  v_object,
  v_wind,
  v_rain,
}: RainVelocityResultsType) => {
  return (
    <div className="self-start">
      <b>Step: 1</b>
      <br />
      Initialize variables:
      <MathJax>
        {`
        $\\begin{gather}
        Velocity\\space of\\space  Rain, \\overrightarrow{V}_{r} = -${v_rain}\\hat{j}\\space unit \\\\ 
        Velocity\\space of\\space  Object, \\overrightarrow{V}_{o} = ${v_object}\\hat{i}\\space unit \\\\
        Velocity\\space of\\space  Wind, \\overrightarrow{V}_{w} = ${v_wind}\\hat{i}\\space unit \\\\
        \\end{gather}$
      `}
      </MathJax>
    </div>
  );
};

const WindSpeedModify = ({
  v_object,
  v_wind,
  v_wind_object,
}: RainVelocityResultsType) => {
  const v_object_str =
    v_object < 0 ? `(${v_object}\\hat{i})` : `${v_object}\\hat{i}`;
  return (
    <p className="lg:self-start">
      <b>Step: 2</b>
      <br />
      Velocity of wind relative to object:
      <MathJax>
        {`
        $$\\begin{gather}
        \\overrightarrow{V}_{wo} = \\overrightarrow{V}_{wind} - \\overrightarrow{V}_{object} \\\\ 
          \\overrightarrow{V}_{wo} = ${v_wind}\\hat{i} - ${v_object_str} \\\\
          \\overrightarrow{V}_{wo} = ${v_wind_object.toFixed(2)}\\hat{i} \\\\
        \\end{gather}$$
      `}
      </MathJax>
    </p>
  );
};

const Result = () => {
  const result = useAtomValue(resultAtom);

  return (
    result.v_object && (
      <div>
        <MathJaxContext version={3} config={config}>
          {/* <div className="w-full md:w-1/2 mb-4 md:mb-0 md:mr-4"> */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <InitializeVariables {...result} />
            <Figure1 />
          </div>

          <WindSpeedModify {...result} />

          <FinalResult {...result} />
        </MathJaxContext>
      </div>
    )
  );
};

export default Result;

const DiagramFirst = () => {
  const results = useAtomValue(resultAtom);

  return (
    <div className="flex flex-col gap-2 ">
      <Canvas>
        <group>
          <arrowHelper
            args={[
              new THREE.Vector3(
                results.v_object / Math.abs(results.v_object),
                0,
                0
              ),
              new THREE.Vector3(0, 0, 0),
              results.v_object,
              0xff0000,
              0.5,
              0.5,
            ]}
          />
          <arrowHelper
            args={[
              new THREE.Vector3(1, 0, 0),
              new THREE.Vector3(0, 0, 0),
              results.v_wind,
              0xff0000,
              0.5,
              0.5,
            ]}
          />
          <arrowHelper
            args={[
              new THREE.Vector3(1, 0, 0),
              new THREE.Vector3(0, 0, 0),
              results.v_wind_object,
              0xff0000,
              0.5,
              0.5,
            ]}
          />
          <arrowHelper
            args={[
              new THREE.Vector3(0, -1, 0),
              new THREE.Vector3(0, 0, 0),
              results.v_rain,
              0xff0000,
              0.5,
              0.5,
            ]}
          />
        </group>
      </Canvas>
    </div>
  );
};
const Figure1 = () => {
  const results = useAtomValue(resultAtom);
  const scale = 15;
  const modifiedResults = {
    v_object: results.v_object * scale,
    v_wind: results.v_wind * scale,
    v_rain: results.v_rain * scale * -1,
    v_wind_object: results.v_wind_object * scale,
    v_rain_object_angle: results.v_rain_object_angle,
    v_rain_object_magnitude: results.v_rain_object_magnitude * scale,
  };

  const center = { x: 175, y: 100 };

  // Offset for the new origin (y = 100)
  const yOriginOffset = 175;

  // Canvas height
  const canvasHeight = 275;

  return (
    <div className="lg:self-start w-[200px] h-[200px]">
      <svg width="350" height={canvasHeight} xmlns="http://www.w3.org/2000/svg">
        {/* <!-- X-axis --> */}
        <line
          x1="0"
          y1={canvasHeight - yOriginOffset}
          x2="350"
          y2={canvasHeight - yOriginOffset}
          stroke="black"
          strokeWidth="2"
        />

        {/* <!-- Y-axis --> */}
        <line
          x1="175"
          y1="0"
          x2="175"
          y2={canvasHeight}
          stroke="black"
          strokeWidth="2"
        />

        {/* <!-- X-axis label --> */}
        <text
          x="325"
          y={canvasHeight - yOriginOffset + 20}
          fontFamily="Arial"
          fontSize="12"
          fill="black"
        >
          X
        </text>

        {/* <!-- Y-axis label --> */}
        <text x="185" y="15" fontFamily="Arial" fontSize="12" fill="black">
          Y
        </text>

        {getArrow(center, {
          length: modifiedResults.v_wind_object,
          axis: "x",
          label: "Vwo",
          color: "blue",
        })}
        {getArrow(center, {
          length: modifiedResults.v_rain,
          axis: "y",
          label: "Vr",
        })}

        {/* final resultant */}
        {getArrow(center, {
          endCoords: {
            x: center.x + modifiedResults.v_wind_object,
            y: center.y - modifiedResults.v_rain,
          },
          label: "Vro",
          color: "red",
        })}
        {getArrow(center, {
          length: modifiedResults.v_object,
          axis: "x",
          label: "Vo",
        })}
        {getArrow(center, {
          length: modifiedResults.v_wind,
          axis: "x",
          label: "Vw",
        })}
      </svg>
    </div>
  );
};

const getArrow = (
  center: { x: number; y: number },
  options: {
    length?: number;
    endCoords?: { x: number; y: number };
    axis?: "x" | "y";
    angle?: number;
    label?: string;
    color?: string;
  }
) => {
  const { length, endCoords, axis, angle, label, color } = options;
  if (length == 0 && !endCoords) return null;
  const uniqueId = getUniqueId();

  if (axis === "x") {
    return (
      <>
        <line
          x1={center.x.toString()}
          y1={center.y.toString()}
          x2={(center.x + length).toString()}
          y2={center.y.toString()}
          stroke="black"
          strokeWidth="2"
          markerEnd={`url(#arrowhead_${uniqueId})`}
        />
        <defs>
          <marker
            id={`arrowhead_${uniqueId}`}
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={color} />
          </marker>
        </defs>
        {label && (
          <text
            x={(center.x + length).toString()}
            y={(center.y - 10).toString()} // Adjust the value as needed
            textAnchor="middle"
          >
            {label}
          </text>
        )}
      </>
    );
  }

  if (axis === "y") {
    return (
      <>
        <line
          x1={center.x.toString()}
          y1={center.y.toString()}
          x2={center.x.toString()}
          y2={(center.y - length).toString()}
          stroke="black"
          strokeWidth="2"
          markerEnd={`url(#arrowhead_${uniqueId})`}
        />
        <defs>
          <marker
            id={`arrowhead_${uniqueId}`}
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={color} />
          </marker>
        </defs>
        {label && (
          <text
            x={(center.x + 10).toString()} // Adjust the value as needed
            y={(center.y - length).toString()}
            textAnchor="start"
          >
            {label}
          </text>
        )}
      </>
    );
  }

  if (endCoords) {
    return (
      <g>
        <line
          x1={center.x.toString()}
          y1={center.y.toString()}
          x2={endCoords.x.toString()}
          y2={endCoords.y.toString()}
          stroke={color}
          strokeWidth="2"
          markerEnd={`url(#arrowhead_${uniqueId})`}
        />
        <defs>
          <marker
            id={`arrowhead_${uniqueId}`}
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={color} />
          </marker>
        </defs>
        {label && (
          <text
            x={(
              endCoords.x +
              (endCoords.x < center.x ? -1 : 1) * 20
            ).toString()}
            y={(
              endCoords.y +
              (endCoords.y < center.x ? 1 : -1) * 30
            ).toString()}
            textAnchor="middle"
          >
            {label}
          </text>
        )}
      </g>
    );
  }

  if (angle !== undefined) {
    const endX = center.x + length * Math.cos(angle);
    const endY = center.y - length * Math.sin(angle);

    return (
      <>
        <line
          x1={center.x.toString()}
          y1={center.y.toString()}
          x2={endX.toString()}
          y2={endY.toString()}
          stroke="black"
          strokeWidth="2"
          markerEnd={`url(#arrowhead_${uniqueId})`}
        />
        <defs>
          <marker
            id={`arrowhead_${uniqueId}`}
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={color} />
          </marker>
        </defs>
        {label && (
          <text
            x={(endX + 20).toString()}
            y={(endY + 20).toString()}
            textAnchor="middle"
          >
            {label}
          </text>
        )}
      </>
    );
  }

  return null;
};
// Counter for generating a unique ID
let arrowCounter = 0;

// Function to get a unique ID
const getUniqueId = () => {
  arrowCounter += 1;
  return arrowCounter;
};
