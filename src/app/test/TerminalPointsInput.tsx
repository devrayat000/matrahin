import { useAtomValue } from "jotai";
import { TerminalsAtom } from "./store";
import TerminalNodes from "./TerminalNode";

const TerminalPoints = () => {
  const terminals = useAtomValue(TerminalsAtom);
  return <TerminalNodes terminals={terminals} />;
};

export default TerminalPoints;
