import { useAtom } from "jotai";
import { Maximize, Minimize } from "lucide-react";
import { fullScreenOnAtom } from "~/app/collision/store";
import { toggleFullScreen } from "~/lib/utils/3DCanvasUtils";

/**
 * Renders a button that toggles full screen mode when clicked.
 * @param div - The HTMLDivElement that should be displayed in full screen mode.
 *
 * @returns {JSX.Element} The rendered FullScreenButton component.
 */
const FullScreenButton = ({ div }: { div: HTMLDivElement }): JSX.Element => {
  const [fullScreenOn, setFullScreenOn] = useAtom(fullScreenOnAtom);
  return (
    <div className="absolute bottom-2 right-2 ">
      <button
        onClick={() => {
          toggleFullScreen(div as HTMLDivElement, setFullScreenOn);
        }}
        className=" backdrop-blur-[1px] backdrop-brightness-75 text-white p-1 lg:scale-125 hover:scale-150  rounded-md"
      >
        {fullScreenOn ? <Minimize size={40} /> : <Maximize size={40} />}
      </button>
    </div>
  );
};

export default FullScreenButton;
