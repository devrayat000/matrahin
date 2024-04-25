"use client";

import { useAtomValue } from "jotai";
import {
  MutableRefObject,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
import * as THREE from "three";
import { Color, MathUtils } from "three";
import { TIME_STEP } from "~/components/common/CanvasTHREE/store";
import { useDrag } from "./DragContext";
import { collisionTypeAtom, vec } from "./store";
import { updateArrows } from "./utils";
const Sphere = forwardRef<
  THREE.Mesh,
  {
    arrowRef: MutableRefObject<THREE.ArrowHelper>;
    position?: [number, number, number];
    c?: Color;
    radius?: number;
    round?: (n: number) => number;
    clamp?: (n: number, min: number, max: number) => number;
    updateInputsFromMouseDrag: (
      index: number,
      x: number,
      y: number,
      collisionType: "elastic" | "inelastic"
    ) => void;
    index: number;
    [key: string]: any;
  }
>(
  (
    {
      arrowRef,
      position = [1, 1, -1],
      c = new Color(),
      radius = 1,
      round = Math.round,
      clamp = MathUtils.clamp,
      updateInputsFromMouseDrag,
      index,
      ...props
    },
    ref
  ) => {
    const pos = useRef(position);
    const collisionType = useAtomValue(collisionTypeAtom);

    // clamp the position of the cube to the grid on Dragging
    const onDrag = useCallback(
      ({ x, z }) => {
        pos.current = [
          Math.round(clamp(x, -50, 50)),
          position[1],
          Math.round(clamp(z, -50, 50)),
        ];
        // easing.damp3(
        //   ref?.current.position,
        //   pos.current,
        //   1,
        //   0.01
        // );
        // no need of easing here
        ref?.current.position.set(...pos.current);

        // update the inputs from the mouse drag
        updateInputsFromMouseDrag(
          index,
          pos.current[2],
          -pos.current[0],
          collisionType
        );
        updateArrows(ref?.current, arrowRef?.current, {
          x: -pos.current?.[2] * TIME_STEP,
          y: -pos.current?.[0] * TIME_STEP,
        });
      },
      [collisionType]
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
        <meshStandardMaterial color={c} />
        {/* <BBAnchor anchor={[-1, 0.5, -0.5]}>
          <Html
            transform
            occlude
            position={[-0.01, 1, 0]}
            rotation-y={-Math.PI / 2}
            style={{
              letterSpacing: "0.1em",
              fontSize: "2em",
              fontFamily: "consolas",
              userSelect: "none",
            }}
            className="text-white absolute rounded-md  bg-black p-1 px-2"
          >
            {index + 1}
          </Html>
        </BBAnchor> */}
      </mesh>
    );
  }
);

export default Sphere;
