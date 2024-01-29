"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import ReactFiberBasic from "~/components/common/ReactFiberBasic";

const PointMass = () => {
  const ref = useRef<THREE.Group<THREE.Object3DEventMap>>();
  useFrame(({ clock }) => {
    ref.current.rotation.y = 2 * clock.getElapsedTime();
  });
  return (
    <group ref={ref}>
      <mesh position={[2, 1, 0]}>
        <sphereGeometry attach={"geometry"} args={[0.05]} />
        <meshPhongMaterial
          attach={"material"}
          color={new THREE.Color(0x069fec)}
          emissive={new THREE.Color(0x072534)}
          side={THREE.DoubleSide}
          flatShading={true}
        />
      </mesh>
      <mesh position={[-2, 1, 0]}>
        <sphereGeometry attach={"geometry"} args={[0.05]} />
        <meshPhongMaterial
          attach={"material"}
          color={new THREE.Color(0x069fec)}
          emissive={new THREE.Color(0x072534)}
          side={THREE.DoubleSide}
          flatShading={true}
        />
      </mesh>

      <Line
        points={[new THREE.Vector3(2, 1, 0), new THREE.Vector3(-2, 1, 0)]}
      />
    </group>
  );
};

const Scene = () => {
  return (
    <div className="h-[30vh] w-[40vh] md:w-[70vh] md:h-[70vh]">
      <ReactFiberBasic>
        <PointMass />
      </ReactFiberBasic>
    </div>
  );
};

export default Scene;
