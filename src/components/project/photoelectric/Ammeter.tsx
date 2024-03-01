import { useAtomValue } from "jotai";
import { CurrentAtom } from "./store";

const Ammeter = () => {
  const currentValue = useAtomValue(CurrentAtom);

  return (
    <g>
      {/* ammeter */}
      {/* <rect x="715" y="400" width="170" height="100" /> */}
      <circle cx="800" cy="700" r="70" fill="none" />
      {/* text indicating current value placed at the center aligned of the circle */}
      <text
        x="800"
        y="685"
        fontSize="40"
        strokeWidth={3}
        alignmentBaseline="middle"
        dominantBaseline="middle"
        textAnchor="middle"
      >
        {currentValue.toFixed(2)}
      </text>

      <text
        x="800"
        y="725"
        fontSize="40"
        strokeWidth={3}
        alignmentBaseline="middle"
        dominantBaseline="middle"
        textAnchor="middle"
      >
        mA
      </text>
    </g>
  );
};

export default Ammeter;
