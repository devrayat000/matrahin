import { useAtomValue } from "jotai";
import { PlusLeftAtom, VoltageAtom } from "./store";

const VoltagePart = () => {
  const plusLeft = useAtomValue(PlusLeftAtom);
  const voltage = useAtomValue(VoltageAtom);
  return (
    <g>
      {/* circle from voltage source wire */}
      <circle
        cx="300"
        cy="800"
        r="20"
        fill={plusLeft ? "red" : "black"}
        strokeWidth="0"
      />
      <circle
        cx="600"
        cy="800"
        r="20"
        fill={!plusLeft ? "red" : "black"}
        strokeWidth="0"
      />
      <text x="290" y="780" fontSize="36" strokeWidth={2}>
        {plusLeft ? "+" : "-"}
      </text>
      <text x="590" y="780" fontSize="36" strokeWidth={2}>
        {!plusLeft ? "+" : "-"}
      </text>
      {/* voltage value */}

      <text x="400" y="800" fontSize="40" strokeWidth={3}>
        {Math.abs(voltage).toFixed(2)} V
      </text>
      {/* voltage source */}
      <rect x="250" y="650" width="400" height="300" />
    </g>
  );
};

export default VoltagePart;
