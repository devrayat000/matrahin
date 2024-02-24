import { useEffect, useState } from "react";

/**
 * returns a SVG canvas with a useful coordinate system
 * @param origin - origin of the coordinate system
 * @param xOffset - positive x offset from the edge, for center its extra distance from left edge
 * @param yOffset - positive y offset from the edge
 * @returns
 */
const GraphSVG = ({
  origin,
  xOffset = 0,
  yOffset = 0,
  children = null,
}: {
  origin: "center" | "top-left" | "bottom-left" | "top-right" | "bottom-right";
  xOffset?: number;
  yOffset?: number;
  children?: React.ReactNode;
}) => {
  const [height, setHeight] = useState(300);
  const [width, setWidth] = useState(300);

  useEffect(() => {
    const svg = document.getElementById("wrapper");
    const { width: w, height: h } = svg.getBoundingClientRect();
    // console.log(w, h);
    setHeight(h);
    setWidth(w);
  }, []);

  const originX = () => {
    if (origin === "center") return -width / 2 - xOffset;
    if (origin === "top-left") return -xOffset;
    if (origin === "bottom-left") return -xOffset;
    if (origin === "top-right") return -width + xOffset;
    if (origin === "bottom-right") return -width + xOffset;
  };

  const originY = () => {
    if (origin === "center") return -height / 2 - yOffset;
    if (origin === "top-left") return -yOffset;
    if (origin === "bottom-left") return -height + yOffset;
    if (origin === "top-right") return -yOffset;
    if (origin === "bottom-right") return -height + yOffset;
  };
  const viewBox = `${originX()} ${originY()} ${width} ${height}`;

  return (
    <svg
      id="wrapper"
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      // className="bg-gray-100"
    >
      {/* <image
        href="/public/"
        x="0"
        y="0"
        height={height}
        width={width}
      /> */}

      {/* show outer canvas size */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="none"
        stroke="black"
      />

      {/* main canvas where all the drawing will go, coordinate system is set first */}
      <svg viewBox={viewBox}>
        <circle cx="10" cy="10" r="10" fill="red" />
        <circle cx="10" cy="-10" r="10" fill="green" />
        <circle cx="-10" cy="-10" r="10" fill="blue" />
        <circle cx="-10" cy="10" r="10" fill="black" />
        {/* <rect
          x={originX()}
          y={-originY()}
          width={width}
          height={height}
          fill="black"
          stroke="black"
        /> */}
        {children}
      </svg>
    </svg>
  );
};

export default GraphSVG;
