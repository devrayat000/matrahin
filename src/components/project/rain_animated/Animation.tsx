//TODO:for negative v_object, rain is not working properly

"use client";

import {
  Html,
  OrbitControls,
  PerspectiveCamera,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAtomValue } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { resultAtom } from "./store";

const colors = [
  "#0000ff",
  "#000",
  "#ffff00",
  "#52010d",
  "#081d93",
  "#ff8000",
  "#80ff00",
  "#00ffff",
  "#00ff80",
  "#00ff00",
  "#ff00ff",
  "#ff0080",
  "#8000ff",
];
const createArrow = (vectors: { label: string; vector: THREE.Vector3 }[]) => {
  return (
    <group>
      {vectors.map(({ label, vector: v }, index) => {
        const arrow: [
          direction: THREE.Vector3,
          origin: THREE.Vector3,
          length: number,
          color: THREE.ColorRepresentation
        ] = [
          v.clone().normalize(),
          new THREE.Vector3(0, 1, 1),
          v.length(),
          colors[index],
        ];

        return (
          <React.Fragment key={index}>
            <arrowHelper args={arrow} />
            <Html
              position={v.clone().add(new THREE.Vector3(0, 1, 0)).toArray()}
            >
              <p
                style={{
                  color: colors[index],
                  fontSize: "18px",
                }}
              >
                {label}
              </p>
            </Html>
          </React.Fragment>
        );
      })}
    </group>
  );
};

const Ground = ({ v_object }: { v_object: number }) => {
  const gridSurfaceRef = React.useRef<THREE.Mesh>(null);
  // const { v_object } = useAtomValue(resultAtom);

  const speed = 2 + (v_object ?? 4) / 100;

  const nonZero = v_object === 0 ? 0 : 1;
  // updating the position of the ground

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    gridSurfaceRef.current?.position.set(0, 0, -1800 + time * speed * nonZero);
  });
  const textureColorPath = useTexture("/paving_color.jpg");
  textureColorPath.wrapS = THREE.RepeatWrapping;
  textureColorPath.wrapT = THREE.RepeatWrapping;
  textureColorPath.repeat.set(1000, 1000);
  const textureRoughnessPath = useTexture("/paving_roughness.jpg");
  textureRoughnessPath.wrapS = THREE.RepeatWrapping;
  textureRoughnessPath.wrapT = THREE.RepeatWrapping;
  textureRoughnessPath.repeat.set(1000, 1000);

  const textureNormalPath = useTexture("/paving_normal.jpg");
  textureNormalPath.wrapS = THREE.RepeatWrapping;
  textureNormalPath.wrapT = THREE.RepeatWrapping;
  textureNormalPath.repeat.set(1000, 1000);

  const textureAmbientOcclusionPath = useTexture(
    "/paving_ambient_occlusion.jpg"
  );
  textureAmbientOcclusionPath.wrapS = THREE.RepeatWrapping;
  textureAmbientOcclusionPath.wrapT = THREE.RepeatWrapping;
  textureAmbientOcclusionPath.repeat.set(1000, 1000);

  return (
    <mesh
      ref={gridSurfaceRef}
      receiveShadow={true}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
    >
      <planeGeometry args={[4000, 4000]} />
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
const Animation = () => {
  const directionalLightRef = React.useRef<THREE.DirectionalLight>(null);

  const inputs = useAtomValue(resultAtom);
  // console.log(inputs);
  const v_wind_object = inputs.v_wind_object ?? -4;
  const v_rain = inputs.v_rain ?? 3;
  const v_object = inputs.v_object ?? 4;
  useEffect(() => {
    if (directionalLightRef.current) {
      directionalLightRef.current.shadow.camera.top = 2;
      directionalLightRef.current.shadow.camera.bottom = -2;
      directionalLightRef.current.shadow.camera.left = -2;
      directionalLightRef.current.shadow.camera.right = 2;
      directionalLightRef.current.shadow.camera.near = 0.1;
      directionalLightRef.current.shadow.camera.far = 40;
    }
  }, []);

  return (
    <div className="lg:self-start">
      <div className="flex flex-col md:flex-row items-center justify-center">
        <div className="m-auto md:mx-0 my-4 h-[50vh] w-[40vh] md:w-[100vh] md:h-[90vh]">
          <React.Suspense fallback={<p> loading ...</p>}>
            <Canvas shadows>
              <color attach="background" args={["#a4a4a4"]} />
              <PerspectiveCamera
                fov={45}
                aspect={1.5}
                near={1}
                far={120}
                position={[4 * (v_object < 0 ? -1 : 1), 2, 0]}
                makeDefault={true}
              />
              <Ground v_object={Math.abs(v_object)} />
              {/* <axesHelper args={[10]} /> */}
              <fog attach="fog" args={["#a4a4a4", 30, 180]} />

              {/* <GridSurface /> */}
              <Object
                v_object={Math.abs(v_object)}
                v_wind_object={v_wind_object * -1}
                v_rain={v_rain}
              />
              <OrbitControls maxDistance={20} minDistance={5} />
              <hemisphereLight
                args={[new THREE.Color(0xbbbbbb), new THREE.Color(0x00ffff), 3]}
                position={[0, 20, 0]}
              />
              <directionalLight
                ref={directionalLightRef}
                args={[new THREE.Color(0xaaaaaa), 4]}
                position={[8, 8, -10]}
                castShadow={true}
              />
              {/* <gridHelper size={100} /> */}
            </Canvas>
          </React.Suspense>
        </div>
      </div>
    </div>
  );
};

const GridSurface = () => {
  const gridSurfaceRef = React.useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    gridSurfaceRef.current?.position.set(0, 0, -1800 + time * 2);
  });

  return (
    <group ref={gridSurfaceRef}>
      <mesh receiveShadow={true} rotation={new THREE.Euler(-Math.PI / 2, 0, 0)}>
        <planeGeometry args={[4000, 4000]} />
        <meshPhongMaterial depthWrite={false} />
      </mesh>
      <gridHelper args={[4000, 1000, 0x000000, 0x808080]} />
    </group>
  );
};

