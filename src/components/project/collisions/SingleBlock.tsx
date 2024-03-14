import { BBAnchor, Html } from "@react-three/drei";
import { MeshProps } from "@react-three/fiber";
import { ForwardedRef, forwardRef, memo } from "react";
import * as THREE from "three";
import colors from "~/app/collision/colors";
import { getDefaultPositionOfBox, vec } from "~/app/collision/utils";
import { BOX_SIZE } from "./store";

interface SingleBlockProps extends MeshProps {
  count: number;
  size?: number;
}

const SingleBlock = memo(
  forwardRef(
    (
      { count, size = BOX_SIZE }: SingleBlockProps,
      ref: ForwardedRef<THREE.Mesh>
    ) => {
      return (
        <mesh
          castShadow
          ref={ref}
          position={getDefaultPositionOfBox(size, count)}
        >
          {/* <boxGeometry args={[size, size, size]} /> */}
          <sphereGeometry
            args={[size / 2]}
            boundingSphere={
              new THREE.Sphere(vec.clone().set(0, 0, 0), size / 2)
            }
          />
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

          {/* <arrowHelper
            args={[
              new THREE.Vector3(0, 0, 1),
              new THREE.Vector3(0, size / 2, 0),
              6,
              colors[count - 1],
            ]}
          /> */}
        </mesh>
      );
    }
  )
);

export default SingleBlock;
