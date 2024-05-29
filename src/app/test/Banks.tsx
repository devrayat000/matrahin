import { useAtomValue } from "jotai";
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
  return (
    <group>
      <mesh
        position-z={-riverWidth / 2 - 10}
        rotation-x={-Math.PI / 2}
        position-y={0.5}
      >
        <boxGeometry args={[1000, 20, 2]} />
        {/* <meshStandardMaterial
          map={textureColor}
          normalMap={textureNormal}
          normalScale={new Vector2(2, 2)}
          roughness={1}
          roughnessMap={textureRoughness}
          aoMap={textureAmbientOcclusion}
          aoMapIntensity={1}
        /> */}
        <meshStandardMaterial color="green" />
      </mesh>
      <mesh
        position-z={riverWidth / 2 + 10}
        rotation-x={-Math.PI / 2}
        position-y={0.5}
      >
        <boxGeometry args={[1000, 20, 2]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </group>
  );
};

export default Banks;
