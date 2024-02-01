"use client";

import {
  OrbitControls,
  PerspectiveCamera,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import Pendulum from "./Pendulum";

function Animation({
  pendulum,
  angle,
  length,
}: {
  pendulum: Pendulum;
  angle: number;
  length: number;
}) {
  const pendulumRef = useRef<THREE.Group>(null);
  const stringRef = useRef<THREE.Mesh>(null);
  const bobRef = useRef<THREE.Mesh>(null);
  useEffect(() => {
    if (stringRef.current) {
      // stringRef.current.translateY(length);
      stringRef.current.geometry.translate(0, -length / 2, 0);
    }
    if (bobRef.current) {
      bobRef.current.translateY(length);
      bobRef.current.geometry.translate(0, -length - 0.5, 0);
    }
  }, []);
  function update(dt: number) {
    const theta = pendulum.step(0.01);
    console.log(dt * 1000);
    stringRef.current.rotation.z = theta;
    bobRef.current.rotation.z = theta;
  }

  const bobColor = useTexture("/marble_color.jpg");
  const bobRoughness = useTexture("/marble_roughness.jpg");
  useFrame(({ clock }) => {
    if (pendulumRef.current) {
      update(clock.getDelta());
    }
  });
  return (
    <group ref={pendulumRef}>
      {/* string */}
      <mesh castShadow={true} ref={stringRef} position={[0, length + 1.6, 0]}>
        <cylinderGeometry args={[0.008, 0.008, length]} />
        <meshStandardMaterial color={0x222222} roughness={0} metalness={0.2} />
      </mesh>

      {/* bob */}
      <mesh ref={bobRef} position={[0, 1.6, 0]} castShadow={true}>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial
          map={bobColor}
          roughness={1}
          roughnessMap={bobRoughness}
          metalness={0.2}
        />
      </mesh>
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

  const angle = 60;
  const length = 2;

  const p: Pendulum = new Pendulum(
    (angle * Math.PI) / 180,
    0,
    length,
    1.5,
    9.8,
    0,
    0
  );

  return (
    <div className="w-[100vh] h-[100vh]">
      <Canvas shadows="soft">
        <color attach="background" args={[0x87ceeb]} />
        <fog attach="fog" args={[0x87ceeb, 30, 180]} />
        <Animation pendulum={p} angle={angle} length={length} />
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
        {/* <cameraHelper args={[directionalLightRef.current.shadow.camera]} /> */}

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
  );
}
