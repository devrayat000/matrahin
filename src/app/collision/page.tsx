"use client";

import {
  ContactShadows,
  Grid,
  Html,
  Loader,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAtomValue, useSetAtom } from "jotai";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { XTicks } from "~/components/common/CanvasTHREE/xTicks";
import CollisionInputs from "~/components/project/collisions/CollisionInputs";
import FullScreenButton from "~/components/project/collisions/FullScreenButton";
import Results from "~/components/project/collisions/Results";
import SingleBlock from "~/components/project/collisions/SingleBlock";
import WallsAtEndOfRoad from "~/components/project/collisions/WallsAtEndOfRoad";
import {
  BOX_SIZE,
  DEFAULT_INPUTS,
  END_OF_ROAD,
  TIME_STEP,
  collisionInputsAtom,
  fullScreenOnAtom,
} from "~/components/project/collisions/store";
import { addKeyControlToGoFullScreen } from "~/lib/utils/3DCanvasUtils";

import {
  calculateVelocityAfterCollision,
  checkCollision,
  updateArrows,
  updateText,
  updateTotalKE,
  updateTotalPE,
  vec,
} from "./utils";

/**
 * Represents the main contents of the collision page.
 * @param divRef A mutable ref object for the HTMLDivElement.
 * @returns A React component representing the main contents of the collision page.
 */

const MainContents = ({
  divRef,
}: {
  divRef: React.MutableRefObject<HTMLDivElement | null>;
}) => {
  const [playing, setPlaying] = useState(true);

  const v1: React.MutableRefObject<number> = useRef(
    DEFAULT_INPUTS.v1 * TIME_STEP
  );
  const v2: React.MutableRefObject<number> = useRef(
    DEFAULT_INPUTS.v2 * TIME_STEP
  );

  const {
    massOne: m1,
    massTwo: m2,
    velocityOne,
    velocityTwo,
  } = useAtomValue(collisionInputsAtom);

  useEffect(() => {
    v1.current = velocityOne * TIME_STEP;
  }, [velocityOne]);
  useEffect(() => {
    v2.current = velocityTwo * TIME_STEP;
  }, [velocityTwo]);

  const size1 = useMemo(() => 1 + m1 / 10, [m1]);
  const size2 = useMemo(() => 1 + m2 / 10, [m2]);

  const meshRef1: React.MutableRefObject<THREE.Mesh | null> = useRef(null);
  const meshRef2: React.MutableRefObject<THREE.Mesh | null> = useRef(null);
  const arrowRef1: React.MutableRefObject<THREE.ArrowHelper | null> =
    useRef(null);
  const arrowRef2: React.MutableRefObject<THREE.ArrowHelper | null> =
    useRef(null);

  const v1TextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);
  const v2TextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);

  const m1TextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);
  const m2TextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);
  const p1TextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);
  const p2TextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);

  const kE1TextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);
  const kE2TextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);

  const totalKETextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);
  const totalMomentumTextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);

  /**
   * Update the text of the objects, always updates the total KE and momentum
   * @param count 0: update all, 1: update 1, 2: update 2
   */
  const updateAllTexts = (count: number) => {
    if (count == 0 || count == 1) {
      updateText(
        v1.current / TIME_STEP,
        m1,
        m1TextRef.current as HTMLParagraphElement,
        v1TextRef.current as HTMLParagraphElement,
        p1TextRef.current as HTMLParagraphElement,
        kE1TextRef.current as HTMLParagraphElement
      );
    }
    if (count == 0 || count == 2)
      updateText(
        v2.current / TIME_STEP,
        m2,
        m2TextRef.current as HTMLParagraphElement,
        v2TextRef.current as HTMLParagraphElement,
        p2TextRef.current as HTMLParagraphElement,
        kE2TextRef.current as HTMLParagraphElement
      );

    // update the total kinetic energy
    updateTotalKE(
      (0.5 * m1 * v1.current * v1.current) / TIME_STEP / TIME_STEP +
        (0.5 * m2 * v2.current * v2.current) / TIME_STEP / TIME_STEP,
      totalKETextRef.current as HTMLParagraphElement
    );

    // update the total momentum
    updateTotalPE(
      (m1 * v1.current + m2 * v2.current) / TIME_STEP,
      totalMomentumTextRef.current as HTMLParagraphElement
    );
  };

  const checkIfReachedEndOfRoad = (
    mesh: THREE.Mesh,
    v: React.MutableRefObject<number>,
    size: number
  ) => {
    if (
      mesh.position.z + size > END_OF_ROAD ||
      mesh.position.z - size < -END_OF_ROAD
    ) {
      v.current = -v.current;
      updateAllTexts(1);
    }
  };

  useFrame(() => {
    if (!playing) return;
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

      updateAllTexts(0);
    }

    // moves along x axis
    mesh1.position.z += v1.current;
    mesh2.position.z += v2.current;

    // if it reaches the end of the road, reverse the direction
    checkIfReachedEndOfRoad(mesh1, v1, size1);
    checkIfReachedEndOfRoad(mesh2, v2, size2);
    // update the arrow direction and position

    updateArrows(arrowRef1.current as THREE.ArrowHelper, mesh1, v1.current);
    updateArrows(arrowRef2.current as THREE.ArrowHelper, mesh2, v2.current);
  });

  return (
    <group scale={[1, 1, 1]}>
      <SingleBlock ref={meshRef1} size={size1} count={1} />
      <SingleBlock ref={meshRef2} size={size2} count={2} />

      <WallsAtEndOfRoad />

      <Html
        fullscreen
        style={{
          letterSpacing: "0.1em",
          userSelect: "none",
        }}
        prepend
        className="p-1 lg:px-2  w-full"
      >
        <div className="flex items-center justify-center text-white text-3xl my-2">
          Collision
        </div>
        <div className="flex flex-row justify-between items-start w-full gap-2 m-1  ">
          <Results
            refs={[
              [m1TextRef, v1TextRef, p1TextRef, kE1TextRef],
              [m2TextRef, v2TextRef, p2TextRef, kE2TextRef],
            ]}
            totalKETextRef={totalKETextRef}
            totalPETextRef={totalMomentumTextRef}
            updateAllTexts={updateAllTexts}
          />

          <div>
            <CollisionInputs />
          </div>
        </div>
        <FullScreenButton div={divRef.current} />
      </Html>

      {/* draw arrow from box to the direction of velocity */}
      <arrowHelper
        ref={arrowRef1}
        args={[
          vec.set(0, 0, v1.current).normalize(),
          vec.clone().set(0, size1, 0),
          4,
        ]}
      />
      <arrowHelper
        ref={arrowRef2}
        args={[
          vec.set(0, 0, v2.current).normalize(),
          vec.clone().set(0, size2, 0),
          4,
        ]}
      />
    </group>
  );
};

