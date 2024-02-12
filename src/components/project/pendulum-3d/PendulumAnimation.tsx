"use client";

import {
  CubeCamera,
  Environment,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAtom, useAtomValue } from "jotai";
import { Pause, Play } from "lucide-react";
import React, { ReactNode, useEffect, useRef } from "react";
import * as THREE from "three";
import Pendulum from "./Pendulum";
import { pendulumStore } from "./store";

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

// const PendulumAnimation = forwardRef<PendulumAnimationRefs>(({}, refs) => {
const PendulumAnimation = ({
  pendulumRef,
  angleResultRef,
  velocityResultRef,
  accelarationResultRef,
  heightResultRef,
  potentialEnergyResultRef,
  kineticEnergyResultRef,
  totalEnergyResultRef,
  periodCounterRef,
}: {
  pendulumRef: React.RefObject<Pendulum>;
  angleResultRef: React.RefObject<HTMLParagraphElement>;
  velocityResultRef: React.RefObject<HTMLParagraphElement>;
  accelarationResultRef: React.RefObject<HTMLParagraphElement>;
  heightResultRef: React.RefObject<HTMLParagraphElement>;
  potentialEnergyResultRef: React.RefObject<HTMLParagraphElement>;
  kineticEnergyResultRef: React.RefObject<HTMLParagraphElement>;
  totalEnergyResultRef: React.RefObject<HTMLParagraphElement>;
  periodCounterRef: React.RefObject<HTMLParagraphElement>;
}) => {
  const length = useAtomValue(pendulumStore.lengthAtom);

  const Camera = ({ length }: { length: number }) => (
    <CubeCamera
      position={[0, 0, length + 1]}
      near={1}
      far={50}
      children={function (tex: THREE.Texture): ReactNode {
        return <primitive object={tex} />;
      }}
    />
  );

  return (
    <>
      <div className=" w-5/6  lg:w-full  h-[40vh] md:h-[70vh] mb-2">
        <Canvas shadows="soft">
          {/* <AdaptiveCamera length={length} /> */}
          <Camera length={length} />
          {/* <PerspectiveCamera
                makeDefault
                position={[0, 0.6, currentLength + 1]}
                fov={75}
                near={0.1}
                far={100}
              /> */}
          <Environment
            near={0.2}
            far={100}
            background
            blur={0}
            preset="apartment"
          />
          <Animation
            {...{
              pendulumRef,
              angleResultRef,
              velocityResultRef,
              accelarationResultRef,
              heightResultRef,
              potentialEnergyResultRef,
              kineticEnergyResultRef,
              totalEnergyResultRef,
              periodCounterRef,
            }}
          />
          {/* <Ground /> */}
          <Structure length={length} />

          {/* <ambientLight args={[0xdddddd, 0.4]} /> */}

          <OrbitControls minDistance={1} maxDistance={45} />
        </Canvas>
      </div>

      <PauseResumeControl />
    </>
  );
};

