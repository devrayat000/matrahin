"use client";

import { MathJax } from "better-react-mathjax";
import { useAtomValue } from "jotai";
import { RainVelocityResultsType, resultAtom } from "./store";

const InitializeVariables = ({
  v_object,
  v_wind,
  v_rain,
}: RainVelocityResultsType) => {
  console.log(" in init");
  return (
    <p className="self-start ">
      <b>Step: 1</b>
      <br />
      Initialize variables: Velocity of Rain,{" "}
      <MathJax>{`\\overrightarrow{V}_{r} = -${v_rain}\\hat{j}`}</MathJax> unit
      <br />
      Velocity of Object,{" "}
      <MathJax>{`\\overrightarrow{V}_{o} = ${v_object}\\hat{i}`}</MathJax> unit
      <br />
      Velocity of Wind,{" "}
      <MathJax>{`\\overrightarrow{V}_{w} = ${v_wind}\\hat{i}`}</MathJax> unit //{" "}
    </p>
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
    <p className="self-start">
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

const toDegree = (angle: number) => (angle * 180) / Math.PI;
const Result = () => {
  const result = useAtomValue(resultAtom);
  const {
    v_wind_object,
    v_rain,
    v_rain_object_magnitude: magnitude,
    v_rain_object_angle: resultAngle,
  } = result;

  const calculateAndRenderResults = () => {
    return (
      <p className="self-start">
        <b>Step: 3</b>
        <br />
        Velocity of rain relative to object:
        <MathJax>
          {`
            $$\\begin{gather}
              \\overrightarrow{V}_{ro} = \\overrightarrow{V}_{rain} + \\overrightarrow{V}_{wo} = ${v_wind_object.toFixed(
                2
              )}\\hat{i}- ${v_rain}\\hat{j} \\\\
            \\end{gather}$$
          `}
        </MathJax>
        Magnitude and Angle of rain relative to object:
        <MathJax>
          {`
            $$\\begin{gather}
              \\left|\\overrightarrow{V}_{ro}\\right| = \\sqrt{(${v_wind_object.toFixed(
                2
              )})^2 + (${v_rain})^2} = ${magnitude.toFixed(2)}\\space unit \\\\
              \\theta = tan^{-1}\\left(\\frac{-${
                v_rain < 0 ? `(${v_rain})` : v_rain
              }}{${v_wind_object.toFixed(2)}}\\right) = ${toDegree(
            resultAngle
          ).toFixed(2)}^\\circ \\\\
            \\end{gather}$$
          `}
        </MathJax>
      </p>
    );
  };

  const UmbrellaPosition = (angle: number) => {
    const final_angle = angle > -90 ? Math.abs(angle) : 180 + angle;
    return (
      <p>
        So, Umbrella should be tilted <b>relative to +x axis</b> at ,{" "}
        <MathJax>
          {`$$
          \\theta =180^\\circ ${angle.toFixed(2)}^\\circ \\  = ${(
            180 + angle
          ).toFixed(2)}^\\circ \\\\ 
          $$`}
        </MathJax>
        <b>Relative to the direction of object's velocity: </b>
        <MathJax>
          {`$$
          \\theta = ${final_angle.toFixed(2)}^\\circ \\\\ 
          $$`}
        </MathJax>
      </p>
    );
  };
  const center = { x: 175, y: 100 };

  return (
    result.v_object && (
      <div>
        {/* <div className="w-full md:w-1/2 mb-4 md:mb-0 md:mr-4"> */}
        <div className="flex flex-col ml-4 lg:ml-0 items-center lg:items-start justify-center lg:justify-normal gap-4">
          <div className="flex flex-col md:flex-row ">
            <InitializeVariables {...result} />
            <Figure center={center} />
          </div>

          <WindSpeedModify {...result} />

          {calculateAndRenderResults()}
          {UmbrellaPosition(toDegree(resultAngle))}
        </div>
      </div>
    )
  );
};

export default Result;

const Figure = ({ center }: { center: { x: number; y: number } }) => {
  const results = useAtomValue(resultAtom);
  const scale = 15;
  const modifiedResults = {
    ...results,
    v_object: results.v_object * scale,
    v_wind: results.v_wind * scale,
    v_rain: results.v_rain * scale * -1,
    v_wind_object: results.v_wind_object * scale,
    v_rain_object_angle: results.v_rain_object_angle,
    v_rain_object_magnitude: results.v_rain_object_magnitude * scale,
  };

  // Offset for the new origin (y = 100)
  const yOriginOffset = 175;

  // Canvas height
  const canvasHeight = 275;
  const getPosition = (): {
    x: number;
    y: number;
  } => {
    const length = 54;
    const offset = 125;

    const theta = Math.abs(modifiedResults.v_rain_object_angle);

    return {
      x: center.x - offset * Math.cos(theta) - (length * Math.sin(theta)) / 2,
      y: center.y - offset * Math.sin(theta) + (length * Math.cos(theta)) / 2,
    };
  };

  return (
    <div className="self-start md:w-[180px] md:h-[180px] ">
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

        <text
          x={170 + 40}
          y="140"
          fontFamily="Arial"
          fontSize="12"
          fill="black"
        >
          {Math.abs(
            (modifiedResults.v_rain_object_angle * 180) / Math.PI
          ).toFixed(1)}
          °
        </text>
        <text x={170 + 50} y="80" fontFamily="Arial" fontSize="12" fill="black">
          {(
            180 -
            Math.abs((modifiedResults.v_rain_object_angle * 180) / Math.PI)
          ).toFixed(1)}
          °
        </text>

        {/* umbrella */}
        {modifiedResults.helperText === undefined ? (
          <g>
            <line
              x1={center.x.toString()}
              y1={center.y.toString()}
              x2={(center.x - modifiedResults.v_wind_object).toString()}
              y2={(center.y + modifiedResults.v_rain).toString()}
              stroke="black"
              // dotted line
              strokeDasharray="5,5"
              strokeWidth="2"
            />
            {RotatedUmbrella(
              Math.abs((modifiedResults.v_rain_object_angle * 180) / Math.PI) -
                90,
              getPosition()
            )}
            {/* arc for resultant velocity of rain */}
            {getArc(modifiedResults.v_rain_object_angle, "red", 40, center)}
            {/* arc for angle to put umbrella */}
            {getArc(
              Math.PI - Math.abs(modifiedResults.v_rain_object_angle),
              "blue",
              45,
              center
            )}
          </g>
        ) : (
          <text x={center.x - 70} y={center.y - 50} fill="red">
            {modifiedResults.helperText}
          </text>
        )}

        {getArrow(center, {
          endCoords: {
            x: center.x + modifiedResults.v_wind_object,
            y: center.y - modifiedResults.v_rain,
          },
          label: "Vro",
          color: "red",
        })}
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
        {/* {getUmbrella(center, {
          x: center.x - modifiedResults.v_wind_object,
          y: center.y + modifiedResults.v_rain,
        })} */}
      </svg>
    </div>
  );
};

// write a function that takes angle and center as argument and returns an arc of that angle with radius 10
const getArc = (
  angle: number,
  color: string,
  radius: number,
  center: { x: number; y: number }
) => {
  const radiuss = radius || 10;
  const startAngle = 0; // Start angle is always 0
  const endAngle = angle; // Convert angle to radians
  const largeArcFlag = angle <= 180 ? "0" : "1"; // Check if the arc is larger than 180 degrees
  const sweepFlag = angle < 0 ? "1" : "0"; // Always 1 for positive angles

  const x1 = center.x + radiuss * Math.cos(startAngle);
  const y1 = center.y - radiuss * Math.sin(startAngle);

  const x2 = center.x + radiuss * Math.cos(endAngle);
  const y2 = center.y - radiuss * Math.sin(endAngle);

  return (
    <path
      d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`}
      fill="none"
      stroke={color}
      strokeWidth="2"
    />
  );
};

const RotatedUmbrella = (
  rotation: number,
  position: { x: number; y: number }
) => (
  <path
    width={100}
    height={100}
    // stroke="red"
    fill="blue"
    transform={`translate(${position.x}, ${position.y}) rotate(${rotation}  )`}
    d="M27.948,3.089C27.951,3.058,27.966,3.032,27.966,3V1c0-0.552-0.447-1-1-1s-1,0.448-1,1v2c0,0.044,0.02,0.082,0.025,0.125
		C13.645,3.841,3.525,13.49,2.158,26.134c-0.04,0.369,0.128,0.73,0.437,0.938c0.309,0.207,0.706,0.226,1.032,0.05
		c1.503-0.81,3.69-1.275,6.002-1.275c4.387,0,7.664,1.665,7.664,3.154c0,0.552,0.447,1,1,1s1-0.448,1-1
		c0-1.374,2.795-2.895,6.673-3.122v26.196h0.01C26.028,53.72,27.757,55,29.966,55c2.243,0,4-1.318,4-3c0-0.552-0.447-1-1-1
		s-1,0.448-1,1c0,0.408-0.779,1-2,1s-2-0.592-2-1V25.879C31.835,26.11,34.62,27.628,34.62,29c0,0.552,0.447,1,1,1s1-0.448,1-1
		c0-1.489,3.277-3.154,7.663-3.154c2.861,0,5.575,0.741,6.914,1.887c0.308,0.263,0.742,0.315,1.104,0.131s0.575-0.566,0.544-0.97
		C51.803,13.703,40.913,3.341,27.948,3.089z M9.629,23.846c-1.902,0-3.702,0.273-5.235,0.783C6.234,14.408,14.347,6.657,24.36,5.308
		c-4.535,4.53-7.295,12.011-7.385,20.281C15.231,24.511,12.637,23.846,9.629,23.846z M26.956,23.846
		c-3.402,0-6.287,0.845-7.996,2.184c0-0.01,0.006-0.019,0.006-0.03c0-8.499,3.122-16.366,8-20.34c4.878,3.975,8,11.842,8,20.34
		c0,0.017,0.009,0.031,0.01,0.048C33.269,24.7,30.374,23.846,26.956,23.846z M44.283,23.846c-2.997,0-5.583,0.66-7.327,1.731
		c-0.093-8.354-2.914-15.896-7.534-20.408c10.616,0.915,19.43,9.183,21.186,19.881C48.895,24.28,46.673,23.846,44.283,23.846z"
  />
);

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
