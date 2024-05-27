import { getPointFromIndex } from "../equi-resistance/utils";

const TerminalNodes = ({ terminals }: { terminals: string[] }) => {
  return terminals.map(
    (terminal, i) =>
      terminal !== "-1__-1" && (
        <g key={i}>
          <circle
            key={i}
            cx={getPointFromIndex(parseInt(terminal.split("__")[0]))}
            cy={getPointFromIndex(parseInt(terminal.split("__")[1]))}
            r={12}
            // blue for terminal 1 and
            //  green for terminal 2
            fill="none"
            stroke={i == 0 ? "blue" : "green"}
            strokeWidth={2}
          />
          <text
            x={getPointFromIndex(parseInt(terminal.split("__")[0])) - 10}
            y={getPointFromIndex(parseInt(terminal.split("__")[1])) + 23}
            fill="black"
            fontSize="12"
          >
            {i == 0 ? "A" : "B"}
          </text>
        </g>
      )
  );
};

export default TerminalNodes;
