"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { atom, useAtom, useAtomValue } from "jotai";
import { useRef } from "react";
import * as THREE from "three";
import Chip from "~/components/ui/chip";
import { CaseOfInertia } from "~/services/Moment_of_inertia";
import { caseTypeAtom } from "../store";

const axisAtom = atom<"x" | "y">("y");
const Cylinder = () => {
  const ref = useRef<THREE.Group<THREE.Object3DEventMap>>();
  const axis = useAtomValue(axisAtom);
  const prevAxis = useRef(axis);
  const caseType = useAtomValue(caseTypeAtom);
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

  return (
    <>
      <group ref={ref}>
        {/* solid */}
        <group visible={caseType === CaseOfInertia.Solid}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry
              args={[
                data.radius,
                data.radius,
                data.height,
                data.radialSegments,
              ]}
            />
            <meshPhongMaterial
              color={new THREE.Color(0x069fec)}
              emissive={new THREE.Color(0x072534)}
              side={THREE.DoubleSide}
              flatShading={true}
            />
            <lineSegments
              geometry={
                new THREE.WireframeGeometry(
                  new THREE.CylinderGeometry(
                    data.radius,
                    data.radius,
                    data.height,
                    data.radialSegments
                  )
                )
              }
            >
              <lineBasicMaterial
                color={new THREE.Color(0xffffff)}
                transparent={true}
                opacity={0.6}
              />
            </lineSegments>
          </mesh>
        </group>
        {/* thin */}
        <group visible={caseType === CaseOfInertia.Thin}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry
              args={[
                data.radius,
                data.radius,
                data.height,
                data.radialSegments,
                1,
                true,
              ]}
            />
            <meshPhongMaterial
              color={new THREE.Color(0x069fec)}
              emissive={new THREE.Color(0x072534)}
              side={THREE.DoubleSide}
              flatShading={true}
            />
            <lineSegments
              geometry={
                new THREE.WireframeGeometry(
                  new THREE.CylinderGeometry(
                    data.radius,
                    data.radius,
                    data.height,
                    data.radialSegments,
                    1,
                    true
                  )
                )
              }
            >
              <lineBasicMaterial
                color={new THREE.Color(0xffffff)}
                transparent={true}
                opacity={0.6}
              />
            </lineSegments>
          </mesh>
        </group>
        {/* hollow */}
        <group visible={caseType === CaseOfInertia.Hollow}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry
              args={[
                data.innerRadius,
                data.innerRadius,
                data.height,
                data.radialSegments,
                1,
                true,
              ]}
            />
            <meshPhongMaterial
              color={new THREE.Color(0x069fec)}
              emissive={new THREE.Color(0x072534)}
              side={THREE.DoubleSide}
              flatShading={true}
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry
              args={[
                data.radius,
                data.radius,
                data.height,
                data.radialSegments,
                1,
                true,
              ]}
            />
            <meshPhongMaterial
              color={new THREE.Color(0x069fec)}
              emissive={new THREE.Color(0x072534)}
              side={THREE.DoubleSide}
              flatShading={true}
            />
          </mesh>
          <lineSegments
            geometry={
              new THREE.WireframeGeometry(
                new THREE.CylinderGeometry(
                  data.radius,
                  data.radius,
                  data.height,
                  data.radialSegments,
                  1,
                  true
                )
              )
            }
          >
            <lineBasicMaterial
              color={new THREE.Color(0xffffff)}
              transparent={true}
              opacity={0.6}
            />
          </lineSegments>
          <lineSegments
            geometry={
              new THREE.WireframeGeometry(
                new THREE.CylinderGeometry(
                  data.innerRadius,
                  data.innerRadius,
                  data.height,
                  data.radialSegments,
                  1,
                  true
                )
              )
            }
          >
            <lineBasicMaterial
              color={new THREE.Color(0xffffff)}
              transparent={true}
              opacity={0.6}
            />
          </lineSegments>
          <mesh
            position={[0, data.height / 2, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={RingData} />
            <meshPhongMaterial
              color={new THREE.Color(0x069fec)}
              emissive={new THREE.Color(0x072534)}
              side={THREE.DoubleSide}
              flatShading={true}
            />
          </mesh>
          <mesh
            position={[0, -data.height / 2, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={RingData} />
            <meshPhongMaterial
              color={new THREE.Color(0x069fec)}
              emissive={new THREE.Color(0x072534)}
              side={THREE.DoubleSide}
              flatShading={true}
            />
          </mesh>
          <lineSegments
            position={[0, data.height / 2, 0]}
            geometry={
              new THREE.WireframeGeometry(
                new THREE.RingGeometry(...RingData).rotateX(Math.PI / 2)
              )
            }
          >
            <lineBasicMaterial
              color={new THREE.Color(0xffffff)}
              transparent={true}
              opacity={0.6}
            />
          </lineSegments>
          <lineSegments
            position={[0, -data.height / 2, 0]}
            geometry={
              new THREE.WireframeGeometry(
                new THREE.RingGeometry(...RingData).rotateX(Math.PI / 2)
              )
            }
          >
            <lineBasicMaterial
              color={new THREE.Color(0xffffff)}
              transparent={true}
              opacity={0.6}
            />
          </lineSegments>
        </group>
      </group>
    </>
  );
};

const Animation = () => {
  const [axis, setAxis] = useAtom(axisAtom);
  return (
    <div className="h-[30vh] w-[40vh] md:w-[70vh] md:h-[70vh]">
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
      <Canvas>
        <color attach="background" args={["#444444"]} />
        <PerspectiveCamera
          makeDefault
          position={[30, 10, 30]}
          fov={10}
          near={1}
          far={1000}
        />
        <OrbitControls />
        <Cylinder />
        <directionalLight position={[0, 10, 0]} intensity={1} />
        <directionalLight position={[1, 0, 0]} intensity={0.5} />
        <ambientLight position={[5, 5, 5]} intensity={0.25} />
        <axesHelper args={[50]} />
      </Canvas>
    </div>
  );
};

export default Animation;
