import { useAtom } from "jotai";
import VoltageSource from "./VoltageSourceSVG";
import { PlusLeftAtom } from "./store";

const VoltageSources = () => {
  const [plusLeft, setPlusLeft] = useAtom(PlusLeftAtom);

  return (
    <g>
      <rect
        x="300"
        y="670"
        width="110"
        height="70"
        strokeWidth={1}
        fill={plusLeft ? "#00ffaa" : "none"}
      />
      {/* draw voltage sorce */}
      <g transform="translate(300 670)  ">
        <VoltageSource size={100} plusLeft={true} />
      </g>

      <rect
        x="490"
        y="670"
        width="110"
        height="70"
        strokeWidth={1}
        fill={!plusLeft ? "#00ffaa" : "none"}
      />
      <g transform="translate(490 670)  ">
        <VoltageSource size={100} plusLeft={false} />
      </g>
      <rect
        x="490"
        y="670"
        width="110"
        height="70"
        opacity={0}
        fill="red"
        cursor="pointer"
        onClick={() => setPlusLeft((prev) => !prev)}
      />
      <rect
        x="300"
        y="670"
        width="110"
        height="70"
        opacity={0}
        fill="red"
        cursor="pointer"
        onClick={() => setPlusLeft((prev) => !prev)}
      />
    </g>
  );
};

export default VoltageSources;
