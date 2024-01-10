"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const PointMass = () => {
  const ref = useRef<THREE.Group<THREE.Object3DEventMap>>();
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime();
  });
  return (
    <group ref={ref}>
      <mesh position={[2, 1, 0]}>
        <sphereGeometry attach={"geometry"} args={[0.2]} />
        <meshPhongMaterial
          attach={"material"}
          color={new THREE.Color(0x156289)}
          emissive={new THREE.Color(0x072534)}
          side={THREE.DoubleSide}
          flatShading={true}
        />
      </mesh>

      <arrowHelper
        args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), 2]}
      />
    </group>
  );
};

const Scene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas: HTMLElement = document.getElementById("canvas");

    canvasRef.current.style.width = canvas.clientWidth + "px";
    canvasRef.current.style.height = canvas.clientHeight + "px";

    // console.log((canvas.clientWidth, canvas.clientHeight));
  }, []);
  return (
    <div
      id="canvas"
      style={{
        height: "60vh",
        width: "60vw",
      }}
    >
      <Canvas ref={canvasRef}>
        <color attach="background" args={["#444444"]} />
        <PerspectiveCamera
          makeDefault
          position={[6, 2, 6]}
          fov={20}
          near={1}
          far={56}
        />
        <OrbitControls />

        <PointMass />
        <directionalLight position={[0, 3, 0]} intensity={1} />
        <axesHelper args={[50]} />
      </Canvas>
    </div>
  );
};

export default function SceneInit() {
  useEffect(() => {
    console.log(
      document.getElementById("hi2")?.clientWidth,
      document.getElementById("hi2")?.clientHeight
    );
  }, []);
  return (
    <div>
      <p className="text-center">hi</p>
      <div id="div" className="flex w-[900px] h-[700px] flex-row items-center ">
        <div id="hi" className="text-center">
          asdfasdfklajsd;lfkajsd;flkasjdf;laksdfj
          <br />
          asfas;lkdfja;slkdfj;
        </div>
        <div id="hi2" className="w-full h-full">
          <Scene />
        </div>
      </div>
    </div>
  );
}
