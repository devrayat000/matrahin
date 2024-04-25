import { useAtom, useAtomValue } from "jotai";
import { Pause, Play, RotateCcw } from "lucide-react";
import {
  PLAYING_STATES,
  playingAtom,
  twoDCollisionInputsAtom,
} from "~/components/project/collision-2d/store";

const PauseResumeControl = () => {
  const [animating, setAnimating] = useAtom(playingAtom);
  const massValue1 = useAtomValue(twoDCollisionInputsAtom)[0].M;
  const massValue2 = useAtomValue(twoDCollisionInputsAtom)[1].M;
  return (
    <div className="flex flex-row gap-2 md:gap-4 items-center justify-center">
      <button
        // className="bg-green-500 cursor-pointer shadow-xl p-3 md:p-5 self-start  rounded-full hover:scale-125 transition-transform duration-300 transform "
        // if inputChanged true, this will be disabled
        className="bg-green-500 cursor-pointer shadow-xl p-3 md:p-5 self-start  rounded-full hover:scale-125 transition-transform duration-300 transform disabled:bg-gray-500 disabled:hover:scale-100"
        onClick={() =>
          setAnimating((prev) =>
            prev === PLAYING_STATES.PLAY
              ? PLAYING_STATES.PAUSE
              : PLAYING_STATES.PLAY
          )
        }
        disabled={massValue1 === 0 || massValue2 === 0}
        title="play/pause"
      >
        {animating === PLAYING_STATES.PLAY ? (
          <Pause size={40} />
        ) : (
          <Play size={40} />
        )}
      </button>
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
