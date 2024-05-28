"use client";

// src/OceanScene.tsx
import { Gltf, OrbitControls, Sky } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAtomValue } from "jotai";
import React, { forwardRef, useRef } from "react";
import { Color, Object3D, Object3DEventMap } from "three";
import Banks from "./Banks";
import Ocean from "./River";
import { RiverWidthAtom } from "./store";

const App: React.FC = () => {
  const boatRef = useRef<Object3D<Object3DEventMap>>(null);
  return (
    <div id="container" className=" m-auto mt-3 w-[70svw] h-[80svh]">
      <Canvas camera={{ position: [30, 30, 100], fov: 60 }}>
        <axesHelper args={[100]} />
        <Ocean />
        <OrbitControls />
        <Sky
          distance={450000}
          sunPosition={[0, 1, 0]}
          inclination={0}
          azimuth={0.25}
          turbidity={10}
          rayleigh={2}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />
        <hemisphereLight
          args={[new Color(0xdddddd), new Color(0x00ffaa), 3]}
          position={[0, 5, 0]}
        />
        <BoatComponent ref={boatRef} />
        <Banks />
      </Canvas>
    </div>
  );
};

export default App;
const BoatComponent = forwardRef<Object3D<Object3DEventMap>, {}>(
  (props, boatRef) => {
    const riverWidth = useAtomValue(RiverWidthAtom);
    useFrame(({ camera }, delta) => {
      const gltf = boatRef.current;
      if (gltf) {
        // gltf.translateZ(-0.3);
        // gltf.translateX(-0.3);
        // const idealLookat = new Vector3(0, 0, 0);
        // idealLookat.applyQuaternion(gltf.quaternion);
        // idealLookat.add(gltf.position);
        // idealLookat.lerp(camera.position, 0.05);
        // camera.lookAt(idealLookat);
        // const idealOffset = new Vector3(0, 20, 50);
        // idealOffset.applyQuaternion(gltf.quaternion);
        // idealOffset.add(gltf.position);
        // camera.position.lerp(idealOffset, 0.05);
      }
    });
    return (
      <Gltf
        ref={boatRef}
        src="/punter.glb"
        scale={0.05}
        position-y={0.95}
        position-z={riverWidth / 2 - 15}
        receiveShadow
        castShadow
      />
    );
  }
);