const StopWatch = () => {
  const animating = useAtomValue(pendulumStore.isPlayingAtom);

  const timeRef = useRef<HTMLParagraphElement>(null);
  const timeCounter = useRef(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (animating) {
      interval = setInterval(() => {
        timeCounter.current += 0.01;
        if (timeRef.current)
          timeRef.current.innerText = timeCounter.current.toFixed(2);
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [animating]);

  return (
    <div className="flex flex-row items-center justify-between gap-2 border-2 p-3 ">
      <strong className="text-lg md:text-2xl">Stopwatch</strong>
      <p
        ref={timeRef}
        className="text-xl md:text-3xl text-right font-mono w-[7ch]"
      >
        0
      </p>
      <strong className="text-xl">s</strong>
    </div>
  );
};

const PauseResumeControl = () => {
  const [animating, setAnimating] = useAtom(pendulumStore.isPlayingAtom);

  return (
    <div className="flex flex-row gap-1 md:gap-4 items-center justify-around">
      {/* add stopwatch */}
      <StopWatch />
      <div
        className="bg-green-500 cursor-pointer shadow-xl p-3 md:p-5 self-start  rounded-full hover:scale-125 transition-transform duration-300 transform "
        onClick={() => setAnimating(!animating)}
      >
        {animating ? <Pause size={40} /> : <Play size={40} />}
      </div>
    </div>
  );
};

// const Animation = forwardRef<PendulumAnimationRefs>(({}, refs) => {
const Animation = ({
  pendulumRef,
  angleResultRef,
  velocityResultRef,
  accelarationResultRef,
  heightResultRef,
  potentialEnergyResultRef,
  kineticEnergyResultRef,
  totalEnergyResultRef,
  periodCounterRef,
}: {
  pendulumRef: React.RefObject<Pendulum>;
  angleResultRef: React.RefObject<HTMLParagraphElement>;
  velocityResultRef: React.RefObject<HTMLParagraphElement>;
  accelarationResultRef: React.RefObject<HTMLParagraphElement>;
  heightResultRef: React.RefObject<HTMLParagraphElement>;
  potentialEnergyResultRef: React.RefObject<HTMLParagraphElement>;
  kineticEnergyResultRef: React.RefObject<HTMLParagraphElement>;
  totalEnergyResultRef: React.RefObject<HTMLParagraphElement>;
  periodCounterRef: React.RefObject<HTMLParagraphElement>;
}) => {
  const animating = useAtomValue(pendulumStore.isPlayingAtom);

  const pendulum = pendulumRef.current;
  const length = useAtomValue(pendulumStore.lengthAtom);
  const initialAngle = useAtomValue(pendulumStore.angleAtom) * (Math.PI / 180);

  const stringRef = useRef<THREE.Mesh>(null);
  const bobRef = useRef<THREE.Mesh>(null);
  const animationRef = useRef<THREE.Group>(null);
  const bobColor = useTexture("/marble_color.jpg");
  const bobRoughness = useTexture("/marble_roughness.jpg");

  let timeCounter = 0;
  const precision = 2;
  let periodCounter = 0;
  useFrame(({ clock }) => {
    clock.autoStart = false;
    if (animationRef.current && animating) {
      if (!clock.running) clock.start();
      // if(pendulum.swingCount%2 == 1) {
      //   periodCounter = 0;
      // }

      const deltaTime = clock.elapsedTime - timeCounter;
      const theta = pendulum.step(deltaTime);
      timeCounter += deltaTime;

      if (pendulum.swingCount == 2) {
        periodCounter += deltaTime;
        if (periodCounterRef.current)
          periodCounterRef.current.innerText = periodCounter.toFixed(precision);
      }
      if (pendulum.swingCount == 3) {
        periodCounter = 0;
        pendulum.swingCount = 1;
      }
      animationRef.current.rotation.z = theta;
    } else {
      if (clock.running) clock.stop();
    }
    /**
     * update results
     */

    if (pendulumRef.current) {
      if (angleResultRef.current)
        angleResultRef.current.innerText = (
          (pendulum.angle * 180) /
          Math.PI
        ).toFixed(precision);

      if (velocityResultRef.current)
        velocityResultRef.current.innerText =
          pendulum.velocity.toFixed(precision);

      if (accelarationResultRef.current)
        accelarationResultRef.current.innerText =
          pendulum.accelaration.toFixed(precision);

      if (heightResultRef.current)
        heightResultRef.current.innerText = (pendulum.height * 100).toFixed(
          precision
        );

      if (potentialEnergyResultRef.current)
        potentialEnergyResultRef.current.innerText =
          pendulum.potentialEnergy.toFixed(precision);

      if (kineticEnergyResultRef.current)
        kineticEnergyResultRef.current.innerText =
          pendulum.kineticEnergy.toFixed(precision);

      if (totalEnergyResultRef.current)
        totalEnergyResultRef.current.innerText =
          pendulum.totalEnergy.toFixed(precision);
    }
  });
  return (
    pendulumRef.current && (
      <group
        ref={animationRef}
        rotation={[0, 0, initialAngle]}
        position={[0, 0.6, 0]}
      >
        {/* string */}
        <mesh castShadow={true} position={[0, -length / 2, 0]} ref={stringRef}>
          <cylinderGeometry args={[0.008, 0.008, length]} />
          <meshStandardMaterial
            color={0x222222}
            roughness={1}
            metalness={0.2}
          />
        </mesh>

        {/* bob */}
        <mesh ref={bobRef} position={[0, -length - 0.25, 0]} castShadow={true}>
          <sphereGeometry args={[0.5]} />
          <meshStandardMaterial
            map={bobColor}
            roughnessMap={bobRoughness}
            metalness={1}
          />
        </mesh>
      </group>
    )
  );
};
// });

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
    <group rotation={[0, Math.PI / 2, 0]}>
      <group>
        <mesh
          castShadow={true}
          position={[3, length / 2 + 2, 0]}
          rotation={[0, Math.PI / 4, 0]}
        >
          <cylinderGeometry args={[1, 1, 200]} />
          <meshStandardMaterial
            map={wood_color}
            roughnessMap={wood_roughness}
            normalMap={wood_normal}
          />
        </mesh>

        <mesh
          castShadow={true}
          position={[0, 1, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.1, 0.1, 4]} />
          <meshStandardMaterial
            map={wood_color}
            roughnessMap={wood_roughness}
            normalMap={wood_normal}
          />
        </mesh>
      </group>
      <group>
        <mesh castShadow={true} position={[0, 1 - 0.2, 0]}>
          <ringGeometry args={[0.2, 0.3]} />
          <meshStandardMaterial side={THREE.DoubleSide} map={wood_color} />
        </mesh>
        <mesh castShadow={true} receiveShadow={true} position={[0, 1 - 0.4, 0]}>
          <circleGeometry args={[0.1]} />
          <meshStandardMaterial side={THREE.DoubleSide} map={wood_color} />
        </mesh>
      </group>
    </group>
  );
};

export default PendulumAnimation;