const Object = ({
  v_object,
  v_wind_object,
  v_rain,
}: {
  v_object: number;
  v_wind_object: number;
  v_rain: number;
}) => {
  const groupRef = useRef<THREE.Group>(new THREE.Group());
  const mixerRef = useRef<THREE.AnimationMixer>(null);
  const rainRef = useRef<THREE.Points>(null);

  const [animations, setAnimations] = useState<THREE.AnimationClip[]>([]);

  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  const N = 20000; // number of snowflakes
  const vector = new THREE.Vector3(0, -1, 0);

  const actualSpeed = 1 + (v_object ?? 4) / 50;
  const speed = 0.75 * actualSpeed;

  useEffect(() => {
    if (rainRef.current) {
      if (v_rain === 0) rainRef.current.visible = false;
      else rainRef.current.visible = true;
    }
  }, [v_rain]);
  useFrame(() => {
    const delta = clockRef.current.getDelta();
    if (groupRef.current && mixerRef.current) {
      mixerRef.current.update(delta * speed);
    }

    if (rainRef.current) {
      const positions = rainRef.current.geometry.attributes.position
        .array as Float32Array;
      for (var i = 0; i < N; i++) {
        const v = vector
          .clone()
          .set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
        v.add(
          vector
            .clone()
            .set(0, -v_rain * 0.6, v_wind_object)
            .multiplyScalar(delta)
        );

        if (v.y <= 0) {
          // this will not work, because the randomization is not done.
          // v.y = 25;

          // this will work, but the snowflakes will not be random.
          v.y = THREE.MathUtils.randFloat(1, 25);
          v.z = THREE.MathUtils.randFloat(25, -25);
        }

        positions[i * 3] = v.x;
        positions[i * 3 + 1] = v.y;
        positions[i * 3 + 2] = v.z;
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  React.useEffect(() => {
    mixerRef.current = new THREE.AnimationMixer(groupRef.current);
    const loader = new GLTFLoader();
    loader.load("/Soldier.glb", function (gltf) {
      const model = gltf.scene;
      groupRef.current?.add(model);

      model.traverse(function (object) {
        if (object.isObject3D) object.castShadow = true;
      });

      const animations = gltf.animations;

      const mixer = new THREE.AnimationMixer(model);
      const action = mixer.clipAction(animations[1]);
      action.enabled = true;
      action.setEffectiveTimeScale(1);
      action.setEffectiveWeight(1);

      setAnimations(animations);
      mixerRef.current = mixer;
      action.play();
    });

    var snowflakes = new THREE.BufferGeometry();
    const points = [];
    for (var i = 0; i < N; i++) {
      points.push(
        new THREE.Vector3(
          THREE.MathUtils.randFloatSpread(25),
          THREE.MathUtils.randFloat(0, 25),
          THREE.MathUtils.randFloatSpread(25)
        )
      );
    }
    snowflakes.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3)
    );
    snowflakes.setFromPoints(points);

    const pointMaterial = new THREE.PointsMaterial({
      // color: 0x0f5faf,
      color: 0xafafaf,
      clipShadows: true,
      size: 0.05, // Adjust the size as needed
      transparent: false,
      opacity: 1,
      depthWrite: true,
      // blending: THREE.AdditiveBlending,
    });

    const point = new THREE.Points(snowflakes, pointMaterial);
    rainRef.current = point;

    groupRef.current?.add(point);
  }, []);

  useEffect(() => {
    if (animations.length !== 0 && mixerRef.current) {
      if (v_object == 0) {
        mixerRef.current.stopAllAction();

        const action = mixerRef.current?.clipAction(animations[0]);
        action.enabled = true;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(1);
        action.play();
      } else {
        // console.log(mixerRef.current.existingAction(animations[0]));
        mixerRef.current.existingAction(animations[0])?.stop();
        mixerRef.current
          .existingAction(animations[1])
          ?.setEffectiveTimeScale(1)
          .setEffectiveWeight(1)
          .play();
      }
    }
  }, [v_object]);

  return (
    <>
      <primitive object={groupRef.current} />
      {/* {groupRef.current &&
        createArrow([
          { label: "V(rain)", vector: vector.clone().set(0, -v_rain / 10, 0) },
          { label: "V(object)", vector: vector.clone().set(0, 0, -1) },
          { label: "-V (object)", vector: vector.clone().set(0, 0, 1) },
          {
            label: "V(relative)",
            vector: vector.clone().set(0, -1, 1),
          },
        ])} */}
    </>
  );
};

const AnimationWithSuspense = () => {
  return (
    <React.Suspense fallback={<p> loading ...</p>}>
      <Animation />
    </React.Suspense>
  );
};
export default AnimationWithSuspense;
