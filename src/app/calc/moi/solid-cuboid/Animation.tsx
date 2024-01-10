"use client";

import { useFrame } from "@react-three/fiber";
import { atom, useAtom, useAtomValue } from "jotai";
import { useRef } from "react";
import * as THREE from "three";
import ReactFiberBasic from "~/components/common/ReactFiberBasic";
import Chip from "~/components/ui/chip";
import { solidMaterial, wireframeMaterial } from "../store";

const axisAtom = atom<"x" | "y" | "z">("y");
const Cuboid = () => {
  const ref = useRef<THREE.Group<THREE.Object3DEventMap>>();
  const axis = useAtomValue(axisAtom);
  const prevAxis = useRef(axis);
  useFrame(({ clock }) => {
    if (prevAxis.current !== axis) {
      ref.current.rotation.set(0, 0, 0);
      prevAxis.current = axis;
    } else {
      ref.current.rotation[axis] = 2 * clock.getElapsedTime();
    }
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 1.5, 1]} />
        <meshPhongMaterial {...solidMaterial} />
      </mesh>
      <lineSegments
        geometry={new THREE.WireframeGeometry(new THREE.BoxGeometry(2, 1.5, 1))}
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
          label={"Width"}
          selected={axis === "x"}
          onClick={() => setAxis("x")}
        />
        <Chip
          label={"Height"}
          selected={axis === "y"}
          onClick={() => setAxis("y")}
        />
        <Chip
          label={"Depth"}
          selected={axis === "z"}
          onClick={() => setAxis("z")}
        />
      </div>
    </div>
  );
};
const Animation = () => {
  return (
    <div className="h-[30vh] w-[40vh] md:w-[70vh] md:h-[70vh]">
      <AxisControl />
      <ReactFiberBasic>
        <Cuboid />
      </ReactFiberBasic>
    </div>
  );
};

export default Animation;
