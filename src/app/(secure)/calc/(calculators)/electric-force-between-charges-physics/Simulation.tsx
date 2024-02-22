import { useAtom, useAtomValue } from "jotai";
import { ZoomInIcon } from "lucide-react";
import { useState } from "react";
import Chip from "~/components/ui/chip";
import { MAX_ZOOM, MIN_ZOOM, dimensionsAtom, scaleAtom } from "./store";

const Simulation = () => {
  return <div>Simulation</div>;
};

export default Simulation;

export const ZoomControlChips = () => {
  const [scale, setScale] = useAtom(scaleAtom);
  return (
    <div
      className="flex flex-row flex-wrap justify-center gap-1 md:gap-2 mt-2 border-slate-100 border-2 p-2 *:
  shadow-[0_5px_10px_rgb(0,0,0,0.4)] bg-slate-300 rounded-lg"
    >
      {/* <p className="text-center my-auto text-1xl">Zoom: </p> */}
      <ZoomInIcon className="my-auto" />
      <Chip
        label="0.25x"
        selected={scale === MIN_ZOOM}
        onClick={() => setScale(MIN_ZOOM)}
      />
      <Chip label="0.5x" selected={scale === 5} onClick={() => setScale(5)} />
      <Chip label="1x" selected={scale === 10} onClick={() => setScale(10)} />
      <Chip label="2x" onClick={() => setScale(20)} selected={scale === 20} />
      <Chip
        label="4x"
        onClick={() => setScale(MAX_ZOOM)}
        selected={scale === MAX_ZOOM}
      />
    </div>
  );
};

export const AxesAndGrid = () => {
  const { canvasWidth, canvasHeight, yOriginOffset } =
    useAtomValue(dimensionsAtom);
  const [scale] = useAtom(scaleAtom);
  return (
    <g key="axisandgrid">
      <g key="grid" stroke="lightgray" strokeWidth="0.5">
        {Array.from({ length: canvasWidth / 2 / scale }, (_, index) => (
          <g key={index}>
            <line
              x1={canvasWidth / 2 + (index + 1) * scale * 10}
              y1="0"
              x2={canvasWidth / 2 + (index + 1) * scale * 10}
              y2={canvasHeight}
            />
            <line
              x1={canvasWidth / 2 - (index + 1) * scale * 10}
              y1="0"
              x2={canvasWidth / 2 - (index + 1) * scale * 10}
              y2={canvasHeight}
            />
          </g>
        ))}

        {Array.from({ length: canvasHeight / 2 / scale }, (_, index) => (
          <g key={index}>
            <line
              x1="0"
              y1={canvasHeight - yOriginOffset - (index + 1) * scale * 10}
              x2={canvasWidth}
              y2={canvasHeight - yOriginOffset - (index + 1) * scale * 10}
            />
            <line
              x1="0"
              y1={canvasHeight - yOriginOffset + (index + 1) * scale * 10}
              x2={canvasWidth}
              y2={canvasHeight - yOriginOffset + (index + 1) * scale * 10}
            />
          </g>
        ))}
      </g>
      <g key={"axes"}>
        {/* <!-- X-axis --> */}
        <line
          x1="0"
          y1={canvasHeight - yOriginOffset}
          x2={canvasWidth}
          y2={canvasHeight - yOriginOffset}
          stroke="black"
          strokeWidth="2"
        />

        {/* <!-- Y-axis --> */}
        <line
          x1={canvasWidth / 2}
          y1="0"
          x2={canvasWidth / 2}
          y2={canvasHeight}
          stroke="black"
          strokeWidth="2"
        />

        {/* <!-- X-axis label --> */}
        <text
          x={canvasWidth - 20}
          y={canvasHeight - yOriginOffset + 20}
          fontFamily="Arial"
          fontSize="20"
          fill="black"
        >
          X
        </text>

        {/* <!-- Y-axis label --> */}
        <text
          x={canvasWidth / 2 + 10}
          y="20"
          fontFamily="Arial"
          fontSize="20"
          fill="black"
        >
          Y
        </text>
      </g>
    </g>
  );
};

