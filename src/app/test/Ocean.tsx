import {
  Object3DNode,
  extend,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import { useAtomValue } from "jotai";
import { useEffect, useMemo, useRef } from "react";

import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  MathUtils,
  PlaneGeometry,
  Points,
  PointsMaterial,
  RepeatWrapping,
  ShaderMaterial,
  TextureLoader,
  Vector3,
} from "three";
import { Water } from "three/examples/jsm/objects/Water.js";
import { RiverWidthAtom, VelocityAtom } from "./store";
extend({ Water });
declare global {
  namespace JSX {
    interface IntrinsicElements {
      water: Object3DNode<Water, typeof Water>;
    }
  }
}

const vector = new Vector3(0, -1, 0);
function Ocean() {
  const objectRef = useRef<Points>();
  const groupRef = useRef<Group>();
  const riverWidth = useAtomValue(RiverWidthAtom);
  const { river: riverVelocity } = useAtomValue(VelocityAtom);
  const numObjects = useMemo(() => riverWidth ** 1.2, [riverWidth]);

  const ref = useRef();
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(
    TextureLoader,
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/waternormals.jpg"
  );

  waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping;
  const geom = useMemo(
    () => new PlaneGeometry(20 * riverWidth, riverWidth),
    [riverWidth]
  );
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x0f5e9c,
      distortionScale: 1 - riverVelocity / 20,
      // size: 5,
      fog: true,
      format: gl.encoding,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [waterNormals, riverVelocity]
  );
  // const { scene: plantScene } = useGLTF(
  //   "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/plant-pirate-kit/model.gltf"
  // );
  useEffect(() => {
    const material = ref?.current?.material as ShaderMaterial;
    material.uniforms.distortionScale.value = riverVelocity / 20;

    let objects = new BufferGeometry();
    const points = [];
    for (let i = 0; i < numObjects; i++) {
      points.push(
        vector
          .clone()
          .set(
            MathUtils.randFloatSpread(20 * riverWidth),
            MathUtils.randFloat(0.5, 1),
            MathUtils.randFloatSpread(riverWidth)
          )
      );
    }
    objects.setAttribute("position", new Float32BufferAttribute(points, 3));
    objects.setFromPoints(points);
    const objectMaterial = new PointsMaterial({
      color: 0x00af00,
      clipShadows: true,
      size: 3, // Adjust the size as needed
      transparent: false,
      opacity: 2,
      depthWrite: true,
      blending: AdditiveBlending,
    });

    const point = new Points(objects, objectMaterial);

    objectRef.current = point;
    groupRef?.current.add(point);
    // groupRef.current.add(plantScene);
  }, []);

  useFrame((state, delta) => {
    const material = ref?.current?.material as ShaderMaterial;
    material.uniforms.time.value -= delta;

    if (objectRef.current) {
      const positions = objectRef.current.geometry.attributes.position
        .array as Float32Array;
      for (var i = 0; i < numObjects; i++) {
        const v = vector
          .clone()
          .set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
        v.add(
          vector
            .clone()
            .set(riverVelocity * 0.6, 0, 0)
            .multiplyScalar(delta)
        );

        if (Math.abs(v.x) > 20 * riverWidth) {
          v.x = MathUtils.randFloatSpread(10 * riverWidth);
        }

        positions[i * 3] = v.x;
        positions[i * 3 + 1] = v.y;
        positions[i * 3 + 2] = v.z;
      }
      objectRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <water
        ref={ref}
        args={[geom, config]}
        rotation-x={-Math.PI / 2}
        position={[0, 0, 0]}
      />
    </group>
  );
}

export default Ocean;

/**
 * https://stackoverflow.com/questions/67611934/how-to-create-water-in-react-three-fiber
 */
