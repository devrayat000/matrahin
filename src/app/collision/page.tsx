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
import { useSetAtom } from "jotai";
import { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { XTicks } from "~/components/common/CanvasTHREE/xTicks";
import CollisionInputs from "~/components/project/collisions/CollisionInputs";
import FullScreenButton from "~/components/project/collisions/FullScreenButton";
import Results from "~/components/project/collisions/Results";
import SingleBlock from "~/components/project/collisions/SingleBlock";
import {
  DEFAULT_INPUTS,
  END_OF_ROAD,
  fullScreenOnAtom,
} from "~/components/project/collisions/store";
import { addKeyControlToGoFullScreen } from "~/lib/utils/3DCanvasUtils";

import { Pause, Play, RotateCcw } from "lucide-react";
import { Line2, LineSegments2 } from "three-stdlib";
import { TIME_STEP } from "~/components/common/CanvasTHREE/store";
import {
  boxGeometry,
  calculateVelocityAfterCollision,
  checkCollision,
  checkIfReachedEndOfRoad,
  getDefaultPositionOfBox,
  getSizeOfBox,
  getTotalKE,
  getTotalMomentum,
  matrix4,
  updateArrows,
  updateText,
  updateTotalKE,
  updateTotalMomentum,
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
  const m1 = useRef(DEFAULT_INPUTS.m1);
  const m2 = useRef(DEFAULT_INPUTS.m2);
  const v1 = useRef(DEFAULT_INPUTS.v1 * TIME_STEP);
  const v2 = useRef(DEFAULT_INPUTS.v2 * TIME_STEP);
  const size1 = useRef(1 + DEFAULT_INPUTS.m1 / 10);
  const size2 = useRef(1 + DEFAULT_INPUTS.m2 / 10);

  // to be used on resume after reset
  const initialVelocity = useRef({
    v1: v1.current,
    v2: v2.current,
  });

  const [playing, setPlaying] = useState(false);
  // refs of 3D canvas
  const meshRef1: MutableRefObject<THREE.Mesh | null> = useRef(null);
  const meshRef2: MutableRefObject<THREE.Mesh | null> = useRef(null);
  const arrowRef1: MutableRefObject<THREE.ArrowHelper | null> = useRef(null);
  const arrowRef2: MutableRefObject<THREE.ArrowHelper | null> = useRef(null);
  const dottedLineRef1: MutableRefObject<Line2 | LineSegments2> = useRef(null);

  // refs to update results text
  const v1TextRef: MutableRefObject<HTMLParagraphElement | null> = useRef(null);
  const v2TextRef: MutableRefObject<HTMLParagraphElement | null> = useRef(null);
  const m1TextRef: MutableRefObject<HTMLParagraphElement | null> = useRef(null);
  const m2TextRef: MutableRefObject<HTMLParagraphElement | null> = useRef(null);
  const p1TextRef: MutableRefObject<HTMLParagraphElement | null> = useRef(null);
  const p2TextRef: MutableRefObject<HTMLParagraphElement | null> = useRef(null);
  const kE1TextRef: MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);
  const kE2TextRef: MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);
  const totalKETextRef: MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);
  const totalMomentumTextRef: MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);

  /**
   * Update the text of the objects, always updates the total KE and momentum
   * @param count 0: update all, 1: update 1, 2: update 2
   */
  const updateAllTexts = (count: number) => {
    if (count == 0 || count == 1) {
      updateText(
        v1.current / TIME_STEP,
        m1.current,
        m1TextRef.current as HTMLParagraphElement,
        v1TextRef.current as HTMLParagraphElement,
        p1TextRef.current as HTMLParagraphElement,
        kE1TextRef.current as HTMLParagraphElement
      );
    }
    if (count == 0 || count == 2)
      updateText(
        v2.current / TIME_STEP,
        m2.current,
        m2TextRef.current as HTMLParagraphElement,
        v2TextRef.current as HTMLParagraphElement,
        p2TextRef.current as HTMLParagraphElement,
        kE2TextRef.current as HTMLParagraphElement
      );

    // update the total kinetic energy
    updateTotalKE(
      getTotalKE(m1.current, v1.current, m2.current, v2.current),
      totalKETextRef.current as HTMLParagraphElement
    );

    // update the total momentum
    updateTotalMomentum(
      getTotalMomentum(m1.current, v1.current, m2.current, v2.current),
      totalMomentumTextRef.current as HTMLParagraphElement
    );
  };

  const updateIfReachedEndOfRoad = (
    mesh: THREE.Mesh,
    v: MutableRefObject<number>,
    size: number
  ) => {
    if (
      mesh.position.z + size > END_OF_ROAD ||
      mesh.position.z - size < -END_OF_ROAD
    ) {
      v.current = -v.current;
      updateAllTexts(0);
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
        m1.current,
        v1.current,
        m2.current,
        v2.current
      );

      // update the velocity
      v1.current = v1f;
      v2.current = v2f;

      updateAllTexts(0);
    }
    updateArrows(arrowRef1.current, mesh1.position.z, v1.current);
    updateArrows(arrowRef2.current, mesh2.position.z, v2.current);

    // moves along z axis
    mesh1.position.setZ(mesh1.position.z + v1.current);
    mesh2.position.setZ(mesh2.position.z + v2.current);

    // // if it reaches the end of the road, reverse the direction
    // updateIfReachedEndOfRoad(mesh1, v1, size1.current);
    // updateIfReachedEndOfRoad(mesh2, v2, size2.current);

    if (
      checkIfReachedEndOfRoad(mesh1, size1.current) ||
      checkIfReachedEndOfRoad(mesh2, size2.current)
    ) {
      handleReset();
    }
  });

  /**
   * Update the text of the objects, always updates the total KE and momentum. When the playing state changes.
   */
  useEffect(() => {
    updateAllTexts(0);
    updateArrows(arrowRef1.current, meshRef1.current.position.z, v1.current);
    updateArrows(arrowRef2.current, meshRef2.current.position.z, v2.current);
  }, [playing]);

  const updateBox = (mesh: THREE.Mesh, size: number) => {
    mesh.geometry = boxGeometry
      .clone()
      .applyMatrix4(matrix4.clone().makeScale(size, size, size));
    mesh.position.setY(size / 2);
  };

  const updateRefValues = (param: string, value: number) => {
    const position1 = getDefaultPositionOfBox(size1.current, 1).z;
    const position2 = getDefaultPositionOfBox(size2.current, 2).z;
    switch (param) {
      case "m1":
        m1.current = value;
        size1.current = getSizeOfBox(value);
        updateBox(meshRef1.current, size1.current);
        arrowRef1.current!.position.setY(size1.current / 2);
        break;
      case "m2":
        m2.current = value;
        size2.current = getSizeOfBox(value);
        updateBox(meshRef2.current, size2.current);
        arrowRef2.current!.position.setY(size2.current / 2);
        break;
      case "v1":
        v1.current = value * TIME_STEP;
        initialVelocity.current.v1 = value * TIME_STEP;
        arrowRef1.current!.position.setY(size1.current);
        updateArrows(arrowRef1.current, position1, v1.current);
        break;
      case "v2":
        v2.current = value * TIME_STEP;
        initialVelocity.current.v2 = value * TIME_STEP;
        arrowRef2.current!.position.setY(size2.current);
        updateArrows(arrowRef2.current, position2, v2.current);
        break;
    }
  };

  const handleInputChange = (param: string, value: number) => {
    /**
     * pause
     * reset position
     * update reference values
     * update the text
     *
     */

    setPlaying(false);

    const meshOneNotResetPosition: boolean =
      meshRef1.current.position.z !=
      getDefaultPositionOfBox(size1.current, 1).z;
    const meshTwoNotResetPosition: boolean =
      meshRef2.current.position.z !=
      getDefaultPositionOfBox(size2.current, 2).z;

    if (meshOneNotResetPosition || meshTwoNotResetPosition) {
      resetPosition();
    }

    updateRefValues(param, value);
    updateAllTexts(0);
  };

  const handleReset = () => {
    /**
     * STEPS:
     * pause
     * update velocities
     * update arrows
     * reset position
     *
     */
    setPlaying(false);

    v1.current = initialVelocity.current.v1;
    v2.current = initialVelocity.current.v2;

    updateArrows(
      arrowRef1.current,
      getDefaultPositionOfBox(size1.current, 1).z,
      v1.current
    );
    updateArrows(
      arrowRef2.current,
      getDefaultPositionOfBox(size2.current, 2).z,
      v2.current
    );

    resetPosition();
  };

  /**
   * Reset the position of the boxes to the initial position.
   */
  const resetPosition = () => {
    meshRef1.current!.position.setZ(
      getDefaultPositionOfBox(size1.current, 1).z
    );
    meshRef2.current!.position.setZ(
      getDefaultPositionOfBox(size2.current, 2).z
    );
  };

  return (
    <group scale={[1, 1, 1]}>
      <SingleBlock ref={meshRef1} size={size1.current} count={1} />
      <SingleBlock ref={meshRef2} size={size2.current} count={2} />

      {/* <WallsAtEndOfRoad /> */}

      <Html
        fullscreen
        style={{
          letterSpacing: "0.1em",
          userSelect: "none",
        }}
        prepend
        className="p-2 lg:px-2  w-full"
      >
        <div className="flex items-center justify-center text-white text-3xl my-2">
          Collision
        </div>
        <div>
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

            <div className="invisible sm:visible">
              <CollisionInputs inputChange={handleInputChange} />
            </div>
          </div>
          {/* Controls */}
          {/* <Controls resetPosition={resetPosition} /> */}

          <div className="absolute bottom-2 left-1/3  flex flex-row justify-between items-center gap-6 w-fit text-white">
            <div
              className="bg-green-500 text-black cursor-pointer shadow-xl p-3 md:p-5 self-start  rounded-full hover:scale-125 transition-transform duration-300 transform "
              onClick={() => setPlaying((prev) => !prev)}
            >
              {playing ? <Pause size={40} /> : <Play size={40} />}
            </div>
            <div
              title="reset"
              className="bg-cyan-300 text-black self-start cursor-pointer hover:shadow-xl hover:scale-125 transition-transform duration-300 transform  p-4   rounded-full "
              onClick={handleReset}
            >
              <RotateCcw size={25} />
            </div>
          </div>
        </div>
        <FullScreenButton div={divRef.current} />
      </Html>

      {/* draw arrow from box to the direction of velocity */}
      <group>
        <arrowHelper
          ref={arrowRef1}
          args={[
            vec.set(0, 0, v1.current).normalize(),
            vec.clone().set(0, size1.current / 2, 0),
            4,
          ]}
        />
        <arrowHelper
          ref={arrowRef2}
          args={[
            vec.set(0, 0, v2.current).normalize(),
            vec.clone().set(0, size2.current / 2, 0),
            4,
          ]}
        />
      </group>
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
          <Suspense fallback="loading...">
            <MainContents divRef={divRef} />
          </Suspense>
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