export const ZoomControl = () => {
  const [scale, setScale] = useAtom(scaleAtom);
  const { canvasHeight: height, canvasWidth: width } =
    useAtomValue(dimensionsAtom);
  return (
    <g>
      <rect
        x={width - 80}
        y={height - 55}
        width="70"
        style={{
          cursor: "pointer",
          userSelect: "none",
        }}
        height="40"
        fill="white"
        stroke="black"
        strokeWidth="1"
        rx="5"
      />
      <text
        onClick={() => {
          setScale((prev) => (prev < MAX_ZOOM ? prev + 0.5 : prev));
        }}
        x={width - 45}
        y={height - 17}
        fontFamily="Arial"
        fontSize="50"
        fill={scale < MAX_ZOOM ? "green" : "gray"}
        style={{
          cursor: scale < MAX_ZOOM ? "pointer" : "not-allowed",
          userSelect: "none",
        }}
      >
        +
      </text>

      <text
        onClick={() => {
          setScale((prev) => (prev > MIN_ZOOM ? prev - 0.5 : prev));
          console.log("zoom out");
        }}
        x={width - 70}
        y={height - 20}
        fontFamily="Arial"
        fontSize="50"
        fill={scale > MIN_ZOOM ? "green" : "gray"}
        style={{
          cursor: scale > MIN_ZOOM ? "pointer" : "not-allowed",
          userSelect: "none",
        }}
      >
        -
      </text>
    </g>
  );
};

export const FirstCase = ({
  isAttractive,
  d,
}: {
  isAttractive: boolean;
  d: number;
}) => {
  const { canvasWidth, canvasHeight, yOriginOffset } =
    useAtomValue(dimensionsAtom);
  const [scale] = useAtom(scaleAtom);
  return (
    <g key={"forceTwoPoint"}>
      <line
        x1={canvasWidth / 2 - (scale * d) / 2}
        y1={canvasHeight - yOriginOffset}
        x2={canvasWidth / 2 + (scale * d) / 2}
        y2={canvasHeight - yOriginOffset}
        stroke={isAttractive ? "blue" : "red"}
        strokeWidth="3"
      />

      {/* arrow from q1 */}
      <line
        x1={canvasWidth / 2 - (scale * d) / 2}
        y1={canvasHeight - yOriginOffset}
        x2={canvasWidth / 2 - (scale * d) / 2 + (isAttractive ? -4 : 4) * 10}
        y2={canvasHeight - yOriginOffset}
        stroke={isAttractive ? "blue" : "red"}
        strokeWidth="3"
        markerEnd="url(#arrowhead_1)"
      />

      {/* arrow from q2 */}
      <line
        x1={canvasWidth / 2 + (scale * d) / 2}
        y1={canvasHeight - yOriginOffset}
        x2={canvasWidth / 2 + (scale * d) / 2 + (isAttractive ? 4 : -4) * 10}
        y2={canvasHeight - yOriginOffset}
        stroke={isAttractive ? "blue" : "red"}
        strokeWidth="3"
        markerEnd="url(#arrowhead_1)"
      />
      <defs>
        <marker
          id="arrowhead_1"
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="black" />
        </marker>
      </defs>
      <text
        x={canvasWidth / 2 + 10}
        y={canvasHeight - yOriginOffset - 30}
        fontFamily="Arial"
        fontSize="16"
        fill="black"
      >
        d = {d} m
      </text>

      <text
        x={canvasWidth / 2 - (scale * d) / 2}
        y={canvasHeight - yOriginOffset + 30}
      >
        q1
      </text>
      <text
        x={canvasWidth / 2 + (scale * d) / 2}
        y={canvasHeight - yOriginOffset + 30}
      >
        q2
      </text>

      <circle
        cx={canvasWidth / 2 - (scale * d) / 2}
        cy={canvasHeight - yOriginOffset}
        r="10"
        fill="red"
      />

      <circle
        cx={canvasWidth / 2 + (scale * d) / 2}
        cy={canvasHeight - yOriginOffset}
        r="10"
        fill="blue"
      />
    </g>
  );
};

