import { FC, useLayoutEffect, useState } from "react";
import { getPointFromIndex } from "./utils";

interface BreadboardProps extends React.SVGProps<SVGSVGElement> {
  setPoint: (point: { x: number; y: number }) => void;
}

const Breadboard: FC<BreadboardProps> = ({
  className,
  children,
  setPoint,
  ...props
}) => {
  const [breakPoint, setBreakPoint] = useState<"sm" | "md" | "lg">("sm");
  useLayoutEffect(() => {
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
      viewBox={breakPoint === "sm" ? "0 -10 370 570" : " 0 -10 750 380"}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* so, max index can be 22,17 */}
      {Array.from({ length: breakPoint === "sm" ? 12 : 23 }, (_, i) =>
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
