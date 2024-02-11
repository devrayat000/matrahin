import { useAtomValue } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import { pointsAtom } from "./AnimationHelper";

const DataVisualization = () => {
  const points = useAtomValue(pointsAtom);
  const verticalDottedLineRef = useRef<SVGLineElement>(null);
  const horizontalDottedLineRef = useRef<SVGLineElement>(null);
  const [positionValue, setPositionValue] = useState({ x: 0, y: 0 });

  const [enableTooltip, setEnableTooltip] = useState(false);

  // const points = data.filter()
  // points have a larger array, so we need to filter it to only show the points to show as graph
  const data = useMemo(
    () => points.filter((point, index) => index % 10 === 0),
    [points]
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
  const xValues = useMemo(() => data.map((point) => point.x), [data]);
  const yValues = useMemo(() => data.map((point) => point.y), [data]);
  const minX = useMemo(() => Math.min(...xValues), [xValues]);
  const maxX = useMemo(() => Math.max(...xValues) + 10, [xValues]);
  const minY = useMemo(() => Math.min(...yValues), [yValues]);
  const maxY = useMemo(() => Math.max(...yValues) + 10, [yValues]);

  // Scale the points to fit within SVG dimensions
  const scalePoint = (value, min, max, size) => {
    return ((value - min) / (max - min)) * size;
  };

  // reverse of this scalePoint function
  const scalePointReverse = (value, min, max, size) => {
    return (value * (max - min)) / size + min;
  };
  // SVG dimensions
  const width = 450;
  const height = 350;
  const padding = 80;

  const ceilToHundred = (value: number) => {
    return Math.ceil(value / 100) * 100;
  };
  // Calculate the ticks for the axes
  const xTicks = useMemo(
    () => [
      minX,
      ...Array.from(
        { length: 10 },
        (_, i) => minX + ((ceilToHundred(maxX) - minX) / 10) * (i + 1)
      ),
    ],
    [minX, ceilToHundred(maxX)]
  );

  const yTicks = useMemo(
    () => [
      minY,
      ...Array.from(
        { length: 10 },
        (_, i) => minY + ((ceilToHundred(maxY) - minY) / 10) * (i + 1)
      ),
    ],
    [minY, ceilToHundred(maxY)]
  );

  return (
    <>
      <svg
        className="cols-span-2 border-2 border-gray-500"
        width={width}
        height={height}
        onMouseEnter={() => setEnableTooltip(true)}
        onMouseLeave={() => setEnableTooltip(false)}
        onMouseMove={(e) => {
          const svgRect = e.currentTarget.getBoundingClientRect();

          const x = e.clientX - svgRect.left;
          const y = e.clientY - svgRect.top;
          setPositionValue({
            x: scalePointReverse(x - padding, minX, maxX, width - padding),
            y: maxY - scalePointReverse(y, minY, maxY, height - padding),
          });
          verticalDottedLineRef.current?.setAttribute("x1", x.toString());
          verticalDottedLineRef.current?.setAttribute("x2", x.toString());

          // console.log(dataMap);
          horizontalDottedLineRef.current?.setAttribute("y1", y.toString());
          horizontalDottedLineRef.current?.setAttribute("y2", y.toString());
        }}
      >
        {/* vertical dotted line */}
        <line
          ref={verticalDottedLineRef}
          x1={0}
          y1={0}
          x2={0}
          y2={height - padding}
          stroke="#000"
          strokeWidth="1"
          strokeDasharray="3"
        />
        {/* horizontal dotted line */}
        <line
          ref={horizontalDottedLineRef}
          x1={padding}
          y1={200}
          x2={width}
          y2={200}
          stroke="#000"
          strokeWidth="1"
          strokeDasharray="3"
        />

        {/* Grid lines */}
        {xTicks.map((tick) => (
          <line
            key={`x-grid-${tick}`}
            x1={scalePoint(tick, minX, maxX, width - padding) + padding}
            y1={0}
            x2={scalePoint(tick, minX, maxX, width - padding) + padding}
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
              height - scalePoint(tick, minY, maxY, height - padding) - padding
            }
            x2={width}
            y2={
              height - scalePoint(tick, minY, maxY, height - padding) - padding
            }
            stroke="#dddddd"
            strokeWidth="1"
            strokeDasharray="3"
          />
        ))}
        {/* X-axis label */}
        <text
          x={width / 2}
          y={height - padding / 2}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontWeight="bold"
        >
          Time (s)
        </text>
        {/* Y-axis label */}
        <text
          x={padding / 4}
          y={height / 2}
          transform={`rotate(-90, ${padding / 4}, ${height / 2})`}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontWeight="bold"
        >
          Height (m)
        </text>
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
              x1={scalePoint(tick, minX, maxX, width - padding) + padding}
              y1={height - padding + 5}
              x2={scalePoint(tick, minX, maxX, width - padding) + padding}
              y2={height - padding - 5}
              stroke="black"
            />
            <text
              x={scalePoint(tick, minX, maxX, width - padding) + padding}
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
                scalePoint(tick, minY, maxY, height - padding) -
                padding
              }
              x2={padding + 5}
              y2={
                height -
                scalePoint(tick, minY, maxY, height - padding) -
                padding
              }
              stroke="black"
            />
            <text
              x={padding - 10}
              y={
                height -
                scalePoint(tick, minY, maxY, height - padding) -
                padding +
                10
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
            cx={scalePoint(point.x, minX, maxX, width - padding) + padding}
            cy={
              height -
              scalePoint(point.y, minY, maxY, height - padding) -
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
                scalePoint(data[index].x, minX, maxX, width - padding) +
                padding,
              y:
                height -
                scalePoint(data[index].y, minY, maxY, height - padding) -
                padding,
            };
            const endPoint = {
              x:
                scalePoint(data[index + 1].x, minX, maxX, width - padding) +
                padding,
              y:
                height -
                scalePoint(data[index + 1].y, minY, maxY, height - padding) -
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
      {enableTooltip && (
        // <div className="flex absolute bottom-10 left-10 justify-left ">
        <div className=" bg-white w-fit p-2 rounded-md shadow-md text-sm">
          <p>
            x : {positionValue.x.toFixed(1)}, y : {positionValue.y.toFixed(1)}
          </p>
        </div>
      )}
    </>
  );
};

// Example usage
const Chart = () => {
  return (
    <div className="mb-4 m-3">
      <DataVisualization />
    </div>
  );
};

export default Chart;