export const Charges = ({
  charges,
  test,
}: {
  charges: { c: number; x: number; y: number }[];
  test: { c: number; x: number; y: number };
}) => {
  const { canvasWidth, canvasHeight, yOriginOffset } =
    useAtomValue(dimensionsAtom);
  const [scale] = useAtom(scaleAtom);
  const [showPosition, setShowPosition] = useState<number | null>(null);

  const testChargePositionX = test.x * scale + canvasWidth / 2;
  const testChargePositionY = canvasHeight - yOriginOffset - test.y * scale;

  const isRepulsive = charges[0].c * test.c > 0;
  return charges.map((charge, i) => {
    const positionSelfX = charge.x * scale + canvasWidth / 2;
    const positionSelfY = canvasHeight - yOriginOffset - charge.y * scale;

    return (
      <g>
        {charge.c != 0 && (
          <g key={i}>
            <text
              style={{
                userSelect: "none",
              }}
              x={positionSelfX + 15}
              y={positionSelfY + 15}
              color={!isRepulsive ? "red" : "blue"}
            >
              {charge.c} C
            </text>
            {charge.c != 0 && (
              <g>
                {!isRepulsive ? (
                  <line
                    x1={testChargePositionX}
                    y1={testChargePositionY}
                    x2={positionSelfX}
                    y2={positionSelfY}
                    stroke="red"
                    strokeWidth="2"
                    markerEnd={`url(#arrowhead_${i + 10})`} // Place the marker at the end of the line
                  />
                ) : (
                  <line
                    x1={positionSelfX}
                    y1={positionSelfY}
                    x2={testChargePositionX}
                    y2={testChargePositionY}
                    stroke="blue"
                    strokeWidth="2"
                    markerEnd={`url(#arrowhead_${i + 10})`} // Place the marker at the end of the line
                  />
                )}

                <defs>
                  <marker
                    id={`arrowhead_${i + 10}`}
                    markerWidth="10"
                    markerHeight="7"
                    refX="10" // Set refX to the width of the marker
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill={!isRepulsive ? "red" : "blue"}
                    />
                  </marker>
                </defs>
              </g>
            )}

            <rect
              style={{
                display: showPosition === i ? "block" : "none",
              }}
              x={positionSelfX - 4 * 10}
              y={positionSelfY - 4 * 10}
              width="80"
              height="25"
              fill="none"
              stroke="black"
            />
            <text
              style={{
                display: showPosition === i ? "block" : "none",
              }}
              x={positionSelfX - 3.5 * 10}
              y={positionSelfY - 2 * 10}
              color="black"
            >
              {Number(charge?.x).toPrecision(2)} ,{" "}
              {Number(charge?.y).toPrecision(2)}
            </text>
            <circle
              onClick={() => setShowPosition((prev) => (prev === i ? null : i))}
              style={{
                cursor: "pointer",
              }}
              key={i}
              cx={positionSelfX}
              cy={positionSelfY}
              r="10"
              fill={charge.c < 0 ? "red" : "blue"}
            />
          </g>
        )}

        {/* test charge */}
        <rect
          style={{
            display: showPosition === -1 ? "block" : "none",
          }}
          // x={testChargePositionX - 4 * scale}
          // y={testChargePositionY - 4 * scale}
          x={testChargePositionX - 4 * 10}
          y={testChargePositionY - 4 * 10}
          width="80"
          height="25"
          fill="none"
          stroke="black"
        />
        <text
          style={{
            display: showPosition === -1 ? "block" : "none",
          }}
          x={testChargePositionX - 3.5 * 10}
          y={testChargePositionY - 2 * 10}
          color="black"
        >
          {Number(test.x).toPrecision(2)} , {Number(test.y).toPrecision(2)}
        </text>
        <circle
          onClick={() => setShowPosition((prev) => (prev === -1 ? null : -1))}
          style={{
            cursor: "pointer",
          }}
          cx={testChargePositionX}
          cy={testChargePositionY}
          r="10"
          fill="black"
        />

        <circle
          cx={testChargePositionX}
          cy={testChargePositionY}
          r="13"
          fill="none"
          stroke="green"
        />

        {test.c != 0 && (
          <text
            style={{
              userSelect: "none",
            }}
            x={testChargePositionX + 15}
            y={testChargePositionY - 15}
            color="black"
          >
            {test.c} C
          </text>
        )}
      </g>
    );
  });
};

