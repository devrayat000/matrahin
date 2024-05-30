"use client";

// src/OceanScene.tsx
import {
  Loader,
  OrbitControls,
  PerspectiveCamera,
  View,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, forwardRef, useRef } from "react";
import { Vector3 } from "three";
import Boat from "./Boat";
import OceanScene from "./OceanScene";

const App = () => {
  const mainContentRef = useRef<HTMLDivElement>();
  const sideContentRef = useRef<HTMLDivElement>();
  const upContentRef = useRef<HTMLDivElement>();

  return (
    <div>
      <div className=" m-auto mt-3 w-[90svw] h-[85vh]">
        <Suspense fallback={<Loader />}>
          <Canvas shadows>
            <View.Port />
          </Canvas>
        </Suspense>
        <BoatPOV ref={mainContentRef} />
        <SideContent ref={sideContentRef} />
        <UpContent ref={upContentRef} />
      </div>
    </div>
  );
};

const vec = new Vector3(0, 0, 0);

const UpContent = forwardRef<HTMLDivElement>(({}, ref) => {
  return (
    <div id="main-content" ref={ref} className="cursor-move">
      <View className=" absolute top-0 left-0 w-1/2 h-full inline-block overflow-hidden ">
        <OceanScene />
        <Boat cameraFixed={true} lookAtBoat={false} />
        <PerspectiveCamera position={[0, 300, 0]} fov={60} makeDefault />
        <OrbitControls makeDefault />
      </View>
    </div>
  );
});

const BoatPOV = forwardRef<HTMLDivElement>(({}, ref) => {
  return (
    <div id="side-content" ref={ref}>
      <View className="absolute top-0 left-1/2 w-1/2 h-1/2    inline-block overflow-hidden   ">
        <OceanScene />
        <Boat cameraFixed={false} offset={vec.clone().set(0, 5, 25)} />
        <OrbitControls makeDefault />

        <PerspectiveCamera position={[30, 10, 30]} makeDefault />
      </View>
    </div>
  );
});

const SideContent = forwardRef<HTMLDivElement>(({}, ref) => {
  return (
    <div id="main-content" ref={ref} className="cursor-move">
      <View className=" absolute top-1/2 left-1/2 w-1/2 h-1/2 inline-block overflow-hidden ">
        <OceanScene />
        <Boat cameraFixed={true} offset={vec.clone().set(0, 5, 25)} />

        <PerspectiveCamera position={[0, 30, 90]} fov={60} makeDefault />
        <OrbitControls makeDefault />
      </View>
    </div>
  );
});

export default App;
