"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAtomValue } from "jotai";
import { useRef } from "react";
import * as THREE from "three";
import ReactFiberBasic from "~/components/common/ReactFiberBasic";
import { moiBasicInputsAtom } from "~/components/project/moment_of_inertia/store";

const PointMass = () => {
  const inputs = useAtomValue(moiBasicInputsAtom);

  const { distance } = inputs;
  const ref = useRef<THREE.Group<THREE.Object3DEventMap>>();
  useFrame(({ clock }) => {
    ref.current.rotation.y = 2 * clock.getElapsedTime();
  });
  return (
    <group ref={ref}>
      <mesh position={[distance, 1, 0]}>
        <sphereGeometry attach={"geometry"} args={[0.1]} />
        <meshPhongMaterial
          attach={"material"}
          color={new THREE.Color(0x069fec)}
          emissive={new THREE.Color(0x072534)}
          side={THREE.DoubleSide}
          flatShading={true}
        />
      </mesh>
      <mesh position={[-distance, 1, 0]}>
        <sphereGeometry attach={"geometry"} args={[0.1]} />
        <meshPhongMaterial
          attach={"material"}
          color={new THREE.Color(0x069fec)}
          emissive={new THREE.Color(0x072534)}
          side={THREE.DoubleSide}
          flatShading={true}
        />
      </mesh>

      <Line
        points={[
          new THREE.Vector3(distance, 1, 0),
          new THREE.Vector3(-distance, 1, 0),
        ]}
      />
    </group>
  );
};

const Scene = () => {
  return (
    <div className="h-[30vh] w-[40vh] md:w-[70vh] md:h-[70vh] md:self-start">
      <ReactFiberBasic>
        <PointMass />
      </ReactFiberBasic>
    </div>
  );
};

export default Scene;
