import { useAtom } from "jotai";
import { Pause, Play, RotateCcw } from "lucide-react";
import { PLAYING_STATES, playingAtom } from "./store";

const PauseResumeControl = () => {
  const [animating, setAnimating] = useAtom(playingAtom);
  return (
    <div className="flex flex-row gap-2 md:gap-4 items-center justify-center">
      <div
        // className="bg-green-500 cursor-pointer shadow-xl p-3 md:p-5 self-start  rounded-full hover:scale-125 transition-transform duration-300 transform "
        // if inputChanged true, this will be disabled
        className="bg-green-500 cursor-pointer shadow-xl p-3 md:p-5 self-start  rounded-full hover:scale-125 transition-transform duration-300 transform"
        onClick={() =>
          setAnimating((prev) =>
            prev === PLAYING_STATES.PLAY
              ? PLAYING_STATES.PAUSE
              : PLAYING_STATES.PLAY
          )
        }
      >
        {animating === PLAYING_STATES.PLAY ? (
          <Pause size={40} />
        ) : (
          <Play size={40} />
        )}
      </div>
      <div
        title="reset"
        className="bg-cyan-300 text-black self-start cursor-pointer hover:shadow-xl hover:scale-125 transition-transform duration-300 transform  p-4   rounded-full "
        onClick={() => setAnimating(PLAYING_STATES.RESET)}
      >
        <RotateCcw size={25} />
      </div>
    </div>
  );
};

export default PauseResumeControl;
