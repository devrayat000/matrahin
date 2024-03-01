import { useAtomValue } from "jotai";
import TerminalNodes from "../breadboard/TerminalNode";
import { TerminalsAtom } from "./store";

const TerminalPoints = () => {
  const terminals = useAtomValue(TerminalsAtom);
  return <TerminalNodes terminals={terminals} />;
};

export default TerminalPoints;
