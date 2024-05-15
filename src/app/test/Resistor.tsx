import { useEffect, useState } from "react";
import { Resistance } from "./main";

const Resistor = ({
  R: { node1: startId, node2: endId, value, name },
  onClick,
}: {
  R: Resistance;
  onClick: () => void;
}) => {
  const [firstPoint, setFirstPoint] = useState({ x: -1, y: -1 });
  const [secondPoint, setSecondPoint] = useState({ x: -1, y: -1 });
  const [firstEnd, setFirstEnd] = useState({ x: -1, y: -1 });
  const [secondEnd, setSecondEnd] = useState({ x: -1, y: -1 });
  const [angle, setAngle] = useState(0);
  const [labelPosition, setLabelPosition] = useState({ x: -1, y: -1 });

  useEffect(() => {
    const getCoordinatesByid = (id: string) => {
      const [x, y] = id.split("__");
      return { x: parseInt(x), y: parseInt(y) };
    };

    const { x: x1, y: y1 } = getCoordinatesByid(startId);
    const { x: x2, y: y2 } = getCoordinatesByid(endId);

    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // need to find the end coordinate of the first part of the line to start the resistor
    // which is (length - 30)/2 away from the start point in same angle
    const wireWidth = (length - 30) / 2;

    const x12 = x1 + (wireWidth * dx) / length;
    const y12 = y1 + (wireWidth * dy) / length;

    const x22 = x2 - (wireWidth * dx) / length;
    const y22 = y2 - (wireWidth * dy) / length;

    // calculating the position of the label
    let labelPosition = {
      x: (x1 + x2 + 15) / 2,
      y: (y1 + y2 - 30) / 2,
    };
    if ((angle >= -90 && angle < -20) || (angle >= 90 && angle < 160)) {
      labelPosition.x = (x1 + x2) / 2 + 20;
      labelPosition.y = (y1 + y2) / 2;
    }

    setLabelPosition(labelPosition);
    setFirstPoint({ x: x1, y: y1 });
    setSecondPoint({ x: x2, y: y2 });
    setFirstEnd({ x: x12, y: y12 });
    setSecondEnd({ x: x22, y: y22 });
    setAngle(angle);
  }, [startId, endId]);

  return firstPoint.x === -1 || secondPoint.x === -1 ? null : (
    <g
      onClick={() => {
        console.log(angle);
      }}
    >
      <circle cx={firstPoint.x} cy={firstPoint.y} r="5" fill="black" />
      <circle cx={secondPoint.x} cy={secondPoint.y} r="5" fill="black" />
      <g stroke="black" strokeWidth={2.75}>
        <line
          x1={firstPoint.x}
          y1={firstPoint.y}
          x2={firstEnd.x}
          y2={firstEnd.y}
          height={30}
        />
        <line
          x1={secondPoint.x}
          y1={secondPoint.y}
          x2={secondEnd.x}
          y2={secondEnd.y}
        />
      </g>

      <svg
        height={30}
        width={30}
        x={(firstPoint.x + secondPoint.x - 30) / 2}
        y={(firstPoint.y + secondPoint.y - 29) / 2}
        viewBox="0 0 462.782 462.782"
      >
        <path
          stroke="#000000"
          strokeWidth="15"
          d="M350.272,323.014c-5.974,0-11.411-3.556-13.783-9.091l-50.422-117.65l-40.505,116.662 c-2.08,5.989-7.699,10.023-14.038,10.08c-0.044,0-0.089,0-0.133,0c-6.286,0-11.911-3.921-14.081-9.831l-41.979-114.358 l-40.798,114.234c-2.095,5.867-7.599,9.828-13.827,9.952c-6.242,0.127-11.886-3.615-14.213-9.394l-31.482-78.172H0v-30h85.141 c6.121,0,11.627,3.719,13.914,9.396l20.511,50.93l41.446-116.048c2.124-5.947,7.745-9.927,14.06-9.955c0.022,0,0.044,0,0.066,0 c6.289,0,11.912,3.923,14.081,9.831l41.779,113.814l39.431-113.565c2.032-5.851,7.451-9.852,13.64-10.071 c6.203-0.217,11.877,3.389,14.317,9.082l49.683,115.927l15.254-48.815c1.957-6.262,7.756-10.526,14.317-10.526h85.141v30h-74.113 l-24.076,77.043c-1.873,5.994-7.281,10.186-13.553,10.506C350.784,323.007,350.527,323.014,350.272,323.014z"
          style={{
            transformOrigin: "center center 0px",
            transform: `rotate(${angle}deg)`,
          }}
        />
      </svg>
      <text
        x={labelPosition.x}
        y={labelPosition.y}
        fontSize="15"
        fill="black"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {value.toFixed(0) + "Ω"}
      </text>
    </g>
  );
};

export default Resistor;
