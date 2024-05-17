import { useEffect, useState } from "react";
import { Resistance } from "./calculationOfR";
import { Coordinate } from "./store";
import { getCoordinatesById } from "./utils";

interface ResistorState {
  start: Coordinate;
  end: Coordinate;
  firstEnd: Coordinate;
  secondEnd: Coordinate;
  angle: number;
  labelPosition: Coordinate;
}

const calculateLineAngles = (start: Coordinate, end: Coordinate) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx ** 2 + dy ** 2);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return { length, angle };
};

const calculateResistorEnds = (
  start: Coordinate,
  end: Coordinate,
  length: number
) => {
  const { dx, dy } = { dx: end.x - start.x, dy: end.y - start.y };
  const wireWidth = (length - 30) / 2;

  const firstEnd = {
    x: start.x + (wireWidth * dx) / length,
    y: start.y + (wireWidth * dy) / length,
  };

  const secondEnd = {
    x: end.x - (wireWidth * dx) / length,
    y: end.y - (wireWidth * dy) / length,
  };

  return { firstEnd, secondEnd };
};

const calculateLabelPosition = (
  start: Coordinate,
  end: Coordinate,
  angle: number
) => {
  let labelPosition = {
    x: (start.x + end.x + 15) / 2,
    y: (start.y + end.y - 30) / 2,
  };

  if ((angle >= -90 && angle < -20) || (angle >= 90 && angle < 160)) {
    labelPosition.x = (start.x + end.x) / 2 + 40;
    labelPosition.y = (start.y + end.y) / 2;
  }

  return labelPosition;
};

const initialCoordinates: Coordinate = { x: -1, y: -1 };
const Resistor = ({
  R: { node1: startId, node2: endId, value, name },
  onClick,
  color = "black",
}: {
  R: Resistance;
  onClick: () => void;
  color?: string;
}) => {
  const [resistorState, setResistorState] = useState<ResistorState>({
    start: initialCoordinates,
    end: initialCoordinates,
    firstEnd: initialCoordinates,
    secondEnd: initialCoordinates,
    angle: 0,
    labelPosition: initialCoordinates,
  });

  useEffect(() => {
    const startCoordinate = getCoordinatesById(startId);
    const endCoordinate = getCoordinatesById(endId);

    const { length, angle: lineAngle } = calculateLineAngles(
      startCoordinate,
      endCoordinate
    );
    const { firstEnd, secondEnd } = calculateResistorEnds(
      startCoordinate,
      endCoordinate,
      length
    );
    const labelPosition = calculateLabelPosition(
      startCoordinate,
      endCoordinate,
      lineAngle
    );

    setResistorState({
      start: startCoordinate,
      end: endCoordinate,
      firstEnd,
      secondEnd,
      angle: lineAngle,
      labelPosition,
    });
  }, [startId, endId]);
  return resistorState.start.x === -1 || resistorState.end.x === -1 ? null : (
    <g onClick={onClick}>
      <circle
        cx={resistorState.start.x}
        cy={resistorState.start.y}
        r="5"
        fill={color}
      />
      <circle
        cx={resistorState.end.x}
        cy={resistorState.end.y}
        r="5"
        fill={color}
      />
      <g stroke={color} strokeWidth={2.75}>
        <line
          x1={resistorState.start.x}
          y1={resistorState.start.y}
          x2={resistorState.firstEnd.x}
          y2={resistorState.firstEnd.y}
          height={30}
        />
        <line
          x1={resistorState.end.x}
          y1={resistorState.end.y}
          x2={resistorState.secondEnd.x}
          y2={resistorState.secondEnd.y}
        />
      </g>

      <svg
        height={30}
        width={30}
        x={(resistorState.start.x + resistorState.end.x - 30) / 2}
        y={(resistorState.start.y + resistorState.end.y - 29) / 2}
        viewBox="0 0 462.782 462.782"
      >
        <path
          stroke={color}
          strokeWidth="15"
          d="M350.272,323.014c-5.974,0-11.411-3.556-13.783-9.091l-50.422-117.65l-40.505,116.662 c-2.08,5.989-7.699,10.023-14.038,10.08c-0.044,0-0.089,0-0.133,0c-6.286,0-11.911-3.921-14.081-9.831l-41.979-114.358 l-40.798,114.234c-2.095,5.867-7.599,9.828-13.827,9.952c-6.242,0.127-11.886-3.615-14.213-9.394l-31.482-78.172H0v-30h85.141 c6.121,0,11.627,3.719,13.914,9.396l20.511,50.93l41.446-116.048c2.124-5.947,7.745-9.927,14.06-9.955c0.022,0,0.044,0,0.066,0 c6.289,0,11.912,3.923,14.081,9.831l41.779,113.814l39.431-113.565c2.032-5.851,7.451-9.852,13.64-10.071 c6.203-0.217,11.877,3.389,14.317,9.082l49.683,115.927l15.254-48.815c1.957-6.262,7.756-10.526,14.317-10.526h85.141v30h-74.113 l-24.076,77.043c-1.873,5.994-7.281,10.186-13.553,10.506C350.784,323.007,350.527,323.014,350.272,323.014z"
          style={{
            transformOrigin: "center center 0px",
            transform: `rotate(${resistorState.angle}deg)`,
          }}
        />
      </svg>
      <text
        x={resistorState.labelPosition.x}
        y={resistorState.labelPosition.y}
        fontSize="15"
        fill={color}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {name + ": " + value.toFixed(2) + "Ω"}
      </text>
    </g>
  );
};

export default Resistor;
