/**
 * Toggles the full-screen mode for the specified HTML canvas element.
 * If the canvas is already in full-screen mode, it exits full-screen mode.
 * If the canvas is not in full-screen mode, it enters full-screen mode.
 *
 * @param canvas - The HTML canvas element to toggle full-screen mode for.
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
