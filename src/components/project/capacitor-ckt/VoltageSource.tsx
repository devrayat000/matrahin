import { useEffect, useState } from "react";
import { getCoordinatesById } from "../equi-resistance/utils";
import { Coordinate, VoltageSource } from "./store";
interface CapacitorState {
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

const calculateCapacitorEnds = (
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
    y: (start.y + end.y - 40) / 2,
  };

  if ((angle >= -90 && angle < -20) || (angle >= 90 && angle < 160)) {
    labelPosition.x = (start.x + end.x) / 2 + 30;
    labelPosition.y = (start.y + end.y) / 2;
  }

  return labelPosition;
};

const initialCoordinates: Coordinate = { x: -1, y: -1 };
const VoltageSourceComp = ({
  R: { value, node1: startId, node2: endId },
  onClick,
  color = "black",
}: {
  R: VoltageSource;
  onClick: () => void;
  color?: string;
}) => {
  const [capacitorState, setCapacitorState] = useState<CapacitorState>({
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
    const { firstEnd, secondEnd } = calculateCapacitorEnds(
      startCoordinate,
      endCoordinate,
      length
    );
    const labelPosition = calculateLabelPosition(
      startCoordinate,
      endCoordinate,
      lineAngle
    );

    setCapacitorState({
      start: startCoordinate,
      end: endCoordinate,
      firstEnd,
      secondEnd,
      angle: lineAngle,
      labelPosition,
    });
  }, [startId, endId]);

  return capacitorState.start.x <= 0 || capacitorState.end.x <= 0 ? null : (
    <g onClick={onClick}>
      <circle
        cx={capacitorState.start.x}
        cy={capacitorState.start.y}
        r="5"
        fill={color}
      />
      <circle
        cx={capacitorState.end.x}
        cy={capacitorState.end.y}
        r="5"
        fill={color}
      />
      <g stroke={color} strokeWidth={2.75}>
        <line
          x1={capacitorState.start.x}
          y1={capacitorState.start.y}
          x2={capacitorState.firstEnd.x}
          y2={capacitorState.firstEnd.y}
          height={30}
        />
        <line
          x1={capacitorState.end.x}
          y1={capacitorState.end.y}
          x2={capacitorState.secondEnd.x}
          y2={capacitorState.secondEnd.y}
        />
      </g>

      <svg
        x={(capacitorState.start.x + capacitorState.end.x - 30) / 2}
        y={(capacitorState.start.y + capacitorState.end.y - 29) / 2}
        viewBox="0 0 30 30"
        height={30}
        width={30}
        stroke={color}
      >
        <rect
          x="0"
          y="0"
          width="30"
          height="30"
          fill="white"
          opacity={1}
          stroke="none"
          style={{
            transformOrigin: "center center 0px",
            transform: `rotate(${capacitorState.angle}deg)`,
          }}
        />
        <path
          style={{
            transformOrigin: "center center 0px",
            transform: `rotate(${capacitorState.angle}deg)`,
          }}
          d="M0 14.5 L10 14.5 M20 14.5 L30 14.5 M10 20 L10 10 M20 30 L20 0"
          stroke={color}
          strokeWidth="3"
          fill="none"
        />
      </svg>

      <text
        style={{ userSelect: "none" }}
        x={capacitorState.labelPosition.x}
        y={capacitorState.labelPosition.y}
        fontSize="12"
        fill={color}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {value.toFixed(2) + "V"}
      </text>
    </g>
  );
};

export default VoltageSourceComp;
