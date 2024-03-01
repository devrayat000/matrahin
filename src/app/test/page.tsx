"use client";
import { useRef } from "react";

function FullScreenButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ position: "absolute", bottom: 10, right: 10 }}
    >
      Full Screen
    </button>
  );
}

function ThreeCanvas() {
  const canvasRef = useRef(null);

  return (
    <>
      {/* <div className="w-full h-[70svh]">
        <Canvas ref={canvasRef}>
          <gridHelper args={[10, 10]} />
        </Canvas>
      </div>
      <FullScreenButton
        onClick={() => {
          toggleFullScreen(canvasRef.current);
        }}
      />
       */}
    </>
  );
}

export default ThreeCanvas;
