"use client";

import { useFrame } from "@react-three/fiber";
import { atom, useAtom, useAtomValue } from "jotai";
import { useRef } from "react";
import * as THREE from "three";
import ReactFiberBasic from "~/components/common/ReactFiberBasic";
import Chip from "~/components/ui/chip";
import { solidMaterial } from "../store";

const axisAtom = atom<"x" | "y" | "e">("y");
const Rod = () => {
  const ref = useRef<THREE.Group<THREE.Object3DEventMap>>();
  const meshRef = useRef<THREE.Mesh<THREE.BufferGeometry>>();
  const axis = useAtomValue(axisAtom);
  const prevAxis = useRef(axis);
  useFrame(({ clock }) => {
    if (prevAxis.current !== axis) {
      ref.current.rotation.set(0, 0, 0);
      if (axis === "e") meshRef.current.position.set(0, 0.5, 1.5);
      else meshRef.current.position.set(0, 0.5, 0);
      prevAxis.current = axis;
    } else {
      // Rotate the entire group instead of the individual mesh for x or y axis
      ref.current.rotation[axis] = 2 * clock.getElapsedTime();
      if (axis === "e") ref.current.rotation.y = 2 * clock.getElapsedTime();
    }
  });
  return (
    <group ref={ref}>
      <mesh ref={meshRef} position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3]} />
        <meshPhongMaterial {...solidMaterial} />
      </mesh>
    </group>
  );
};

const AxisControl = () => {
  const [axis, setAxis] = useAtom(axisAtom);
  return (
    <div className="flex flex-row items-center justify-evenly mb-2 gap-1">
      <p className="text-lg">Rotation Axis</p>
      <div className="flex flex-row items-center justify-evenly gap-2">
        <Chip
          label={"Center"}
          selected={axis === "y"}
          onClick={() => setAxis("y")}
        />
        <Chip
          label={"End"}
          selected={axis === "e"}
          onClick={() => setAxis("e")}
        />
      </div>
    </div>
  );
};
const Scene = () => {
  return (
    <div className="h-[30vh] w-[40vh] md:w-[70vh] md:h-[70vh]">
      <AxisControl />
      <ReactFiberBasic>
        <Rod />
      </ReactFiberBasic>
    </div>
  );
};

export default Scene;
