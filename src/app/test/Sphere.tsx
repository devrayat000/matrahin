"use client";

import { useAtomValue } from "jotai";
import { forwardRef, useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { Color, MathUtils } from "three";
import { useDrag } from "./DragContext";
import { playingAtom, vec } from "./store";
import { easing } from "maath";
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

    const playing = useAtomValue(playingAtom);
    // clamp the position of the cube to the grid on Dragging
    const onDrag = useCallback(({ x, z }) => {
      pos.current = [clamp(x, -20, 20), position[1], clamp(z, -20, 20)];
      easing.damp3(
        ref?.current.position,
        [clamp(x, -20, 20), position[1], clamp(z, -20, 20)],
        0.1,
        0.01
      );
    }, []);

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
    // useFrame((state, delta) => {
    //   if (playing) return;
    //   console.log("in SPhere");
    //   easing.damp3(ref?.current.position, pos?.current, 0.1, delta);
    //   easing.dampC(
    //     ref?.current?.material.color,
    //     active ? "white" : hovered ? "lightblue" : c,
    //     0.1,
    //     delta
    //   );
    // });
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
