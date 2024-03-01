import { Html } from "@react-three/drei";

/**
 * Toggles the full-screen mode for the specified HTML canvas element.
 * If the canvas is already in full-screen mode, it exits full-screen mode.
 * If the canvas is not in full-screen mode, it enters full-screen mode.
 *
 * @param canvas - The HTML canvas element to toggle full-screen mode for.
 * @param setFullScreen - A callback function to update the full-screen state.
 */
export const toggleFullScreen = (
  canvas: HTMLDivElement,
  setFullScreen: (value: boolean) => void
) => {
  if (!canvas) return;
  if (document.fullscreenElement)
    document.exitFullscreen().then(() => {
      setFullScreen(false);
    });
  else
    canvas
      .requestFullscreen()
      .then(() => {
        setFullScreen(true);
      })
      .catch((err) => {
        console.error(
          "Error attempting to enable full-screen mode:",
          err.message
        );
      });
};

/**
 * Adds key control to go full-screen for the specified HTML div element.
 * Pressing the 'f' key toggles the full-screen mode.
 *
 * @param div - The HTML div element to add key control for full-screen mode.
 * @param setFullScreenOn - A callback function to update the full-screen state.
 */
export const addKeyControlToGoFullScreen = (
  div: HTMLDivElement,
  setFullScreenOn: (value: boolean) => void
) => {
  if (!div) return;
  window.addEventListener("keypress", (e) => {
    if (e.key === "f") {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setFullScreenOn(false);
      } else {
        div
          .requestFullscreen()
          .then(() => {
            setFullScreenOn(true);
          })
          .catch((err) => {
            console.error(
              "Error attempting to enable full-screen mode:",
              err.message
            );
          });
      }
    }
  });
};
