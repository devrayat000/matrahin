import React from "react";

export const useAnimationFrame = (
  nextAnimationFrameHandler: () => void,
  shouldAnimate = true
) => {
  const frame = React.useRef(0);

  const animate = () => {
    nextAnimationFrameHandler();
    frame.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    const startAnimation = () => {
      frame.current = requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      cancelAnimationFrame(frame.current);
    };

    if (shouldAnimate) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return stopAnimation;
  }, [shouldAnimate]);
};
