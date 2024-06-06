// src/VectorField.js
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { getColorForDirection } from "./colorutils";

export interface ArrowType {
  origin: THREE.Vector3;
  dir: THREE.Vector3;
  length: number;
  color: number;
}

const vec = new THREE.Vector3();
const vec3 = new THREE.Vector3();
const VectorField = () => {
  const gridSize = 2;
  const spacing = 0.3;

  const vectorField = (x, y, z) => {
    return vec3.clone().set(y, x, z);
  };

  const arrows: ArrowType[] = [];
  for (let x = -gridSize; x <= gridSize; x += spacing) {
    for (let y = -gridSize; y <= gridSize; y += spacing) {
      for (let z = -gridSize; z <= gridSize; z += spacing) {
        const origin = vec3.clone().set(x, y, z);
        const dir = vectorField(x, y, z).normalize();
        const length = vectorField(x, y, z).length() / gridSize;
        const color = getColorForDirection(dir);

        arrows.push({ origin, dir, length, color });
      }
    }
  }

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <OrbitControls />
      {arrows.map(({ origin, dir, length, color }, index) => (
        // <ArrowHelper
        //   key={index}
        //   origin={origin}
        //   dir={dir}
        //   length={length}
        //   color={color}
        // />
        <arrowHelper
          key={index}
          args={[
            vec.clone().set(dir.x, dir.y, dir.z),
            vec.clone().set(origin.x, origin.y, dir.z),
            length,
            color,
            length / 3,
          ]}
        />
      ))}
      <gridHelper
        args={[gridSize * 2, gridSize * 6]}
        rotation-x={-Math.PI / 2}
      />
    </Canvas>
  );
};

export default VectorField;
