import { BBAnchor, Html } from "@react-three/drei";
import { MeshProps } from "@react-three/fiber";
import { ForwardedRef, forwardRef } from "react";
import * as THREE from "three";
import colors from "~/app/collision/colors";
import { BOX_SIZE } from "./store";

interface SingleBlockProps extends MeshProps {
  count: number;
  size?: number;
}

const SingleBlock = forwardRef(
  (
    { count, size = BOX_SIZE }: SingleBlockProps,
    ref: ForwardedRef<THREE.Mesh>
  ) => {
    return (
      <mesh
        castShadow
        ref={ref}
        position={[0, size / 2, 10 * (count % 2 === 0 ? -1 : 1)]}
      >
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color={colors[count - 1]} />

        <BBAnchor anchor={[-1, 0.5, -0.5]}>
          <Html
            transform
            occlude
            position={[-0.01, 0, 0]}
            rotation-y={-Math.PI / 2}
            style={{
              letterSpacing: "0.1em",
              fontSize: "2em",
              fontFamily: "consolas",
              userSelect: "none",
            }}
            className="text-white absolute rounded-md  bg-black p-1 px-2"
          >
            M<sub>{count}</sub>
          </Html>
        </BBAnchor>
      </mesh>
    );
  }
);

export default SingleBlock;
