import { useAtomValue } from "jotai";
import TerminalNodes from "../breadboard/TerminalNode";
import { TerminalsCapacitorAtom } from "./store";

const TerminalPoints = () => {
  const terminals = useAtomValue(TerminalsCapacitorAtom);
  return <TerminalNodes terminals={terminals} />;
};

export default TerminalPoints;
