import { Html } from "@react-three/drei";
import { Fragment } from "react";

/**
 * Renders the X-axis ticks on the canvas.
 *
 * @param length - The length of the X-axis.
 * @param y - The y-coordinate of the ticks.
 * @returns The XTicks component.
 */
export const XTicks = ({ length, y }: { length: number; y: number }) => {
  return (
    <>
      {Array.from({ length: length / 5 }, (_, i) => (
        <Fragment key={i}>
          <Html className="text-white text-xs" position={[0, y, i * 5]}>
            {i * 5}
          </Html>
          <Html className="text-white text-xs" position={[0, y, -i * 5]}>
            {-i * 5}
          </Html>
        </Fragment>
      ))}
    </>
  );
};
