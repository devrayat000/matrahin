"use client";

import {
  BBAnchor,
  ContactShadows,
  Grid,
  Html,
  Loader,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAtomValue } from "jotai";
import { ForwardedRef, Suspense, forwardRef, useRef } from "react";
import * as THREE from "three";
import colors from "./colors";
import {
  BOX_SIZE,
  END_OF_ROAD,
  TIME_STEP,
  massOneAtom,
  massTwoAtom,
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

// const woodColor = new THREE.TextureLoader().load("/wood_color.jpg");
// const woodTexture = new THREE.TextureLoader().load("/wood_roughness.jpg");
// const marbleColor = new THREE.TextureLoader().load("/marble_color.jpg");
// const marbleTexture = new THREE.TextureLoader().load("/marble_roughness.jpg");

// const colors = [woodColor, marbleColor];
// const roughness = [woodTexture, marbleTexture];
const updateText = (
  vTextParagraph: HTMLParagraphElement,
  vValue: number,
  m: number,
  count: number
) => {
  vTextParagraph.innerHTML = `v<sub>${count}</sub>=${vValue.toFixed(
    2
  )}m/s m<sub>${count}</sub>=${m}kg`;
};

const vec = new THREE.Vector3();
const updateArrows = (
  arrow: THREE.ArrowHelper,
  mesh: THREE.Mesh,
  v: number
) => {
  arrow.setDirection(vec.set(0, 0, v).normalize());
  arrow.position.setZ(mesh.position.z);

  // hide the arrow if the velocity is 0
  arrow.visible = v !== 0;
};

const SingleBlock = forwardRef(
  (
    {
      count,
    }: {
      count: number;
    },
    ref: ForwardedRef<THREE.Mesh>
  ) => {
    return (
      <mesh
        castShadow
        ref={ref}
        position={[0, 0, 10 * (count % 2 === 0 ? -1 : 1)]}
      >
        <boxGeometry args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]} />
        <meshStandardMaterial
          // map={colors[count - 1]}
          // roughnessMap={roughness[count - 1]}
          // metalness={0.5}
          // roughness={0.8}
          color={colors[count - 1]}
        />

        <BBAnchor anchor={[-1, 0.5, -1]}>
          <Html
            transform
            occlude
            position={[-0.01, 0, 0]}
            rotation-y={-Math.PI / 2}
            style={{
              letterSpacing: "0.1em",
              fontSize: "2em",
              fontFamily: "consolas",
              userSelect: "none",
            }}
            className="text-white absolute rounded-md bg-black p-1 px-2"
          >
            M<sub>{count}</sub>
          </Html>
        </BBAnchor>
      </mesh>
    );
  }
);
const Objects = () => {
  const m1 = useAtomValue(massOneAtom);
  const m2 = useAtomValue(massTwoAtom);

  const meshRef1: React.MutableRefObject<THREE.Mesh | null> = useRef(null);
  const meshRef2: React.MutableRefObject<THREE.Mesh | null> = useRef(null);
  const v1: React.MutableRefObject<number> = useRef(-5 * TIME_STEP);
  const v2: React.MutableRefObject<number> = useRef(1 * TIME_STEP);

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

  useFrame(() => {
    const mesh1 = meshRef1.current as THREE.Mesh;
    const mesh2 = meshRef2.current as THREE.Mesh;
    if (!mesh1 || !mesh2) return;
    if (checkCollision(mesh1, mesh2)) {
      // calculate the velocity after collision
      const { v1f, v2f } = calculateVelocityAfterCollision(
        m1,
        v1.current,
        m2,
        v2.current
      );

      // update the velocity
      v1.current = v1f;
      v2.current = v2f;

      // update the text
      updateText(v1TextRef.current, v1.current / TIME_STEP, m1, 1);
      updateText(v2TextRef.current, v2.current / TIME_STEP, m2, 2);
    }

    // moves along x axis
    mesh1.position.z += v1.current;
    mesh2.position.z += v2.current;

    // if it reaches the end of the road, reverse the direction
    if (mesh1.position.z > END_OF_ROAD || mesh1.position.z < -END_OF_ROAD) {
      v1.current = -v1.current;
      updateText(v1TextRef.current, v1.current / TIME_STEP, m1, 1);
    }

    if (mesh2.position.z > END_OF_ROAD || mesh2.position.z < -END_OF_ROAD) {
      v2.current = -v2.current;
      updateText(v2TextRef.current, v2.current / TIME_STEP, m2, 2);
    }
    // update the arrow direction and position
    updateArrows(arrowRef1.current as THREE.ArrowHelper, mesh1, v1.current);
    updateArrows(arrowRef2.current as THREE.ArrowHelper, mesh2, v2.current);
  });

  return (
    <group scale={[1, 1, 1]}>
      <SingleBlock ref={meshRef1} count={1} />
      <SingleBlock ref={meshRef2} count={2} />
      <Html
        fullscreen
        style={{
          letterSpacing: "0.1em",
          fontFamily: "consolas",
          userSelect: "none",
        }}
        prepend
        className="  p-1 px-2  w-fit"
      >
        <div className="flex flex-col justify-center bg-stone-200 w-fit  opacity-100">
          <p ref={v1TextRef}>v={v1.current.toFixed(1)} m/s</p>
          <p ref={v2TextRef}>v={v2.current.toFixed(1)} m/s</p>
        </div>
      </Html>

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
    <div className="m-2 w-5/6 h-[40svh] md:h-[80svh]">
      <Suspense fallback={<Loader />}>
        <Canvas shadows>
          <color attach="background" args={["#303035"]} />
          {/* <Environment
            blur={1}
            ground
            frames={Infinity}
            resolution={256}
            preset="sunset"
          /> */}
          <pointLight position={[0, 10, 0]} intensity={0.7} />
          <directionalLight position={[-5, 10, 0]} intensity={1} castShadow />
          <directionalLight position={[0, 5, 5]} intensity={1} castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={1} castShadow />
          <Grid
            receiveShadow
            infiniteGrid
            cellSize={5}
            sectionSize={10}
            cellColor={"#6f6f6f"}
            sectionColor={"#aaa"}
            position-y={-BOX_SIZE / 2}
            cellThickness={1}
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
          <OrbitControls makeDefault />
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
