"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useCallback, useEffect, useRef } from "react";
import { Color, MathUtils } from "three";
import { Grid, useDrag } from "./Grid";

const Cube = ({
  position = [1, 1, -1],
  c = new Color(),
  round = Math.round,
  clamp = MathUtils.clamp,
  ref = useRef<THREE.Mesh>(null),
  ...props
}: {
  position?: [number, number, number];
  c?: Color;
  round?: (n: number) => number;
  clamp?: (n: number, min: number, max: number) => number;
  ref?: React.MutableRefObject<THREE.Mesh | null>;
  [key: string]: any;
}) => {
  const pos = useRef(position);
  const onDrag = useCallback(
    ({ x, z }) =>
      (pos.current = [
        round(clamp(x, -5, 4)),
        position[1],
        round(clamp(z, -5, 4)),
      ]),
    []
  );
  const [events, active, hovered] = useDrag(onDrag);
  useEffect(
    () =>
      void (document.body.style.cursor = active
        ? "grabbing"
        : hovered
        ? "grab"
        : "auto"),
    [active, hovered]
  );
  useFrame((state, delta) => {
    easing.damp3(ref.current?.position, pos?.current, 0.1, delta);
    easing.dampC(
      ref.current?.material.color,
      active ? "white" : hovered ? "lightblue" : c,
      0.1,
      delta
    );
  });
  return (
    <mesh ref={ref} castShadow receiveShadow {...events} {...props}>
      <sphereGeometry args={[0.5]} />
      <meshStandardMaterial />
    </mesh>
  );
};

export default function App() {
  const cube1Ref = useRef<THREE.Mesh>(null);

  useEffect(() => {
    console.log(
      cube1Ref.current?.position.x,
      cube1Ref.current?.position.y,
      cube1Ref.current?.position.z
    );
  }, [
    cube1Ref.current?.position.x,
    cube1Ref.current?.position.y,
    cube1Ref.current?.position.z,
  ]);

  return (
    <div className="w-[100%] h-[100vh]">
      <Canvas shadows orthographic camera={{ position: [5, 5, 5], zoom: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, -5]} castShadow shadow-mapSize={1024} />
        <Grid scale={10}>
          <Cube ref={cube1Ref} position={[0, 0.5, 1]} c={new Color(0xff0000)} />
          <Cube position={[2, 0.5, 1]} c={new Color(0x0000ff)} />
          <Cube position={[-2, 0.5, 1]} c={new Color(0x00ff00)} />
        </Grid>
        <OrbitControls makeDefault />
        {/* <axesHelper args={[5]} /> */}
      </Canvas>
    </div>
  );
}
