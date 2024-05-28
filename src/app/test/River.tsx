import {
  Object3DNode,
  extend,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import { useAtomValue } from "jotai";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { Water } from "three/examples/jsm/objects/Water.js";
import { RiverWidthAtom } from "./store";
extend({ Water });
declare global {
  namespace JSX {
    interface IntrinsicElements {
      water: Object3DNode<Water, typeof Water>;
    }
  }
}

function Ocean() {
  const riverWidth = useAtomValue(RiverWidthAtom);
  const ref = useRef();
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(
    THREE.TextureLoader,
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/waternormals.jpg"
  );

  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  const geom = useMemo(() => new THREE.PlaneGeometry(1000, riverWidth), []);
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x0f5e9c,
      distortionScale: 3.7,
      // size: 5,
      fog: true,
      format: gl.encoding,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [waterNormals]
  );
  useFrame((state, delta) => {
    const material = ref?.current?.material as THREE.ShaderMaterial;
    material.uniforms.time.value -= delta;
  });
  return (
    <water
      ref={ref}
      args={[geom, config]}
      rotation-x={-Math.PI / 2}
      position={[0, 0, 0]}
    />
  );
}

export default Ocean;

/**
 * https://stackoverflow.com/questions/67611934/how-to-create-water-in-react-three-fiber
 */
