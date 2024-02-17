"use client";

import { MathJax } from "better-react-mathjax";
import { useAtomValue } from "jotai";
import { RotatedUmbrella, getArrow } from "./SVGUtils";
import { RainVelocityResultsType, resultAtom } from "./store";

const toDegree = (angle: number) => (angle * 180) / Math.PI;
const RainWithWind = () => {
  const result = useAtomValue(resultAtom);
  const {
    v_wind_object,
    v_rain,
    v_rain_object_magnitude: magnitude,
    v_rain_object_angle: resultAngle,
  } = result;

  const InitializeVariables = ({
    v_object,
    v_wind,
    v_rain,
  }: RainVelocityResultsType) => {
    return (
      <p className="self-start ">
        <b>Step: 1</b>
        <br />
        Initialize variables:
        <MathJax
          dynamic={true}
          renderMode="pre"
          typesettingOptions={{
            fn: "tex2chtml",
          }}
          text={`
        \\begin{align*}
        \\text{ Velocity of Rain, }\\overrightarrow{V}_{r} &= -${v_rain}\\hat{j}\\space unit \\\\
        \\text{Velocity of Object, }\\overrightarrow{V}_{o} &= ${v_object}\\hat{i}\\space unit \\\\
        \\text{Velocity of Wind, }\\overrightarrow{V}_{w} &= ${v_wind}\\hat{i}\\space unit \\\\
        \\end{align*}
      `}
        />
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
        Velocity of wind <b> relative to object:</b>
        <MathJax
          dynamic={true}
          renderMode="pre"
          typesettingOptions={{
            fn: "tex2chtml",
          }}
          text={`
        \\begin{gather}
        \\overrightarrow{V}_{wo} = \\overrightarrow{V}_{wind} - \\overrightarrow{V}_{object} \\\\ 
          \\overrightarrow{V}_{wo} = ${v_wind}\\hat{i} - ${v_object_str} \\\\
          \\overrightarrow{V}_{wo} = ${v_wind_object.toFixed(2)}\\hat{i} \\\\
        \\end{gather}
      `}
        />
      </p>
    );
  };
  const CalculateAndRenderResults = () => {
    return (
      <p className="self-start">
        <b>Step: 3</b>
        <br />
        Velocity of rain relative to object:
        <MathJax
          dynamic={true}
          renderMode="pre"
          typesettingOptions={{
            fn: "tex2chtml",
          }}
          text={`
            \\begin{gather}
              \\overrightarrow{V}_{ro} = \\overrightarrow{V}_{rain} + \\overrightarrow{V}_{wo} = ${v_wind_object.toFixed(
                2
              )}\\hat{i}- ${v_rain}\\hat{j} \\\\
            \\end{gather}
          `}
        />
        Magnitude and Angle of rain relative to object:
        <MathJax
          dynamic={true}
          renderMode="pre"
          typesettingOptions={{
            fn: "tex2chtml",
          }}
          text={`
            \\begin{gather}
              \\left|\\overrightarrow{V}_{ro}\\right| = \\sqrt{(${v_wind_object.toFixed(
                2
              )})^2 + (${v_rain})^2} = ${magnitude.toFixed(2)}\\space unit \\\\
              \\theta = tan^{-1}\\left(\\frac{-${
                v_rain < 0 ? `(${v_rain})` : v_rain
              }}{${v_wind_object.toFixed(2)}}\\right) = ${toDegree(
            resultAngle
          ).toFixed(2)}^\\circ \\\\
            \\end{gather}
          `}
        />
      </p>
    );
  };

  const UmbrellaPosition = ({ angle }: { angle: number }) => {
    const final_angle = angle > -90 ? Math.abs(angle) : 180 + angle;
    return (
      <p>
        So, Umbrella should be tilted <b>relative to +x axis</b> at ,{" "}
        <MathJax
          dynamic={true}
          renderMode="pre"
          typesettingOptions={{
            fn: "tex2chtml",
          }}
          text={`
          \\theta =180^\\circ ${angle.toFixed(2)}^\\circ \\  = ${(
            180 + angle
          ).toFixed(2)}^\\circ \\\\ 
          `}
        />
        <b>Relative to the direction of object's velocity: </b>
        <MathJax
          dynamic={true}
          renderMode="pre"
          typesettingOptions={{
            fn: "tex2chtml",
          }}
          text={`
          \\theta = ${final_angle.toFixed(2)}^\\circ \\\\ 
          `}
        />
      </p>
    );
  };
  const center = { x: 175, y: 100 };

  return result.v_rain || result.v_object ? (
    <div>
      <div className="flex flex-col ml-4 lg:ml-0 items-center lg:items-start justify-center lg:justify-normal gap-4">
        <div className="flex flex-col md:flex-row ">
          <InitializeVariables {...result} />
          <Figure center={center} results={result} />
        </div>

        <WindSpeedModify {...result} />

        <CalculateAndRenderResults />
        <UmbrellaPosition angle={toDegree(resultAngle)} />
      </div>
    </div>
  ) : (
    <div className="md:self-start self-center pt-2  ">
      <p className="self-center text-center">
        Please enter valid inputs to see the results
      </p>
    </div>
  );
};

export default RainWithWind;

const Figure = ({
  center,
  results,
}: {
  center: { x: number; y: number };
  results: RainVelocityResultsType;
}) => {
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
