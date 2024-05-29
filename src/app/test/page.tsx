"use client";

// src/OceanScene.tsx
import {
  Loader,
  OrbitControls,
  PerspectiveCamera,
  Sky,
  View,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, forwardRef, useRef } from "react";
import { Color, Vector3 } from "three";
import Banks from "./Banks";
import Boat from "./Boat";
import Ocean from "./Ocean";

const App = () => {
  const mainContentRef = useRef<HTMLDivElement>();
  const sideContentRef = useRef<HTMLDivElement>();
  return (
    <div>
      <div className=" m-auto mt-3 w-[90svw] h-[100vh]">
        <Suspense fallback={<Loader />}>
          <Canvas shadows frameloop="demand">
            <View.Port />
          </Canvas>
        </Suspense>
        <MainContent ref={mainContentRef} />
        <SideContent ref={sideContentRef} />
      </div>
    </div>
  );
};

const vec = new Vector3(0, 0, 0);
const OceanScene = () => {
  return (
    <group>
      <Ocean />
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
      <Banks />
      <hemisphereLight
        args={[new Color(0xdddddd), new Color(0x00ffaa), 3]}
        position={[0, 5, 0]}
      />
    </group>
  );
};

const SideContent = forwardRef<HTMLDivElement>(({}, ref) => {
  return (
    <div id="main-content" ref={ref}>
      <View className=" absolute top-0 left-0 w-3/5 h-5/6 inline-block overflow-hidden ">
        <OceanScene />
        <Boat cameraFixed={true} />

        <PerspectiveCamera position={[0, 30, 90]} fov={60} makeDefault />
        <OrbitControls makeDefault />
      </View>
    </div>
  );
});
const MainContent = forwardRef<HTMLDivElement>(({}, ref) => {
  return (
    <div id="side-content" ref={ref}>
      <View className="absolute top-0 left-[60%] w-2/5 h-1/2   inline-block overflow-hidden ">
        <OceanScene />
        <Boat cameraFixed={false} offset={vec.clone().set(0, 5, 25)} />
        <OrbitControls makeDefault />

        <PerspectiveCamera position={[30, 10, 30]} makeDefault />
      </View>
    </div>
  );
});

export default App;
