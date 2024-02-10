"use client";

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

const data = {
  radius: 3,
  height: 5,
  innerRadius: 1.5,
  radialSegments: 32,
};

const RingData: [
  innerRadius?: number,
  outerRadius?: number,
  thetaSegments?: number,
  phiSegments?: number,
  thetaStart?: number,
  thetaLength?: number
] = [data.innerRadius, data.radius, 32, 1, 0, Math.PI * 2];

const createCylinder = (
  visible: boolean,
  radius: number,
  openEnded: boolean = true
) => {
  const geometryArgs: [
    radiusTop?: number,
    radiusBottom?: number,
    height?: number,
    radialSegments?: number,
    heightSegments?: number,
    openEnded?: boolean,
    thetaStart?: number,
    thetaLength?: number
  ] = [radius, radius, data.height, data.radialSegments, 1, openEnded];

  return (
    <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} visible={visible}>
      <cylinderGeometry args={geometryArgs} />
      <meshPhongMaterial {...solidMaterial} />
      <lineSegments
        geometry={
          new THREE.WireframeGeometry(
            new THREE.CylinderGeometry(...geometryArgs)
          )
        }
      >
        <lineBasicMaterial {...wireframeMaterial} />
      </lineSegments>
    </mesh>
  );
};

const Ring = (props: {
  radius: number;
  innerRadius: number;
  height: number;
}) => {
  const { radius, innerRadius, height } = props;

  const RingData: [
    innerRadius?: number,
    outerRadius?: number,
    thetaSegments?: number,
    phiSegments?: number,
    thetaStart?: number,
    thetaLength?: number
  ] = [innerRadius, radius, 32, 1, 0, Math.PI * 2];

  return (
    <group>
      <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={RingData} />
        <meshPhongMaterial {...solidMaterial} />
      </mesh>

      <lineSegments
        position={[0, height, 0]}
        geometry={
          new THREE.WireframeGeometry(
            new THREE.RingGeometry(...RingData).rotateX(Math.PI / 2)
          )
        }
      >
        <lineBasicMaterial {...wireframeMaterial} />
      </lineSegments>
    </group>
  );
};

// const createRing = (height: number) => (
//   <>
//     <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
//       <ringGeometry args={RingData} />
//       <meshPhongMaterial {...solidMaterial} />
//     </mesh>
//     <lineSegments
//       position={[0, height, 0]}
//       geometry={
//         new THREE.WireframeGeometry(
//           new THREE.RingGeometry(...RingData).rotateX(Math.PI / 2)
//         )
//       }
//     >
//       <lineBasicMaterial {...wireframeMaterial} />
//     </lineSegments>
//   </>
// );

const Cylinder = (props: {
  radius: number;
  height: number;
  openEnded: boolean;
}) => {
  const { radius, height, openEnded } = props;
  const geometryArgs: [
    radiusTop?: number,
    radiusBottom?: number,
    height?: number,
    radialSegments?: number,
    heightSegments?: number,
    openEnded?: boolean,
    thetaStart?: number,
    thetaLength?: number
  ] = [radius, radius, height, 32, 1, openEnded];

  return (
    <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <cylinderGeometry args={geometryArgs} />
      <meshPhongMaterial {...solidMaterial} />
      <lineSegments
        geometry={
          new THREE.WireframeGeometry(
            new THREE.CylinderGeometry(...geometryArgs)
          )
        }
      >
        <lineBasicMaterial {...wireframeMaterial} />
      </lineSegments>
    </mesh>
  );
};
const CylinderComponent = () => {
  const caseType = useAtomValue(caseTypeAtom);
  const ref = useRef<THREE.Group<THREE.Object3DEventMap>>();
  const axis = useAtomValue(axisAtom);
  const inputValues: moiCasesInputsType = useAtomValue(moiCasesInputsAtom);

  const { radius, height, innerRadius } = inputValues;

  const prevAxis = useRef(axis);
  useFrame(({ clock }) => {
    if (prevAxis.current !== axis) {
      ref.current.rotation.set(0, 0, 0);
      prevAxis.current = axis;
    } else {
      ref.current.rotation[axis] = clock.getElapsedTime();
    }
  });
  return (
    <group ref={ref}>
      <group visible={caseType === CaseOfInertia.Solid}>
        <Cylinder radius={radius} height={height} openEnded={false} />
      </group>

      <group visible={caseType === CaseOfInertia.Thin}>
        <Cylinder radius={radius} height={height} openEnded={true} />
      </group>

      {/* {createCylinder(caseType === CaseOfInertia.Thin, data.radius)} */}
      {
        <group visible={caseType === CaseOfInertia.Hollow}>
          <Cylinder radius={radius} height={height} openEnded={true} />
          <Cylinder radius={innerRadius} height={height} openEnded={true} />
          {/* {createCylinder(caseType === CaseOfInertia.Hollow, data.radius)}
          {createCylinder(caseType === CaseOfInertia.Hollow, data.innerRadius)} */}
          <Ring innerRadius={innerRadius} radius={radius} height={height / 2} />
          <Ring
            innerRadius={innerRadius}
            radius={radius}
            height={-height / 2}
          />

          {/* {createRing(data.height / 2)}
          {createRing(-data.height / 2)} */}
        </group>
      }
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
    <div className="h-[30vh] w-[40vh] md:w-[70vh] md:h-[70vh] md:self-start">
      <AxisControl />
      <ReactFiberBasic>
        <CylinderComponent />
      </ReactFiberBasic>
    </div>
  );
};

export default Animation;
