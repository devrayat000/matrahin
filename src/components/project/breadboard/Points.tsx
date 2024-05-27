import { offset } from "../equi-resistance/utils";

const Points = ({
  setPoint,
}: {
  setPoint: (point: { x: number; y: number }) => void;
}) => {
  return Array.from({ length: 20 }, (_, i) =>
    Array.from({ length: 12 }, (_, j) => (
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
        <circle cx={i * 30 + offset} cy={j * 30 + offset} r={15} fill="white" />
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
  );
};

export default Points;
