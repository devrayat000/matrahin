"use client";

import { useFrame } from "@react-three/fiber";
import { useAtomValue } from "jotai";
import { useRef } from "react";
import * as THREE from "three";
import ReactFiberBasic from "~/components/common/ReactFiberBasic";
import { moiBasicInputsAtom } from "~/components/project/moment_of_inertia/store";
import { solidMaterial } from "../store";

const PointMass = () => {
  const inputs = useAtomValue(moiBasicInputsAtom);

  const { radius } = inputs;
  const ref = useRef<THREE.Group<THREE.Object3DEventMap>>();
  useFrame(({ clock }) => {
    ref.current.rotation.y = 2 * clock.getElapsedTime();
  });
  return (
    <group ref={ref}>
      <mesh position={[radius, 1, 0]}>
        <sphereGeometry attach={"geometry"} args={[0.05]} />
        <meshPhongMaterial {...solidMaterial} />
      </mesh>

      <arrowHelper
        args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), radius]}
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
