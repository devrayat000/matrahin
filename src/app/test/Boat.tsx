import { Gltf } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAtomValue } from "jotai";
import { useRef } from "react";
import { Object3D, Object3DEventMap, Vector3 } from "three";
import { RiverWidthAtom } from "./store";

const vec = new Vector3(0, 0, 0);
const Boat = ({
  cameraFixed,
  offset,
}: {
  cameraFixed: boolean;
  offset?: THREE.Vector3;
}) => {
  const boatRef = useRef<Object3D<Object3DEventMap>>(null);

  const riverWidth = useAtomValue(RiverWidthAtom);
  useFrame(({ camera, clock }) => {
    const gltf = boatRef.current;
    if (gltf) {
      const elapsedTime = clock.elapsedTime;
      gltf.translateZ(-0.3);
      // gltf.translateX(-0.1);
      // if (cameraFixed) return;
      const idealLookat = vec.clone();
      idealLookat.applyQuaternion(gltf.quaternion);
      idealLookat.add(gltf.position);

      const idealOffset = offset?.clone() || vec.clone();
      idealOffset.applyQuaternion(gltf.quaternion);
      idealOffset.add(gltf.position);

      const t = 1.0 - Math.pow(0.001, elapsedTime);

      const currentPosition = vec.clone().lerp(idealOffset, t);
      const currentLookAt = vec.clone().lerp(idealLookat, t);
      if (!cameraFixed) camera.position.copy(currentPosition);
      camera.lookAt(currentLookAt);
    }
  });
  return (
    <Gltf
      ref={boatRef}
      src="/punter.glb"
      scale={0.05}
      position-y={0.95}
      position-z={riverWidth / 2 - 15}
      receiveShadow
      castShadow
    />
  );
};
export default Boat;

/**
 *
 * credit: https://github.com/simondevyoutube/ThreeJS_Tutorial_ThirdPersonCamera/blob/main/main.js
 *
 *
 */
