export const getArrow = (
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
      <g>
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
      </g>
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

export const getArc = (
  startAngle: number,
  endAngle: number,
  clockwise: boolean,
  color: string,
  radius: number,
  center: { x: number; y: number }
) => {
  const radiuss = radius || 10;

  const x1 = center.x + radiuss * Math.cos(startAngle);
  const y1 = center.y - radiuss * Math.sin(startAngle);

  const x2 = center.x + radiuss * Math.cos(endAngle);
  const y2 = center.y - radiuss * Math.sin(endAngle);

  return (
    <path
      d={`M ${x1} ${y1} A ${radiuss} ${radiuss} 1 0 ${
        clockwise ? "1" : "0"
      } ${x2} ${y2}`}
      fill="none"
      stroke={color}
      strokeWidth="2"
    />
  );
};

export const RotatedUmbrella = (
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
