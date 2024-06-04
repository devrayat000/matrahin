import Ammeter from "./Ammeter";
import Light from "./Light";
import TubeCanvas from "./TubeCanvas";
import VoltageInput from "./VoltageInput";
import VoltagePart from "./VoltagePart";
import VoltageSources from "./VoltageSources";
import WorkFunctionInput from "./WorkFunctionInput";

const MainSimulation = () => {
  return (
    <svg
      style={{
        width: "50vw",
        height: "80vh",
      }}
      // className="border border-slate-900"
      viewBox="0 0 1000 1000"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="4  "
      stroke="black"
      fill="none"
    >
      <rect x="0" y="0" width="1000" height="1000" />
      {/* vertical first line */}
      <line x1="100" y1="450" x2="100" y2="800" />
      {/* horizontal top line */}
      <line x1="100" y1="450" x2="250" y2="450" />
      <line x1="650" y1="450" x2="800" y2="450" />
      {/* vertical second line */}
      {/* before and after ammeter line */}
      <line x1="800" y1="450" x2="800" y2="630" />
      <Ammeter />
      <line x1="800" y1="770" x2="800" y2="800" />
      {/* horizontal bottom line */}
      <line x1="98" y1="800" x2="300" y2="800" />
      <line x1="600" y1="800" x2="802" y2="800" />

      <g>
        <Light />
      </g>

      {/* work function input */}
      <foreignObject
        height={250}
        width={300}
        transform="translate(10,100)"
        fontSize={30}
      >
        <WorkFunctionInput />
      </foreignObject>

      {/* canvas */}
      <g transform="translate(200 270) scale(0.5 0.5) ">
        <foreignObject width="1000" height="1000" fontSize={34}>
          <TubeCanvas />
        </foreignObject>
      </g>

      <VoltagePart />
      <g transform="translate(-450 800)">
        <foreignObject width={1000} height={200} transform="scale(1.8, 2)">
          <VoltageInput />
        </foreignObject>
      </g>
      <VoltageSources />
    </svg>
  );
};

export default MainSimulation;