const Lights = () => (
  <>
    <directionalLight position={[-5, 10, 0]} intensity={1} castShadow />
    <directionalLight position={[0, 5, 5]} intensity={1} castShadow />
    <directionalLight position={[-5, 5, -5]} intensity={1} castShadow />
    <pointLight position={[0, 10, 0]} intensity={0.1} castShadow />
  </>
);

const Simulation = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const setFullScreenOn = useSetAtom(fullScreenOnAtom);

  useEffect(() => {
    addKeyControlToGoFullScreen(divRef.current, setFullScreenOn);

    return () => {
      window.removeEventListener("keypress", () => {});
      setFullScreenOn(false);
    };
  }, []);
  return (
    <div ref={divRef} className="my-2 w-5/6 lg:w-[95%]  h-[70svh] lg:h-[80svh]">
      <Suspense fallback={<Loader />}>
        <Canvas shadows style={{ contain: "layout" }}>
          <color attach="background" args={["#303035"]} />

          <Lights />
          <Grid
            receiveShadow
            infiniteGrid
            cellSize={5}
            sectionSize={10}
            cellColor={"#6f6f6f"}
            sectionColor={"#aaa"}
            cellThickness={1}
            fadeDistance={150}
          />

          <PerspectiveCamera makeDefault position={[-30, 10, 0]} fov={30} />
          {/* <OrthographicCamera makeDefault position={[-10, 5, 0]} /> */}
          <ContactShadows
            blur={2}
            far={10}
            opacity={1}
            position={[0, 0, 0]}
            resolution={1024}
            scale={100}
          />

          <XTicks length={50} />

          <OrbitControls
            // enableRotate={false}
            enableDamping={false}
            enablePan={false}
            makeDefault
          />
          <MainContents divRef={divRef} />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default function CollisionPage() {
  return (
    <div className="grid lg:grid-cols-10 grid-cols-1  my-2 justify-center items-center lg:items-start">
      <center className="lg:col-span-10   ">
        <Simulation />
      </center>
    </div>
  );
}
