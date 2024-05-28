import { useAtomValue } from "jotai";
import { RiverWidthAtom } from "./store";

const Banks = () => {
  const riverWidth = useAtomValue(RiverWidthAtom);
  return (
    <group>
      <mesh
        position-z={-riverWidth / 2 - 10}
        rotation-x={-Math.PI / 2}
        position-y={0.5}
      >
        <boxGeometry args={[1000, 20, 2]} />
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
