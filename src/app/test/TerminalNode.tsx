import { getPointFromIndex } from "./utils";

const TerminalNodes = ({ terminals }: { terminals: string[] }) => {
  return terminals.map(
    (terminal, i) =>
      terminal !== "-1__-1" && (
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
      )
  );
};

export default TerminalNodes;