export const NetForce = ({
  angle,
  force,
  test,
}: {
  angle: number;
  force: number;
  test: { c: number; x: number; y: number };
}) => {
  const { canvasWidth, canvasHeight, yOriginOffset } =
    useAtomValue(dimensionsAtom);
  const [scale] = useAtom(scaleAtom);
  const testChargePositionX = test.x * scale + canvasWidth / 2;
  const testChargePositionY = canvasHeight - yOriginOffset - test.y * scale;

  return (
    <g>
      <g>
        <line
          x1={testChargePositionX}
          y1={testChargePositionY}
          x2={
            canvasWidth / 2 +
            test.x * scale +
            10 * scale * Math.cos((angle * Math.PI) / 180)
          }
          y2={
            canvasHeight -
            yOriginOffset -
            test.y * scale -
            10 * scale * Math.sin((angle * Math.PI) / 180)
          }
          stroke="black"
          strokeWidth="2"
          markerEnd={`url(#arrowhead_2)`}
        />
        <defs>
          <marker
            id={`arrowhead_2`}
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="black" />
          </marker>
        </defs>

        <text
          x={test.x * scale + canvasWidth / 2 + 15}
          y={canvasHeight - yOriginOffset - test.y * scale + 25}
          color="black"
        >
          F = {force?.toPrecision(2)} N
        </text>
      </g>
    </g>
  );
};

export const ChargesForNeutralPoints = ({
  charges,
}: {
  charges: { c: number; x: number; y: number }[];
}) => {
  const { canvasWidth, canvasHeight, yOriginOffset } =
    useAtomValue(dimensionsAtom);
  const [scale] = useAtom(scaleAtom);
  const [showPosition, setShowPosition] = useState<number | null>(null);

  return charges.map((charge, i) => {
    const positionSelfX = charge.x * scale + canvasWidth / 2;
    const positionSelfY = canvasHeight - yOriginOffset - charge.y * scale;

    return (
      charge.c != 0 && (
        <g key={i}>
          <text
            x={positionSelfX + 15}
            y={positionSelfY + 15}
            color={charge.c > 0 ? "red" : "blue"}
          >
            {charge.c} C
          </text>
          <rect
            style={{
              display: showPosition === i ? "block" : "none",
            }}
            x={positionSelfX - 40}
            y={positionSelfY - 50}
            width="80"
            height="25"
            fill="none"
            stroke="black"
          />
          <text
            style={{
              display: showPosition === i ? "block" : "none",
            }}
            x={positionSelfX - 35}
            y={positionSelfY - 30}
            color="black"
          >
            {Number(charge?.x).toPrecision(2)} ,{" "}
            {Number(charge?.y).toPrecision(2)}
          </text>
          <circle
            onClick={() => setShowPosition((prev) => (prev === i ? null : i))}
            style={{
              cursor: "pointer",
            }}
            key={i}
            cx={positionSelfX}
            cy={positionSelfY}
            r="10"
            fill={charge.c < 0 ? "red" : "blue"}
          />
        </g>
      )
    );
  });
};

export const NeutralPoint = ({ x, y }: { x: number; y: number }) => {
  const { canvasWidth, canvasHeight, yOriginOffset } =
    useAtomValue(dimensionsAtom);
  const scale = useAtomValue(scaleAtom);
  return (
    <g>
      <circle
        style={{
          cursor: "pointer",
        }}
        cx={canvasWidth / 2 + x * scale}
        cy={canvasHeight - yOriginOffset - y * scale}
        r="10"
        fill="gray"
      />

      <circle
        cx={canvasWidth / 2 + x * scale}
        cy={canvasHeight - yOriginOffset - y * scale}
        r="13"
        fill="none"
        stroke="green"
      />

      <text
        x={canvasWidth / 2 + x * scale + 15}
        y={canvasHeight - yOriginOffset - y * scale + 15}
        color="black"
      >
        Neutral Point ({x?.toPrecision(2)}, {y?.toPrecision(2)})
      </text>
    </g>
  );
};
