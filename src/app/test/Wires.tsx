import { Wire } from "./store";
import { getCoordinatesById } from "./utils";

const WiresComponent = ({
  WiresList,
  onClick,
}: {
  WiresList: Wire[];
  onClick: () => void;
}) => {
  return WiresList.map((wire, index) => {
    const start = getCoordinatesById(wire.start);
    const end = getCoordinatesById(wire.end);
    return (
      <line
        key={index}
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        style={{
          stroke: "black",
          strokeWidth: 2,
        }}
        onClick={onClick}
      />
    );
  });
};

export default WiresComponent;
