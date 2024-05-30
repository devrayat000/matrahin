import { useGLTF } from "@react-three/drei";
import { useAtomValue } from "jotai";
import { MathUtils } from "three";
import { RiverWidthAtom } from "./store";

const Banks = () => {
  const riverWidth = useAtomValue(RiverWidthAtom);
  // const textureColor = useTexture("/paving_color.jpg");
  // textureColor.wrapS = textureColor.wrapT = RepeatWrapping;
  // textureColor.repeat.set(1000, 1000);

  // const textureNormal = useTexture("/paving_normal.jpg");
  // textureNormal.wrapS = textureNormal.wrapT = RepeatWrapping;
  // textureNormal.repeat.set(1000, 1000);

  // const textureRoughness = useTexture("/paving_roughness.jpg");
  // textureRoughness.wrapS = textureRoughness.wrapT = RepeatWrapping;
  // textureRoughness.repeat.set(1000, 1000);

  // const textureAmbientOcclusion = useTexture("/paving_ambient_occlusion.jpg");
  // textureAmbientOcclusion.wrapS = textureAmbientOcclusion.wrapT =
  //   RepeatWrapping;
  // textureAmbientOcclusion.repeat.set(1000, 1000);

  // Credit: https://market.pmnd.rs/model/low-poly-tree
  const { scene: polyTreeScene } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-tree/model.gltf"
  );

  const { scene: basicTreeScene } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-big/model.gltf"
  );

  // const { scene: houseScene } = useGLTF(
  //   "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/house-6/model.gltf"
  // );

  const { scene: flagScene } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/flag/model.gltf"
  );

  const bankWidth = 100;

  return (
    <group>
      <mesh
        position-z={-riverWidth / 2 - bankWidth / 2}
        rotation-x={-Math.PI / 2}
        position-y={0.5}
      >
        <boxGeometry args={[20 * riverWidth, bankWidth, 2]} />
        <meshStandardMaterial color="green" />
      </mesh>
      <mesh
        position-z={riverWidth / 2 + bankWidth / 2}
        rotation-x={-Math.PI / 2}
        position-y={0.5}
      >
        <boxGeometry args={[20 * riverWidth, bankWidth, 2]} />
        <meshStandardMaterial color="green" />
      </mesh>

      {Array.from({ length: 100 }, (_, i) => (
        <primitive
          object={basicTreeScene.clone()}
          key={i}
          position-x={MathUtils.randFloatSpread(20 * riverWidth)}
          position-z={
            (-1) ** MathUtils.randInt(1, 2) *
            MathUtils.randFloat(riverWidth / 2, riverWidth / 2 + bankWidth)
          }
          position-y={0.5}
          scale={Math.random() * 30 + 2}
        />
      ))}
      {Array.from({ length: 200 }, (_, i) => (
        <primitive
          object={polyTreeScene.clone()}
          key={i}
          position-x={MathUtils.randFloatSpread(20 * riverWidth)}
          position-z={
            (-1) ** MathUtils.randInt(1, 2) *
            MathUtils.randFloat(riverWidth / 2, riverWidth / 2 + bankWidth)
          }
          position-y={0.5}
          scale={Math.random() * 20 + 2}
        />
      ))}
      <primitive
        object={flagScene.clone()}
        position={[0, 0.5, -riverWidth / 2]}
        scale={10}
      />
      <primitive
        object={flagScene.clone()}
        position={[0, 0.5, riverWidth / 2]}
        scale={10}
      />

      {/* {Array.from({ length: 20 }, (_, i) => (
        <primitive
          object={houseScene.clone()}
          key={i}
          position-x={MathUtils.randFloatSpread(20 * riverWidth)}
          position-z={
            (-1) ** MathUtils.randInt(1, 2) *
            MathUtils.randFloat(riverWidth / 2, riverWidth / 2 + bankWidth)
          }
          position-y={0.5}
          scale={Math.random() * 20 + 2}
        />
      ))} */}
    </group>
  );
};

export default Banks;

useGLTF.preload(
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-big/model.gltf"
);
useGLTF.preload(
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-tree/model.gltf"
);
useGLTF.preload(
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/flag/model.gltf"
);
