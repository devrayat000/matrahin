"use client";

import {
  CubeCamera,
  Environment,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { GUI } from "dat.gui";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
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

function Animation({
  pendulumRef,
  guiRef,
}: {
  pendulumRef: React.RefObject<Pendulum> | null;
  guiRef: React.RefObject<GUI>;
}) {
  const pendulum = useMemo(() => pendulumRef?.current, [pendulumRef.current]);
  const [animating, setAnimating] = useState(true);
  const length = useMemo(() => pendulum.length, [pendulum.length]);

  const stringRef = useRef<THREE.Mesh>(null);
  const bobRef = useRef<THREE.Mesh>(null);
  const animationRef = useRef<THREE.Group>(null);
  const bobColor = useTexture("/marble_color.jpg");
  const bobRoughness = useTexture("/marble_roughness.jpg");

  const angleRef = useRef<HTMLElement>(null);
  const timeRef = useRef<HTMLElement>(null);
  const resultObj = {
    pause_resume: function () {
      setAnimating((prev) => !prev);
    },
    angle: (pendulum.angle * 180) / Math.PI,
    time: 0,
  };

  useEffect(() => {
    if (guiRef.current) {
      guiRef.current.add(resultObj, "pause_resume").name("Pause / Resume");
      angleRef.current = guiRef.current
        .add(resultObj, "angle", -180, 180)
        .name("Angle").domElement;
      timeRef.current = guiRef.current
        .add(resultObj, "time")
        .name("Elapsed Time").domElement;
    }
  }, []);
  // const timeRef = useRef(0);
  // const timeElapsed = useMemo(() => () => timeRef.current, []);
  let timeCounter = 0;
  let previousTime = -1;
  useFrame(({ clock }) => {
    clock.autoStart = false;
    if (animationRef.current && animating) {
      if (!clock.running) clock.start();
      const deltaTime = clock.elapsedTime - timeCounter;
      const theta = pendulum.step(deltaTime);
      timeCounter += deltaTime;
      timeRef.current.textContent = `${clock.elapsedTime.toFixed(4)}s`;
      angleRef.current.textContent = ((pendulum.angle * 180) / Math.PI).toFixed(
        4
      );
      animationRef.current.rotation.z = theta;
    } else {
      if (clock.running) clock.stop();
    }
  });
  return (
    <group ref={animationRef} position={[0, 0.6, 0]}>
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
      {/* <mesh>
        
      </mesh> */}
    </group>
  );
};

export default function PendulumAnimation() {
  const [props, setProps] = useState<{
    length: number;
    angle: number;
    gravity: number;
    mass: number;
  }>({
    length: 2,
    angle: 30,
    gravity: 9.81,
    mass: 2,
  });
  const guiRef = useRef<GUI>(null);
  const pendululmRef = useRef<Pendulum>(null);

  useEffect(() => {
    if (!pendululmRef.current) {
      pendululmRef.current = new Pendulum(
        (props.angle * Math.PI) / 180,
        props.length,
        props.mass,
        props.gravity,
        0,
        0
      );
    }
  }, []);

  const init = async () => {
    const dat = await import("dat.gui");
    const gui = new dat.GUI({ autoPlace: false });

    guiRef.current = gui;
    gui.domElement.style.width = "100%";
    const obj = {
      title: "Pendulum Simulation",
      length: props.length,
      angle: props.angle,
    };

    const resultDom = gui.add(obj, "title").name("Title").domElement;
    resultDom.style.pointerEvents = "none";
    resultDom.style.fontSize = "14px";
    resultDom.textContent = "Pendulum Simulation";
    // gui.__controllers[0].domElement.style.pointerEvents = "none";
    gui
      .add(obj, "length", 1, 10)
      .onChange((v) => {
        setProps((prev) => ({ ...prev, length: v }));
        pendululmRef.current.setLength(v);
      })
      .name("Length");
    gui
      .add(obj, "angle", -180, 180)
      .onChange((v) => {
        setProps((prev) => ({ ...prev, angle: v }));
        pendululmRef.current.setAngle((v * Math.PI) / 180);
      })
      .name("Initial Angle (degree)");

    var customContainer = document.getElementById("gui");
    customContainer.appendChild(gui.domElement);
  };

  useEffect(() => {
    init();

    return () => {
      guiRef.current?.destroy();
    };
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-0 justify-evenly items-center">
      <div id="gui" className="self-end w-[80vh] h-[80vh]"></div>
      <div className="w-[80vh] h-[80vh] ">
        <Canvas shadows="soft">
          <CubeCamera
            position={[0, 1.6, props.length + 1]}
            near={1}
            far={50}
            children={function (tex: THREE.Texture): ReactNode {
              return <primitive object={tex} />;
            }}
          />
          <Environment
            near={0.2}
            far={100}
            background
            blur={0}
            preset="apartment"
          />
          <Animation pendulumRef={pendululmRef} guiRef={guiRef} />
          {/* <Ground /> */}
          <Structure length={props.length} />

          {/* <ambientLight args={[0xdddddd, 0.4]} /> */}

          <OrbitControls minDistance={1} maxDistance={45} />
        </Canvas>
      </div>
    </div>
  );
}
