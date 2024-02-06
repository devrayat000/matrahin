"use client";

import {
  CubeCamera,
  Environment,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Pause, Play } from "lucide-react";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Button } from "~/components/ui/button";
import InputWithSlider from "~/components/ui/input-with-slider";
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

function Animation({
  pendulumRef,
  animating,
  angleResultRef,
  velocityResultRef,
  accelarationResultRef,
  heightResultRef,
  potentialEnergyResultRef,
  kineticEnergyResultRef,
  totalEnergyResultRef,
}: {
  pendulumRef: React.RefObject<Pendulum> | null;
  animating: boolean;
  angleResultRef: React.RefObject<HTMLParagraphElement>;
  velocityResultRef: React.RefObject<HTMLParagraphElement>;
  accelarationResultRef: React.RefObject<HTMLParagraphElement>;
  heightResultRef: React.RefObject<HTMLParagraphElement>;
  potentialEnergyResultRef: React.RefObject<HTMLParagraphElement>;
  kineticEnergyResultRef: React.RefObject<HTMLParagraphElement>;
  totalEnergyResultRef: React.RefObject<HTMLParagraphElement>;
}) {
  const pendulum = useMemo(() => pendulumRef?.current, [pendulumRef.current]);

  const length = useMemo(() => pendulum.length, [pendulum.length]);

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
    if (angleResultRef.current)
      angleResultRef.current.innerText = (
        ((pendulum.angle ?? pendulum.initialAngle) * 180) /
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
      totalEnergyResultRef.current.innerText = pendulum.totalEnergy.toFixed(4);
  });
  return (
    <group
      ref={animationRef}
      rotation={[0, 0, pendulum.initialAngle]}
      position={[0, 0.6, 0]}
    >
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
          roughnessMap={bobRoughness}
          metalness={1}
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

const INITIAL_VALUES = {
  angle: 45,
  length: 2,
  mass: 1,
  gravity: 9.8,
};

const inputOptions = [
  {
    id: 1,
    label: "Angle (°)",
    helperText: "Initial angle of the pendulum",
    min: -180,
    max: 180,
    valueText: "angle", //to change in Pendulum object
  },
  {
    id: 2,
    label: "Length",
    helperText: "Active length of the pendulum",
    min: 0.1,
    max: 25,
    valueText: "length", //to change in Pendulum object
  },
  {
    id: 3,
    label: "Mass",
    helperText: "Mass of the pendulum",
    min: 0.1,
    max: 250,
    valueText: "mass", //to change in Pendulum object
  },
];

export default function PendulumAnimation() {
  const [props, setProps] = useState(INITIAL_VALUES);
  const currentLength = useMemo(() => props.length, [props.length]);

  const [animating, setAnimating] = useState(true);
  const pendulumRef = useRef<Pendulum>(null);

  // refs for showing results live
  const angleResultRef = useRef<HTMLParagraphElement>(null);
  const velocityResultRef = useRef<HTMLParagraphElement>(null);
  const accelarationResultRef = useRef<HTMLParagraphElement>(null);
  const heightResultRef = useRef<HTMLParagraphElement>(null);
  const potentialEnergyResultRef = useRef<HTMLParagraphElement>(null);
  const kineticEnergyResultRef = useRef<HTMLParagraphElement>(null);
  const totalEnergyResultRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!pendulumRef.current) {
      pendulumRef.current = new Pendulum(
        (props.angle * Math.PI) / 180,
        props.length,
        props.mass,
        props.gravity,
        0,
        0
      );
    }
  }, []);

  const calculateResults = () => {
    pendulumRef.current?.setValue(
      "angle",
      Number((props.angle * Math.PI) / 180)
    );
    pendulumRef.current?.setValue("length", Number(props.length));
    pendulumRef.current?.setValue("mass", Number(props.mass));
    pendulumRef.current?.setValue("gravity", Number(props.gravity));
    setAnimating(true);
  };

  const PeriodTimer = () => {
    return <div>PeriodTimer</div>;
  };

  const PauseButton = () => {
    return <div>PauseButton</div>;
  };
  const ResetButton = () => {
    return <div>ResetButton</div>;
  };

  /**
   * chosen colors:
   * #fbeec1
   * #05386b
   * #2f4454
   * #b4dfe5
   * #a1c3d1
   */
  const resultStyle =
    "flex flex-row justify-between items-center gap-1 m-3 font-mono rounded-xl  text-white  shadow-[0_5px_10px_rgb(0,0,0,0.4)] bg-[#2f4454] p-3 px-4";

  return (
    <>
      <div className="grid md:grid-cols-4 grid-cols-1 gap-2 m-4 justify-center items-center md:items-start">
        {/* Results */}
        <center className="order-3 md:order-1 ">
          <div className="w-5/6  flex-col border-2 rounded-lg bg-[#b4dfe5]  items-center border-gray-950">
            <p className="text-center text-xl pt-3">Results</p>
            {/* result options goes here */}

            {/* angle */}
            <div className={resultStyle}>
              <p>Angle: </p>
              <div className="flex flex-row items-center justify-between">
                <p ref={angleResultRef}>{props.angle}</p>
                <p>°</p>
              </div>
            </div>

            {/* velocity  */}
            <div className={resultStyle}>
              <p>Velocity: </p>
              <div className="flex flex-row items-center justify-between gap-1">
                <p ref={velocityResultRef}>0</p>
                <p>m/s</p>
              </div>
            </div>

            {/* accelaration */}
            <div className={resultStyle}>
              <p>Accelaration: </p>
              <div className="flex flex-row items-center justify-between gap-1">
                <p ref={accelarationResultRef}>{0}</p>
                <p>
                  m/s<sup>2</sup>
                </p>
              </div>
            </div>

            {/* height */}
            <div className={resultStyle}>
              <p>Height: </p>
              <div className="flex flex-row items-center justify-between gap-1">
                <p ref={heightResultRef}>
                  {(
                    props.length *
                    (1 - Math.cos((props.angle * Math.PI) / 180))
                  ).toFixed(4)}
                </p>
                <p>m</p>
              </div>
            </div>

            {/* Potential Energy */}
            <div className={resultStyle}>
              <p className="text-left">Potential Energy: </p>
              <div className="flex flex-row items-center justify-between gap-1">
                <p ref={potentialEnergyResultRef}>
                  {(
                    props.mass *
                    props.gravity *
                    props.length *
                    (1 - Math.cos((props.angle * Math.PI) / 180))
                  ).toFixed(4)}
                </p>
                <p>J</p>
              </div>
            </div>

            {/* Kinetic Energy */}
            <div className={resultStyle}>
              <p>Kinetic Energy: </p>
              <div className="flex flex-row items-center justify-between gap-1">
                <p ref={kineticEnergyResultRef}>0</p>
                <p>m</p>
              </div>
            </div>

            {/* Total Energy */}
            <div className={resultStyle}>
              <p>Total Energy: </p>
              <div className="flex flex-row items-center justify-between gap-1">
                <p ref={totalEnergyResultRef}>
                  {(
                    props.mass *
                    props.gravity *
                    props.length *
                    (1 - Math.cos((props.angle * Math.PI) / 180))
                  ).toFixed(4)}
                </p>
                <p>J</p>
              </div>
            </div>

            {/* results done */}
          </div>
        </center>
        {/* Canvas */}
        <div className=" h-[40vh] md:h-[70vh] md:col-span-2  order-1 md:order-2 ">
          <Canvas shadows="soft">
            {/* <AdaptiveCamera length={props.length} /> */}
            <CubeCamera
              position={[0, 0, currentLength + 1]}
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
              pendulumRef={pendulumRef}
              animating={animating}
              angleResultRef={angleResultRef}
              velocityResultRef={velocityResultRef}
              accelarationResultRef={accelarationResultRef}
              heightResultRef={heightResultRef}
              potentialEnergyResultRef={potentialEnergyResultRef}
              kineticEnergyResultRef={kineticEnergyResultRef}
              totalEnergyResultRef={totalEnergyResultRef}
            />
            {/* <Ground /> */}
            <Structure length={currentLength} />

            {/* <ambientLight args={[0xdddddd, 0.4]} /> */}

            <OrbitControls minDistance={1} maxDistance={45} />
          </Canvas>
        </div>
        <div className="order-2 md:order-4  ">
          {/* inputs */}
          <div className="w-full mx-auto self-start">
            {inputOptions &&
              inputOptions.map((option, index) => (
                <InputWithSlider
                  key={index}
                  label={option.label}
                  value={props[option.valueText]}
                  id={option.id}
                  helperText={option.helperText}
                  onChangeInput={(id, value) => {
                    if (animating) setAnimating(false);
                    pendulumRef.current?.setValue(
                      option.valueText,
                      Number(value) *
                        (option.valueText === "angle" ? Math.PI / 180 : 1) // change to radians
                    );
                    setProps({ ...props, [option.valueText]: Number(value) });
                  }}
                  min={option.min}
                  max={option.max}
                />
              ))}
          </div>
          <center>
            <Button
              disabled={animating}
              onClick={calculateResults}
              className="w-[100px] "
            >
              Calculate
            </Button>
          </center>
        </div>
      </div>
      <center>
        <div className="flex flex-row items-center justify-center gap-8 ">
          <PeriodTimer />
          {/* pause button */}
          <div
            className="bg-green-500 cursor-pointer shadow-xl p-5  rounded-full "
            onClick={() => setAnimating(!animating)}
          >
            {animating ? <Pause size={40} /> : <Play size={40} />}
          </div>
          <ResetButton />
        </div>
      </center>
    </>
  );
}
