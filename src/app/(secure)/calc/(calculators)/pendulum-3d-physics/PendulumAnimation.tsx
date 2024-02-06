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
import { ReactNode, useRef } from "react";
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
}: {
  pendulumRef: React.RefObject<Pendulum>;
  angleResultRef: React.RefObject<HTMLParagraphElement>;
  velocityResultRef: React.RefObject<HTMLParagraphElement>;
  accelarationResultRef: React.RefObject<HTMLParagraphElement>;
  heightResultRef: React.RefObject<HTMLParagraphElement>;
  potentialEnergyResultRef: React.RefObject<HTMLParagraphElement>;
  kineticEnergyResultRef: React.RefObject<HTMLParagraphElement>;
  totalEnergyResultRef: React.RefObject<HTMLParagraphElement>;
}) => {
  const length = useAtomValue(pendulumStore.lengthAtom);

  return (
    <>
      <div className=" h-[40vh] w-full  md:h-[80vh] ">
        <Canvas shadows="soft">
          {/* <AdaptiveCamera length={length} /> */}
          <CubeCamera
            position={[0, 0, length + 1]}
            near={1}
            far={50}
            children={function (tex: THREE.Texture): ReactNode {
              return <primitive object={tex} />;
            }}
          />
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
// });

const PauseResumeControl = () => {
  const [animating, setAnimating] = useAtom(pendulumStore.isPlayingAtom);
  return (
    <div className="flex flex-row gap-4 items-center justify-center">
      <div
        className="bg-green-500 cursor-pointer shadow-xl p-5  rounded-full hover:scale-125 transition-transform duration-300 transform "
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
}: {
  pendulumRef: React.RefObject<Pendulum>;
  angleResultRef: React.RefObject<HTMLParagraphElement>;
  velocityResultRef: React.RefObject<HTMLParagraphElement>;
  accelarationResultRef: React.RefObject<HTMLParagraphElement>;
  heightResultRef: React.RefObject<HTMLParagraphElement>;
  potentialEnergyResultRef: React.RefObject<HTMLParagraphElement>;
  kineticEnergyResultRef: React.RefObject<HTMLParagraphElement>;
  totalEnergyResultRef: React.RefObject<HTMLParagraphElement>;
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
  useFrame(({ clock }) => {
    clock.autoStart = false;
    if (animationRef.current && animating) {
      if (!clock.running) clock.start();
      const deltaTime = clock.elapsedTime - timeCounter;
      const theta = pendulum.step(deltaTime);
      timeCounter += deltaTime;

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
        ).toFixed(4);

      if (velocityResultRef.current)
        velocityResultRef.current.innerText = pendulum.velocity.toFixed(4);

      if (accelarationResultRef.current)
        accelarationResultRef.current.innerText =
          pendulum.accelaration.toFixed(4);

      if (heightResultRef.current)
        heightResultRef.current.innerText = pendulum.height.toFixed(4);

      if (potentialEnergyResultRef.current)
        potentialEnergyResultRef.current.innerText =
          pendulum.potentialEnergy.toFixed(4);

      if (kineticEnergyResultRef.current)
        kineticEnergyResultRef.current.innerText =
          pendulum.kineticEnergy.toFixed(4);

      if (totalEnergyResultRef.current)
        totalEnergyResultRef.current.innerText =
          pendulum.totalEnergy.toFixed(4);
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
