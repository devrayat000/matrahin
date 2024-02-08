import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { pointsAtom } from "./AnimationHelper";

const DataVisualization = () => {
  const points = useAtomValue(pointsAtom);
  // const points = data.filter()
  // points have a larger array, so we need to filter it to only show the points to show as graph
  const [data, setData] = useState(
    points.filter((point, index) => index % 10 === 0)
  );

  useEffect(() => {
    const calculateRanges = () => {
      // Initialize ranges object
      const initialRanges = {
        x: { min: Infinity, max: -Infinity },
        y: { min: Infinity, max: -Infinity },
        t: { min: Infinity, max: -Infinity },
        vx: { min: Infinity, max: -Infinity },
        vy: { min: Infinity, max: -Infinity },
        v: { min: Infinity, max: -Infinity },
        angle: { min: Infinity, max: -Infinity },
      };

      // Iterate through points to calculate ranges
      data.forEach((point) => {
        initialRanges.x.min = Math.min(initialRanges.x.min, point.x);
        initialRanges.x.max = Math.max(initialRanges.x.max, point.x);

        initialRanges.y.min = Math.min(initialRanges.y.min, point.y);
        initialRanges.y.max = Math.max(initialRanges.y.max, point.y);

        initialRanges.t.min = Math.min(initialRanges.t.min, point.t);
        initialRanges.t.max = Math.max(initialRanges.t.max, point.t);

        initialRanges.vx.min = Math.min(initialRanges.vx.min, point.vx);
        initialRanges.vx.max = Math.max(initialRanges.vx.max, point.vx);

        initialRanges.vy.min = Math.min(initialRanges.vy.min, point.vy);
        initialRanges.vy.max = Math.max(initialRanges.vy.max, point.vy);

        // Calculate v, angle, and update their ranges
        const v = Math.sqrt(point.vx ** 2 + point.vy ** 2);
        const angle = (Math.atan2(point.vy, point.vx) * 180) / Math.PI;

        initialRanges.v.min = Math.min(initialRanges.v.min, v);
        initialRanges.v.max = Math.max(initialRanges.v.max, v);

        initialRanges.angle.min = Math.min(initialRanges.angle.min, angle);
        initialRanges.angle.max = Math.max(initialRanges.angle.max, angle);
      });

      // Set the calculated ranges in the state
      // setRanges(initialRanges);
    };

    calculateRanges();
  }, [data]);

  // Determine the range of data for scaling
  const xValues = data.map((point) => point.x);
  const yValues = data.map((point) => point.y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  // Scale the points to fit within SVG dimensions
  const scalePoint = (value, min, max, size) => {
    return ((value - min) / (max - min)) * size;
  };

  // SVG dimensions
  const width = 450;
  const height = 350;
  const padding = 80;

  // Calculate the ticks for the axes
  const xTicks = [
    minX,
    ...Array.from(
      { length: 5 },
      (_, i) => minX + ((maxX - minX) / 4) * (i + 1)
    ),
  ];
  const yTicks = [
    minY,
    ...Array.from(
      { length: 5 },
      (_, i) => minY + ((maxY - minY) / 4) * (i + 1)
    ),
  ];

  return (
    <svg width={width} height={height}>
      {/* Grid lines */}
      {xTicks.map((tick) => (
        <line
          key={`x-grid-${tick}`}
          x1={scalePoint(tick, minX, maxX, width - 2 * padding) + padding}
          y1={0}
          x2={scalePoint(tick, minX, maxX, width - 2 * padding) + padding}
          y2={height - padding}
          stroke="#ddd"
          strokeWidth="1"
          strokeDasharray="3"
        />
      ))}
      {yTicks.map((tick) => (
        <line
          key={`y-grid-${tick}`}
          x1={padding}
          y1={
            height -
            scalePoint(tick, minY, maxY, height - 2 * padding) -
            padding
          }
          x2={width}
          y2={
            height -
            scalePoint(tick, minY, maxY, height - 2 * padding) -
            padding
          }
          stroke="#00ffdd"
          strokeWidth="1"
          strokeDasharray="3"
        />
      ))}

      {/* X-axis */}
      <line
        x1={padding}
        y1={height - padding}
        x2={width}
        y2={height - padding}
        stroke="black"
      />

      {/* Y-axis */}
      <line
        x1={padding}
        y1={0}
        x2={padding}
        y2={height - padding}
        stroke="black"
      />

      {/* X-axis ticks and labels */}
      {xTicks.map((tick) => (
        <g key={`x-tick-${tick}`}>
          <line
            x1={scalePoint(tick, minX, maxX, width - 2 * padding) + padding}
            y1={height - padding + 5}
            x2={scalePoint(tick, minX, maxX, width - 2 * padding) + padding}
            y2={height - padding - 5}
            stroke="black"
          />
          <text
            x={scalePoint(tick, minX, maxX, width - 2 * padding) + padding}
            y={height - padding + 20}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {tick.toFixed(1)}
          </text>
        </g>
      ))}

      {/* Y-axis ticks and labels */}
      {yTicks.map((tick) => (
        <g key={`y-tick-${tick}`}>
          <line
            x1={padding - 5}
            y1={
              height -
              scalePoint(tick, minY, maxY, height - 2 * padding) -
              padding
            }
            x2={padding + 5}
            y2={
              height -
              scalePoint(tick, minY, maxY, height - 2 * padding) -
              padding
            }
            stroke="black"
          />
          <text
            x={padding - 20}
            y={
              height -
              scalePoint(tick, minY, maxY, height - 2 * padding) -
              padding
            }
            textAnchor="end"
            alignmentBaseline="middle"
          >
            {tick.toFixed(1)}
          </text>
        </g>
      ))}
      {/* Data points */}
      {data.map((point, index) => (
        <circle
          key={index}
          cx={scalePoint(point.x, minX, maxX, width - 2 * padding) + padding}
          cy={
            height -
            scalePoint(point.y, minY, maxY, height - 2 * padding) -
            padding
          }
          r={1}
          fill="blue"
        />
      ))}

      {/* Lines between data points */}
      {data.map((point, index) => {
        if (index < data.length - 1) {
          const startPoint = {
            x:
              scalePoint(data[index].x, minX, maxX, width - 2 * padding) +
              padding,
            y:
              height -
              scalePoint(data[index].y, minY, maxY, height - 2 * padding) -
              padding,
          };
          const endPoint = {
            x:
              scalePoint(data[index + 1].x, minX, maxX, width - 2 * padding) +
              padding,
            y:
              height -
              scalePoint(data[index + 1].y, minY, maxY, height - 2 * padding) -
              padding,
          };
          return (
            <line
              key={`line-${index}`}
              x1={startPoint.x}
              y1={startPoint.y}
              x2={endPoint.x}
              y2={endPoint.y}
              strokeWidth={2}
              stroke="blue"
            />
          );
        }
        return null;
      })}
    </svg>
  );
};

// Example usage
const Chart = () => {
  return (
    <div className="mb-4 p-3">
      <DataVisualization />
    </div>
  );
};

export default Chart;
