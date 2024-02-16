"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { atom, useAtom, useAtomValue } from "jotai";
import { useRef } from "react";
import * as THREE from "three";
import ReactFiberBasic from "~/components/common/ReactFiberBasic";
import {
  moiCasesInputsAtom,
  moiCasesInputsType,
} from "~/components/project/moment_of_inertia/store";
import Chip from "~/components/ui/chip";
import { CaseOfInertia } from "~/services/Moment_of_inertia";
import { caseTypeAtom, solidMaterial, wireframeMaterial } from "../store";
const axisAtom = atom<"x" | "y">("y");
const sliceAtom = atom<boolean>(false);

const SphereComponent = () => {
  const isSliced = useAtomValue(sliceAtom);
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

  const { radius, height, innerRadius }: moiCasesInputsType =
    useAtomValue(moiCasesInputsAtom);

  // Load the texture
  const texture = useTexture("/earth.jpeg");
  const sphereArgs: [
    radius?: number,
    widthSegments?: number,
    heightSegments?: number,
    phiStart?: number,
    phiLength?: number,
    thetaStart?: number,
    thetaLength?: number
  ] = [radius, 64, 32, 0, Math.PI * 2, 0, Math.PI];
  const modifiedSphereArgs: [
    radius?: number,
    widthSegments?: number,
    heightSegments?: number,
    phiStart?: number,
    phiLength?: number,
    thetaStart?: number,
    thetaLength?: number
  ] = [...sphereArgs];
  // modify the sphere args to create a hollow sphere
  modifiedSphereArgs[4] = Math.PI;

  const modifiedSphereArgs2: [
    radius?: number,
    widthSegments?: number,
    heightSegments?: number,
    phiStart?: number,
    phiLength?: number,
    thetaStart?: number,
    thetaLength?: number
  ] = [...modifiedSphereArgs];
  modifiedSphereArgs2[0] = innerRadius;
  return (
    <group ref={ref}>
      {/* solid */}
      <group visible={caseType === CaseOfInertia.Solid}>
        <mesh>
          <sphereGeometry args={sphereArgs} />
          <meshStandardMaterial map={texture} />
        </mesh>
      </group>
      {/* thin or hollow */}
      <group
        visible={
          caseType === CaseOfInertia.Thin ||
          (caseType === CaseOfInertia.Hollow && !isSliced)
        }
      >
        <mesh>
          <sphereGeometry args={sphereArgs} />
          <meshBasicMaterial
            {...solidMaterial}
            wireframe={caseType === CaseOfInertia.Thin}
          />
        </mesh>
        <lineSegments
          geometry={
            new THREE.WireframeGeometry(new THREE.SphereGeometry(...sphereArgs))
          }
        >
          <lineBasicMaterial {...wireframeMaterial} />
        </lineSegments>
      </group>
      <group visible={caseType === CaseOfInertia.Hollow && isSliced}>
        <mesh>
          <sphereGeometry args={modifiedSphereArgs} />
          <meshBasicMaterial {...solidMaterial} />
        </mesh>
        <lineSegments
          geometry={
            new THREE.WireframeGeometry(
              new THREE.SphereGeometry(...modifiedSphereArgs)
            )
          }
        >
          <lineBasicMaterial {...wireframeMaterial} />
        </lineSegments>

        <mesh>
          <sphereGeometry args={modifiedSphereArgs2} />
          <meshBasicMaterial {...solidMaterial} />
        </mesh>
        <lineSegments
          geometry={
            new THREE.WireframeGeometry(
              new THREE.SphereGeometry(...modifiedSphereArgs2)
            )
          }
        >
          <lineBasicMaterial {...wireframeMaterial} />
        </lineSegments>

        <mesh>
          <ringGeometry args={[innerRadius, radius]} />
          <meshPhongMaterial {...solidMaterial} />
        </mesh>
        <lineSegments
          geometry={
            new THREE.WireframeGeometry(
              new THREE.RingGeometry(innerRadius, radius)
            )
          }
        >
          <lineBasicMaterial {...wireframeMaterial} />
        </lineSegments>
      </group>
    </group>
  );
};
const Animation = () => {
  const [sliced, setSliced] = useAtom(sliceAtom);
  const caseType = useAtomValue(caseTypeAtom);
  return (
    <div className="h-[30vh] w-[40vh] md:w-[70vh] md:h-[70vh] md:self-start">
      {/* add slicing control here */}

      {caseType === CaseOfInertia.Hollow && (
        <div className="max-w-16 m-auto mb-3">
          <Chip
            label="slice"
            selected={sliced}
            onClick={() => setSliced(!sliced)}
          />
        </div>
      )}
      <ReactFiberBasic>
        <SphereComponent />
      </ReactFiberBasic>
    </div>
  );
};

export default Animation;
