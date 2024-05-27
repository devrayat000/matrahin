import { FC, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { getPointFromIndex } from "./utils";

interface BreadboardProps extends React.SVGProps<SVGSVGElement> {
  setPoint: (point: { x: number; y: number }) => void;
  rangeForComponents?: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

const Breadboard: FC<BreadboardProps> = ({
  className,
  children,
  setPoint,
  rangeForComponents,
  ...props
}) => {
  const [breakPoint, setBreakPoint] = useState<"sm" | "md" | "lg">("sm");

  const viewBoxSize = useMemo(() => {
    //x:y  ratio for sm::12:18, md: 24:12
    const maxWidth = breakPoint === "sm" ? 370 : 730;
    const maxHeight = breakPoint === "sm" ? 566.5 : 375;
    const ratioOriginal = maxWidth / (maxHeight - 10);

    if (rangeForComponents === undefined)
      return { x1: 0, y1: -10, x2: maxWidth, y2: maxHeight };

    let croppedWidth = rangeForComponents.maxX - rangeForComponents.minX;
    let croppedHeight = rangeForComponents.maxY - rangeForComponents.minY;

    // if the cropped Width is much less than maxWidth, the width should be increased
    if ((croppedWidth * 30) / maxWidth <= 0.33) {
      croppedWidth = croppedHeight * ratioOriginal;
    }
    if ((croppedHeight * 30) / maxHeight <= 0.33) {
      croppedHeight = croppedWidth / ratioOriginal;
    }
    return {
      x1: rangeForComponents.minX * 30,
      y1: rangeForComponents.minY * 30,
      x2: croppedWidth * 30,
      y2: croppedHeight * 30 + 30,
    };
    // console.log(
    //   `x:[${rangeForComponents.minX},${rangeForComponents.maxX}],y:[${rangeForComponents.minY},${rangeForComponents.maxY}]`
    // );
    // console.log("w:" + maxWidth + " , h: " + maxHeight);
    // const ratioCropped = croppedWidth / croppedHeight;

    // if (ratioCropped < ratioOriginal) {
    //   const newWidth = ratioOriginal * croppedHeight;
    //   return {
    //     x1: rangeForComponents.minX * 30,
    //     y1: rangeForComponents.minY * 30,
    //     x2: newWidth * 30,
    //     y2: (croppedHeight + 2) * 30,
    //   };
    // }
    // const newHeight = croppedWidth / ratioOriginal;
    // return {
    //   x1: rangeForComponents.minX - 1,
    //   y1: rangeForComponents.minY - 1,
    //   x2: (croppedWidth + 2) * 30,
    //   y2: newHeight * 30,
    // };
  }, [
    breakPoint,
    rangeForComponents?.maxX,
    rangeForComponents?.maxY,
    rangeForComponents?.minX,
    rangeForComponents?.minY,
  ]);
  useEffect(() => {
    const updateBreakpoint = () => {
      if (window.innerWidth < 480) {
        setBreakPoint("sm");
      } else if (window.innerWidth < 768) {
        setBreakPoint("md");
      } else {
        setBreakPoint("lg");
      }
    };
    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return (
    <svg
      viewBox={`${viewBoxSize.x1} ${viewBoxSize.y1} ${viewBoxSize.x2} ${viewBoxSize.y2}`}
      // viewBox="0 -10 700 380"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* so, max index can be 22,17 */}
      {Array.from({ length: breakPoint === "sm" ? 12 : 24 }, (_, i) =>
        Array.from({ length: breakPoint === "sm" ? 18 : 12 }, (_, j) => (
          <g
            key={i * 10 + j}
            onClick={(e) => {
              setPoint({
                x: i,
                y: j,
              });
            }}
            cursor="pointer"
            opacity={0.1}
          >
            <circle
              cx={getPointFromIndex(i)}
              cy={getPointFromIndex(j)}
              r={15}
              fill="white"
            />
            <circle
              cx={getPointFromIndex(i)}
              cy={getPointFromIndex(j)}
              id="breadboardCircle"
              r={10}
              fill="white"
              stroke="black"
              strokeWidth={1.5}
            />
            <circle
              cx={getPointFromIndex(i)}
              cy={getPointFromIndex(j)}
              r={5}
              opacity={10}
              fill="black"
            />
          </g>
        ))
      )}

      {children}
    </svg>
  );
};

export default Breadboard;
