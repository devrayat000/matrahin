"use client";

import { useFrame } from "@react-three/fiber";
import { atom, useAtom, useAtomValue } from "jotai";
import { useRef } from "react";
import * as THREE from "three";
import ReactFiberBasic from "~/components/common/ReactFiberBasic";
import Chip from "~/components/ui/chip";
import { solidMaterial, wireframeMaterial } from "../store";

const axisAtom = atom<"x" | "y" | "e">("y");
const Plate = () => {
  const ref = useRef<THREE.Group<THREE.Object3DEventMap>>();
  const meshRef = useRef<THREE.Mesh<THREE.BufferGeometry>>();
  const lineRef = useRef<THREE.LineSegments<THREE.BufferGeometry>>();
  const axis = useAtomValue(axisAtom);
  const prevAxis = useRef(axis);
  useFrame(({ clock }) => {
    if (prevAxis.current !== axis) {
      ref.current.rotation.set(0, 0, 0);
      if (axis === "e") {
        meshRef.current.position.set(1, 0, 0);
        lineRef.current.position.set(1, 0, 0);
      } else {
        meshRef.current.position.set(0, 0, 0);
        lineRef.current.position.set(0, 0, 0);
      }
      prevAxis.current = axis;
    } else {
      // Rotate the entire group instead of the individual mesh for x or y axis
      ref.current.rotation[axis] = 2 * clock.getElapsedTime();
      if (axis === "e") ref.current.rotation.y = 2 * clock.getElapsedTime();
    }
  });

  return (
    <group ref={ref}>
      <mesh ref={meshRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 1.5]} />
        <meshPhongMaterial {...solidMaterial} />
      </mesh>
      <lineSegments
        ref={lineRef}
        geometry={
          new THREE.WireframeGeometry(
            new THREE.PlaneGeometry(2, 1.5).rotateX(Math.PI / 2)
          )
        }
      >
        <lineBasicMaterial {...wireframeMaterial} />
      </lineSegments>
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
          label={"Axis on the Plane"}
          selected={axis === "x"}
          onClick={() => setAxis("x")}
        />
        <Chip
          label={"Center"}
          selected={axis === "y"}
          onClick={() => setAxis("y")}
        />
        <Chip
          label={"Edge"}
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
        <Plate />
      </ReactFiberBasic>
    </div>
  );
};

export default Scene;
