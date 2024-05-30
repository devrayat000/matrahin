import { Gltf } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAtomValue } from "jotai";
import { useMemo, useRef } from "react";
import { Object3D, Object3DEventMap, Vector3 } from "three";
import { RiverWidthAtom, VelocityAtom } from "./store";

const vec = new Vector3(0, 0, 0);
const Boat = ({
  cameraFixed,
  offset,
  lookAtBoat = true,
}: {
  cameraFixed: boolean;
  offset?: THREE.Vector3;
  lookAtBoat?: boolean;
}) => {
  const boatRef = useRef<Object3D<Object3DEventMap>>(null);

  const riverWidth = useAtomValue(RiverWidthAtom);
  const { boatAngle, boatValue, river } = useAtomValue(VelocityAtom);
  const vz = useMemo(
    () => -0.025 * boatValue * Math.sin((boatAngle * Math.PI) / 180),
    [boatValue, boatAngle]
  );
  const vx = useMemo(
    () => 0.025 * (river + boatValue * Math.cos((boatAngle * Math.PI) / 180)),
    [boatValue, boatAngle, river]
  );

  console.log(-vz / 0.025, vx / 0.025);

  useFrame(({ camera, clock }) => {
    const gltf = boatRef.current;

    if (gltf) {
      if (gltf.position.z <= -riverWidth / 2 + 15) {
        gltf.position.z = -riverWidth / 2 + 15;
      } else {
        gltf.position.z += vz;
        gltf.position.x += vx;
      }
      const elapsedTime = clock.elapsedTime;
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
      if (lookAtBoat) camera.lookAt(currentLookAt);
      if (lookAtBoat && cameraFixed) {
        // camera zoom to boat
        camera.zoom = currentLookAt.distanceTo(camera.position) / 10;
      }
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
      rotation-y={-((90 - boatAngle) * Math.PI) / 180}
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
