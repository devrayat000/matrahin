"use client";

import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { forwardRef, useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { Color, MathUtils } from "three";
import { useDrag } from "./DragContext";
import { vec } from "./store";
const Sphere = forwardRef<
  THREE.Mesh,
  {
    position?: [number, number, number];
    c?: Color;
    radius?: number;
    round?: (n: number) => number;
    clamp?: (n: number, min: number, max: number) => number;
    [key: string]: any;
  }
>(
  (
    {
      position = [1, 1, -1],
      c = new Color(),
      radius = 1,
      round = Math.round,
      clamp = MathUtils.clamp,
      ...props
    },
    ref
  ) => {
    const pos = useRef(position);

    // clamp the position of the cube to the grid on Dragging
    const onDrag = useCallback(
      ({ x, z }) =>
        (pos.current = [clamp(x, -20, 20), position[1], clamp(z, -20, 20)]),
      []
    );

    // get the events, active and hovered states from the useDrag hook
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
      easing.damp3(ref?.current.position, pos?.current, 0.1, delta);
      easing.dampC(
        ref?.current?.material.color,
        active ? "white" : hovered ? "lightblue" : c,
        0.1,
        delta
      );
    });
    return (
      <mesh ref={ref} castShadow receiveShadow {...events} {...props}>
        <sphereGeometry
          args={[radius]}
          boundingSphere={new THREE.Sphere(vec.clone().set(0, 0, 0), radius)}
        />
        <meshStandardMaterial />
      </mesh>
    );
  }
);

export default Sphere;
