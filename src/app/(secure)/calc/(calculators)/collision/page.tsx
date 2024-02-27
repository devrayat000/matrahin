"use client";

import {
  BBAnchor,
  ContactShadows,
  Environment,
  Html,
  Loader,
  OrbitControls,
  PerspectiveCamera,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAtomValue } from "jotai";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import {
  BOX_SIZE,
  END_OF_ROAD,
  TIME_STEP,
  massOneAtom,
  massTwoAtom,
  valuesShowingAtom,
} from "./store";

const calculateVelocityAfterCollision = (
  m1: number,
  v1: number,
  m2: number,
  v2: number
): { v1f: number; v2f: number } => {
  const v1f = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
  const v2f = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
  return { v1f, v2f };
};

const Objects = () => {
  const valuesShowing = useAtomValue(valuesShowingAtom);
  const m1 = useAtomValue(massOneAtom);
  const m2 = useAtomValue(massTwoAtom);
  const bobColor1 = useTexture("/wood_color.jpg");
  const bobRoughness1 = useTexture("/wood_roughness.jpg");
  const bobColor2 = useTexture("/marble_color.jpg");
  const bobRoughness2 = useTexture("/marble_roughness.jpg");
  const vec = new THREE.Vector3();

  const boxRef1: React.MutableRefObject<THREE.BoxGeometry | null> =
    useRef(null);
  const boxRef2: React.MutableRefObject<THREE.BoxGeometry | null> =
    useRef(null);
  const meshRef1: React.MutableRefObject<THREE.Mesh | null> = useRef(null);
  const meshRef2: React.MutableRefObject<THREE.Mesh | null> = useRef(null);
  const v1: React.MutableRefObject<number> = useRef(-10 * TIME_STEP);
  const v2: React.MutableRefObject<number> = useRef(0 * TIME_STEP);

  const v1TextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);
  const v2TextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);

  const arrowRef1: React.MutableRefObject<THREE.ArrowHelper | null> =
    useRef(null);
  const arrowRef2: React.MutableRefObject<THREE.ArrowHelper | null> =
    useRef(null);
  const BoundingBox = new THREE.Box3();

  const checkCollision = (
    object1: THREE.Object3D<THREE.Object3DEventMap>,
    object2: THREE.Object3D<THREE.Object3DEventMap>
  ) => {
    const box1 = BoundingBox.clone();
    const box2 = BoundingBox.clone();
    box1.setFromObject(object1);
    box2.setFromObject(object2);
    return box1.intersectsBox(box2);
  };

  const updateArrows = () => {
    if (arrowRef1.current) {
      arrowRef1.current.setDirection(vec.set(0, 0, v1.current).normalize());
      arrowRef1.current.position.setZ(meshRef1.current.position.z);
    }
    if (arrowRef2.current) {
      arrowRef2.current.setDirection(vec.set(0, 0, v2.current).normalize());
      arrowRef2.current.position.setZ(meshRef2.current.position.z);
    }

    // hide the arrow if the velocity is 0
    arrowRef1.current.visible = v1.current !== 0;
    arrowRef2.current.visible = v2.current !== 0;
  };

  const updateText = () => {
    if (v1TextRef.current) {
      v1TextRef.current.textContent = `v1=${(v1.current / TIME_STEP).toFixed(
        2
      )}m/s
      m1=${m1}kg`;
    }
    if (v2TextRef.current) {
      v2TextRef.current.textContent = `v2=${(v2.current / TIME_STEP).toFixed(
        2
      )}m/s
      m2=${m2}kg`;
    }
  };

  useFrame(() => {
    if (boxRef1.current && boxRef2.current) {
      if (checkCollision(meshRef1.current, meshRef2.current)) {
        const { v1f, v2f } = calculateVelocityAfterCollision(
          m1,
          v1.current,
          m2,
          v2.current
        );
        v1.current = v1f;
        v2.current = v2f;
        updateText();
      }

      // moves along x axis
      meshRef1.current.position.z += v1.current;
      meshRef2.current.position.z += v2.current;

      // if it reaches the end of the road, reverse the direction
      if (
        meshRef1.current.position.z > END_OF_ROAD ||
        meshRef1.current.position.z < -END_OF_ROAD
      ) {
        v1.current = -v1.current;
      }
      if (
        meshRef2.current.position.z > END_OF_ROAD ||
        meshRef2.current.position.z < -END_OF_ROAD
      ) {
        v2.current = -v2.current;
      }

      // update the arrow direction and position
      updateArrows();
    }
  });

  return (
    <group scale={[2, 2, 1]}>
      <mesh ref={meshRef1} position={[0, 0, 10]}>
        <boxGeometry ref={boxRef1} args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]} />
        <meshStandardMaterial
          map={bobColor1}
          roughnessMap={bobRoughness1}
          metalness={0.5}
          roughness={0.8}
        />

        <BBAnchor anchor={[0, -1, 0]}>
          <Html
            center
            style={{
              display: valuesShowing ? "block" : "none",
            }}
            className="text-white absolute rounded-md bg-black p-1 px-2"
          >
            <p ref={v1TextRef}>v={v1.current.toFixed(1)}m/s</p>
          </Html>
        </BBAnchor>
      </mesh>

      <mesh ref={meshRef2} position={[0, 0, -10]}>
        <boxGeometry ref={boxRef2} args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]} />
        <meshStandardMaterial
          map={bobColor2}
          roughnessMap={bobRoughness2}
          metalness={0.5}
          roughness={0.8}
        />
        <BBAnchor anchor={[0, -1, 0]}>
          <Html
            center
            style={{
              display: valuesShowing ? "block" : "none",
            }}
            className="text-white absolute rounded-md bg-black p-1 px-2"
          >
            <p ref={v2TextRef}>v={v2.current.toFixed(1)}m/s</p>
          </Html>
        </BBAnchor>
      </mesh>

      {/* draw arrow from box to the direction of velocity */}
      <arrowHelper
        ref={arrowRef1}
        args={[
          vec.set(0, 0, v1.current).normalize(),
          vec.clone().set(0, BOX_SIZE / 2, 0),
          4,
        ]}
      />
      <arrowHelper
        ref={arrowRef2}
        args={[
          vec.set(0, 0, v2.current).normalize(),
          vec.clone().set(0, BOX_SIZE / 2, 0),
          4,
        ]}
      />
    </group>
  );
};

const Simulation = () => {
  return (
    <div className="m-2 w-5/6 h-4/6 md:h-[80svh]">
      <Suspense fallback={<Loader />}>
        <Canvas>
          <Environment
            blur={0}
            ground={{
              height: 15,
              radius: 60,
            }}
            resolution={1024}
            frames={1024}
            preset="sunset"
          />
          <PerspectiveCamera makeDefault position={[-20, 10, 0]} fov={45} />
          <ContactShadows
            blur={2}
            far={10}
            opacity={1}
            position={[0, 0, 0]}
            resolution={1024}
            scale={100}
          />
          <OrbitControls />
          <Objects />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default function CollisionPage() {
  return (
    <div className="grid md:grid-cols-10 grid-cols-1  my-2 justify-center items-center md:items-start">
      <center className="md:col-span-9   ">
        <Simulation />
      </center>
      <center>
        <p className="text-2xl font-bold">Collision</p>
      </center>
    </div>
  );
}
