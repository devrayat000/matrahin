import { FC, useLayoutEffect, useState } from "react";
import { offset } from "./utils";

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
      viewBox={breakPoint === "sm" ? "0 -10 370 570" : " 0 -10 620 380"}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {Array.from({ length: breakPoint === "sm" ? 12 : 20 }, (_, i) =>
        Array.from({ length: breakPoint === "sm" ? 18 : 12 }, (_, j) => (
          <g
            key={i * 10 + j}
            onClick={(e) => {
              setPoint({
                x: i * 30 + offset,
                y: j * 30 + offset,
              });
            }}
            style={{ cursor: "pointer" }}
            opacity={0.1}
          >
            <circle
              cx={i * 30 + offset}
              cy={j * 30 + offset}
              r={15}
              fill="white"
            />
            <circle
              cx={i * 30 + offset}
              cy={j * 30 + offset}
              id="breadboardCircle"
              r={10}
              fill="white"
              stroke="black"
              strokeWidth={1.5}
            />
            <circle
              cx={i * 30 + offset}
              cy={j * 30 + offset}
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
