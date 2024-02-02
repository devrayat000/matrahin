"use client";

import {
  OrbitControls,
  PerspectiveCamera,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import Pendulum from "./Pendulum";

/**
 * takes an object and rotates it about a point
 * @param obj the object to rotate
 * @param point the point to rotate about
 * @param axis the axis to rotate about
 * @param theta the angle to rotate about
 * @param pointIsWorld
 */
function rotateAboutPoint(
  obj: THREE.Object3D,
  point: THREE.Vector3,
  axis: THREE.Vector3,
  theta: number,
  pointIsWorld: boolean = false
) {
  pointIsWorld = pointIsWorld === undefined ? false : pointIsWorld;

  if (pointIsWorld) {
    obj.parent.localToWorld(obj.position); // compensate for world coordinate
  }

  axis = axis.normalize(); // rotation axis must be normalized
  obj.position.sub(point); // remove the offset
  obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
  obj.position.add(point); // re-add the offset

  if (pointIsWorld) {
    obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
  }

  obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}

function Animation({ pendulum }: { pendulum: Pendulum }) {
  const length = useMemo(() => pendulum.length, [pendulum.length]);
  const angle = useMemo(() => pendulum.angle, [pendulum.angle]);
  // const initialPositionBob = useMemo(
  //   () => ({
  //     x: Math.abs(length * Math.sin(angle)),
  //     y: Math.abs(length * Math.cos(angle)) + 1.6,
  //   }),
  //   [pendulum.length, pendulum.angle]
  // );
  // const initialPositionString = useMemo(
  //   () => ({
  //     x: Math.abs((length / 2) * Math.sin(angle)),
  //     y: Math.abs((length / 2) * Math.cos(angle)) + length / 2 + 1.6,
  //   }),
  //   [pendulum.length, pendulum.angle]
  // );
  const pendulumRef = useRef<THREE.Group>(null);
  const stringRef = useRef<THREE.Mesh>(null);
  const bobRef = useRef<THREE.Mesh>(null);
  // useEffect(() => {
  //   // if (bobRef.current) {
  //   //   // pivot point of swing
  //   //   bobRef.current.position.y = length + 1.6;
  //   //   // bobRef.current.translateY(length);
  //   //   // bobRef.current.geometry.translate(0, -length - 0.5, 0);
  //   //   bobRef.current.geometry.applyMatrix4(
  //   //     new THREE.Matrix4().makeTranslation(0, -length - 0.5, 0)
  //   //   );
  //   // }
  //   // if (bobRef.current) {
  //   //   bobRef.current.position.x = initialPositionBob.x;
  //   //   bobRef.current.position.y = initialPositionBob.y;
  //   // }
  //   // if (stringRef.current) {
  //   //   stringRef.current.position.x = initialPositionString.x;
  //   //   stringRef.current.position.y = initialPositionString.y;
  //   //   // stringRef.current.rotateZ(angle);
  //   // }
  //   // if (pendulumRef.current) {
  //   //   pendulumRef.current.rotation.z = angle;
  //   //   pendulumRef.current.position.y = length + 1.6;
  //   // }
  //   // if (stringRef.current) {
  //   //   // pivot point of swing
  //   //   stringRef.current.position.y = length + 1.6;
  //   //   // stringRef.current.translateY(length);
  //   //   stringRef.current.geometry.translate(0, -length / 2, 0);
  //   // }
  //   // if (bobRef.current) {
  //   //   bobRef.current.position.x = 0;
  //   //   bobRef.current.position.z = 0;
  //   //   bobRef.current.position.y = length + 1.6;
  //   //   // bobRef.current.geometry.translate(0, length + 1.6, 0);
  //   //   const currentCenterOfBobGeometryY: number | null | undefined =
  //   //     bobRef.current.geometry?.boundingSphere?.center.y;
  //   //   console.log(currentCenterOfBobGeometryY);
  //   //   if (
  //   //     currentCenterOfBobGeometryY !== null &&
  //   //     currentCenterOfBobGeometryY !== undefined
  //   //   ) {
  //   //     bobRef.current.geometry.translate(
  //   //       0,
  //   //       -currentCenterOfBobGeometryY + length + 1.6,
  //   //       0
  //   //     );
  //   //   }
  //   //   bobRef.current.geometry.translate(0, -(length + 0.5), 0);
  //   // }
  // }, [pendulum.length, pendulum.angle]);

  const bobColor = useTexture("/marble_color.jpg");
  const bobRoughness = useTexture("/marble_roughness.jpg");
  useFrame(() => {
    if (pendulumRef.current) {
      const theta = pendulum.step(0.01);
      pendulumRef.current.rotation.z = theta;
    }
  });
  return (
    <group ref={pendulumRef} position={[0, 1.6 + length, 0]}>
      {/* string */}
      <mesh castShadow={true} position={[0, -length / 2, 0]} ref={stringRef}>
        <cylinderGeometry args={[0.008, 0.008, length]} />
        <meshStandardMaterial color={0x222222} roughness={1} metalness={0.2} />
      </mesh>

      {/* bob */}
      <mesh ref={bobRef} position={[0, -length - 0.25, 0]} castShadow={true}>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial
          map={bobColor}
          roughness={1}
          roughnessMap={bobRoughness}
          metalness={0.6}
        />
      </mesh>

      {/* to see positioning */}
      {/* <gridHelper
        args={[100, 100, 0x000000, 0x000000]}
        rotation={[Math.PI / 2, 0, 0]}
      /> */}
    </group>
  );
}

const Structure = ({ length }: { length: number }) => {
  const wood_color = useTexture("/wood_color.jpg");
  wood_color.wrapS = THREE.RepeatWrapping;
  wood_color.wrapT = THREE.RepeatWrapping;
  wood_color.repeat.set(100, 10);
  const wood_roughness = useTexture("/wood_roughness.jpg");
  wood_roughness.wrapS = THREE.RepeatWrapping;
  wood_roughness.wrapT = THREE.RepeatWrapping;
  wood_roughness.repeat.set(100, 10);
  const wood_normal = useTexture("/wood_normal.jpg");
  wood_normal.wrapS = THREE.RepeatWrapping;
  wood_normal.wrapT = THREE.RepeatWrapping;
  wood_normal.repeat.set(100, 10);
  return (
    <group>
      <group>
        <mesh
          castShadow={true}
          position={[-length - 2, length / 2 + 2, 0]}
          rotation={[0, Math.PI / 4, 0]}
        >
          <cylinderGeometry args={[0.3, 0.3, length + 4]} />
          <meshStandardMaterial
            map={wood_color}
            roughnessMap={wood_roughness}
          />
        </mesh>
        <mesh
          castShadow={true}
          position={[length + 2, length / 2 + 2, 0]}
          rotation={[0, Math.PI / 4, 0]}
        >
          <cylinderGeometry args={[0.3, 0.3, length + 4]} />
          <meshStandardMaterial
            map={wood_color}
            roughnessMap={wood_roughness}
          />
        </mesh>

        <mesh
          castShadow={true}
          position={[0, length + 2, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.1, 0.1, 2 * length + 4]} />
          <meshStandardMaterial
            map={wood_color}
            roughnessMap={wood_roughness}
            normalMap={wood_normal}
          />
        </mesh>
      </group>
      <group>
        <mesh castShadow={true} position={[0, length + 2 - 0.2, 0]}>
          <ringGeometry args={[0.2, 0.3]} />
          <meshStandardMaterial side={THREE.DoubleSide} map={wood_color} />
        </mesh>
        <mesh
          castShadow={true}
          receiveShadow={true}
          position={[0, length + 2 - 0.4, 0]}
        >
          <circleGeometry args={[0.1]} />
          <meshStandardMaterial side={THREE.DoubleSide} map={wood_color} />
        </mesh>
      </group>
    </group>
  );
};

const Ground = () => {
  const textureColorPath = useTexture("/paving_color.jpg");
  textureColorPath.wrapS = THREE.RepeatWrapping;
  textureColorPath.wrapT = THREE.RepeatWrapping;
  textureColorPath.repeat.set(100, 10);
  const textureRoughnessPath = useTexture("/paving_roughness.jpg");
  textureRoughnessPath.wrapS = THREE.RepeatWrapping;
  textureRoughnessPath.wrapT = THREE.RepeatWrapping;
  textureRoughnessPath.repeat.set(100, 10);

  const textureNormalPath = useTexture("/paving_normal.jpg");
  textureNormalPath.wrapS = THREE.RepeatWrapping;
  textureNormalPath.wrapT = THREE.RepeatWrapping;
  textureNormalPath.repeat.set(100, 10);

  const textureAmbientOcclusionPath = useTexture(
    "/paving_ambient_occlusion.jpg"
  );
  textureAmbientOcclusionPath.wrapS = THREE.RepeatWrapping;
  textureAmbientOcclusionPath.wrapT = THREE.RepeatWrapping;
  textureAmbientOcclusionPath.repeat.set(100, 10);

  return (
    <mesh
      receiveShadow={true}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
    >
      <planeGeometry args={[1000, 100]} />
      <meshStandardMaterial
        map={textureColorPath}
        normalMap={textureNormalPath}
        normalScale={new THREE.Vector2(2, 2)}
        roughness={1}
        roughnessMap={textureRoughnessPath}
        aoMap={textureAmbientOcclusionPath}
        aoMapIntensity={1}
      />
    </mesh>
  );
};
export default function PendulumAnimation() {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);

  const [length, setLength] = useState(4);
  const [angle, setAngle] = useState(60);

  const p: Pendulum = useMemo(
    () => new Pendulum((angle * Math.PI) / 180, 0, length, 1.5, 9.8, 0, 0),
    [length, angle]
  );

  return (
    <div className="flex-row">
      <input
        type="number"
        defaultValue={length}
        onChange={(e) => setLength(Number(e.target.value))}
      />
      <input
        type="number"
        defaultValue={angle}
        onChange={(e) => setAngle(Number(e.target.value))}
      />
      <div className="w-[100vh] h-[100vh] ">
        <Canvas shadows="soft">
          <color attach="background" args={[0x87ceeb]} />
          <fog attach="fog" args={[0x87ceeb, 30, 180]} />
          <Animation pendulum={p} />
          <Ground />
          <Structure length={length} />
          <PerspectiveCamera
            fov={75}
            aspect={1.5}
            near={1}
            far={1000}
            position={[0, 3, length + 10]}
            makeDefault={true}
          />

          <ambientLight args={[0xdddddd, 0.4]} />
          <directionalLight
            ref={directionalLightRef}
            args={[0xffffff, 3]}
            position={[0, length + 5, length + 5]}
            castShadow={true}
            shadow-camera-top={length + 6}
            shadow-camera-left={-length - 6}
            shadow-camera-right={length + 6}
            shadow-camera-bottom={-length - 6}
          />

          <OrbitControls minDistance={1} maxDistance={500} />
        </Canvas>
      </div>
    </div>
  );
}
