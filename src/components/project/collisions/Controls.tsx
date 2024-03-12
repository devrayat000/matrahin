import { useAtom } from "jotai";
import {
  ChevronsLeft,
  ChevronsRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { FC } from "react";
import { playingAtom } from "./store";

interface ControlProps {
  resetPosition: () => void;
}

const SpeedControl: FC = () => {
  return (
    <div className="flex flex-row items-center gap-2">
      <ChevronsLeft size={30} />
      <span>1x</span>
      <ChevronsRight size={30} />
    </div>
  );
};

const Controls: FC<ControlProps> = ({ resetPosition }) => {
  const [playing, setPlaying] = useAtom(playingAtom);
  return (
    <div className="flex flex-row justify-between items-center gap-6 w-fit text-white">
      {/* <div>
        <SpeedControl />
      </div> */}
      <div>
        <button onClick={() => setPlaying(!playing)}>
          {playing ? <Pause size={50} /> : <Play size={50} />}
        </button>
      </div>

      <div>
        <button onClick={resetPosition}>
          <RotateCcw size={40} />
        </button>
      </div>
    </div>
  );
};

export default Controls;
