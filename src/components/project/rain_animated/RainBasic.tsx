import { MathJax } from "better-react-mathjax";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { RotatedUmbrella, getArc, getArrow } from "./SVGUtils";
import { RainVelocityResultsType, resultAtom } from "./store";

const RainBasic = () => {
  const result = useAtomValue(resultAtom);
  // console.log(result);
  const {
    v_object,
    v_rain,
    v_rain_object_magnitude: magnitude,
    v_rain_object_angle: resultAngle,
  } = result;

  const v_wind_object = v_object;

  const center = { x: 175, y: 100 };

  const CalculateAndRenderResults = () => {
    return (
      <p className="self-start">
        From the figure, Velocity of rain relative to object:
        <MathJax>
          {`
            $$\\begin{gather}
            \\left|\\overrightarrow{V}_{ro}\\right| = \\sqrt{(V_{r})^2 + (V_{o})^2} \\\\

              V_{ro} = \\sqrt{(${Math.abs(v_wind_object).toFixed(
                2
              )})^2 + (${v_rain})^2} = \\textbf{${magnitude.toFixed(
            2
          )}}\\space unit \\\\

              \\theta = tan^{-1}\\left(\\frac{V_r}{V_o}\\right) \\space (with\\space ground) \\\\
               = tan^{-1}\\left(\\frac{${v_rain}}{${Math.abs(
            v_wind_object
          ).toFixed(2)}}\\right) = \\textbf{${Math.min(
            180 + toDegree(resultAngle),
            Math.abs(toDegree(resultAngle))
          ).toFixed(2)}}^\\circ \\\\
            \\end{gather}$$
          `}
        </MathJax>
      </p>
    );
  };

  const UmbrellaPosition = ({ angle }: { angle: number }) => {
    const final_angle = angle > -90 ? Math.abs(angle) : 180 + angle;
    return (
      <p>
        So, Umbrella should be tilted <b>relative to ground: </b>
        <MathJax>
          {`$$
          \\theta = ${final_angle.toFixed(2)}^\\circ \\\\ 
          $$`}
        </MathJax>
      </p>
    );
  };

  return result.v_object && result.v_rain ? (
    <>
      <div className="flex flex-col ml-4 lg:ml-0 items-center lg:items-start justify-center lg:justify-normal gap-4">
        <div className="flex flex-col md:flex-row ">
          <CalculateAndRenderResults />
          <Figure center={center} results={result} />
        </div>
        <UmbrellaPosition angle={toDegree(resultAngle)} />
      </div>
    </>
  ) : (
    <div className="md:self-start self-center pt-2  ">
      <p className="self-center text-center">
        Please enter valid inputs to see the results
      </p>
    </div>
  );
};

const toDegree = (angle: number) => (angle * 180) / Math.PI;

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

  // console.log((modifiedResults.v_rain_object_angle * 180) / Math.PI);
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

  const umbrellaAngle = useMemo(
    () =>
      Math.abs(modifiedResults.v_rain_object_angle) -
      (modifiedResults.v_rain_object_angle < -Math.PI / 2 ? Math.PI : 0),
    [modifiedResults.v_rain_object_angle]
  );
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

        {/* bottom angle  */}
        {/* <text
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
          </text> */}

        {/* upper angle */}
        <text
          x={175 + (modifiedResults.v_wind_object > 0 ? 70 : -70)}
          y="130"
          fontFamily="Arial"
          fontSize="12"
          fill="black"
        >
          {Math.min(
            180 + toDegree(modifiedResults.v_rain_object_angle),
            Math.abs(toDegree(modifiedResults.v_rain_object_angle))
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

            {/* umbrella position
             */}
            {getArc(
              modifiedResults.v_wind_object < 0 ? 0 : Math.PI,
              modifiedResults.v_wind_object < 0
                ? -umbrellaAngle
                : Math.PI - umbrellaAngle,
              modifiedResults.v_wind_object > 0,
              "blue",
              35,
              center
            )}
            {/* rain resultant velocity*/}
            {getArc(
              modifiedResults.v_rain_object_angle,
              modifiedResults.v_wind_object > 0 ? 0 : Math.PI,
              modifiedResults.v_wind_object < 0,
              "red",
              40,
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
          label: "-Vo",
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
      </svg>
    </div>
  );
};

export default RainBasic;
