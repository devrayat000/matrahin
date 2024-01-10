"use client";

import { useFrame } from "@react-three/fiber";
import { atom, useAtom, useAtomValue } from "jotai";
import { useRef } from "react";
import * as THREE from "three";
import ReactFiberBasic from "~/components/common/ReactFiberBasic";
import Chip from "~/components/ui/chip";
import { CaseOfInertia } from "~/services/Moment_of_inertia";
import { caseTypeAtom, solidMaterial, wireframeMaterial } from "../store";
const axisAtom = atom<"x" | "y">("y");

const createRing = (visible: boolean, innerRadius: number, radius: number) => (
  <group visible={visible}>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[innerRadius, radius]} />
      <meshPhongMaterial {...solidMaterial} />
    </mesh>

    <lineSegments
      position={[0, 0, 0]}
      geometry={
        new THREE.WireframeGeometry(
          new THREE.RingGeometry(innerRadius, radius).rotateX(Math.PI / 2)
        )
      }
    >
      <lineBasicMaterial {...wireframeMaterial} />
    </lineSegments>
  </group>
);

const DiskComponent = () => {
  const caseType = useAtomValue(caseTypeAtom);
  const ref = useRef<THREE.Group<THREE.Object3DEventMap>>();
  const axis = useAtomValue(axisAtom);
  const prevAxis = useRef(axis);
  useFrame(({ clock }) => {
    if (prevAxis.current !== axis) {
      ref.current.rotation.set(0, 0, 0);
      prevAxis.current = axis;
    } else {
      ref.current.rotation[axis] = clock.getElapsedTime();
    }
  });
  const data = {
    radius: 3,
    innerRadius: 1.5,
    radialSegments: 32,
  };
  return (
    <group ref={ref}>
      {createRing(caseType === CaseOfInertia.Solid, 0, data.radius)}
      {createRing(
        caseType === CaseOfInertia.Hollow,
        data.innerRadius,
        data.radius
      )}
      {createRing(caseType === CaseOfInertia.Thin, data.radius, data.radius)}
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
          label={"Diameter"}
          selected={axis === "x"}
          onClick={() => setAxis("x")}
        />
        <Chip
          label={"Center"}
          selected={axis === "y"}
          onClick={() => setAxis("y")}
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
        <DiskComponent />
      </ReactFiberBasic>
    </div>
  );
};

export default Animation;
