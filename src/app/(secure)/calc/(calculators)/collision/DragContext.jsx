import { useFrame, useThree } from "@react-three/fiber";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Plane, Vector3 } from "three";

const v = new Vector3();
const p = new Plane(new Vector3(0, 1, 0), 0);
const context = createContext();

function useDrag(onDrag) {
  const controls = useThree((state) => state.controls);
  const activatePlane = useContext(context);
  const [hovered, hover] = useState(false);
  const [active, activate] = useState(false);
  const out = useCallback(() => hover(false), []);
  const over = useCallback((e) => (e.stopPropagation(), hover(true)), []);

  const down = useCallback(
    (e) => {
      e.stopPropagation();
      activate(true);
      activatePlane(true);
      if (controls) controls.enabled = false;
      e.target.setPointerCapture(e.pointerId);
    },
    [controls]
  );

  const up = useCallback(
    (e) => {
      activate(false);
      activatePlane(false);
      if (controls) controls.enabled = true;
      e.target.releasePointerCapture(e.pointerId);
    },
    [controls]
  );

  const move = useCallback(
    (e) => {
      e.stopPropagation();
      if (active && e.ray.intersectPlane(p, v)) onDrag(v);
    },
    [onDrag, active]
  );
  return [
    {
      onPointerOver: over,
      onPointerOut: out,
      onPointerDown: down,
      onPointerUp: up,
      onPointerMove: move,
    },
    active,
    hovered,
  ];
}

function Grid({ children, ...props }) {
  const grid = useRef();
  const [active, activate] = useState(false);
  // useFrame((state, delta) => {
    // easing.damp(grid.current.material, "opacity", active ? 1 : 0.9, 0.1, delta);
  //   // easing.damp(plane.current.material, 'opacity', active ? 1 : 0.25, 0.1, delta)
  //   // <mesh receiveShadow ref={plane}  rotation-x={-Math.PI / 2}>
  //   //       <planeGeometry />
  //   //       <meshStandardMaterial transparent color="lightblue" polygonOffset polygonOffsetUnits={1} polygonOffsetFactor={1} />
  //   //     </mesh>
  //   // <group scale={scale}>
  //   //     <gridHelper ref={grid} args={[divisions, divisions, "#888", "#bbb"]} />
  //   //   </group>
  // });
  return (
    <group {...props}>
      
      <context.Provider value={activate}>{children}</context.Provider>
    </group>
  );
}

export { Grid as DragContext, useDrag };

