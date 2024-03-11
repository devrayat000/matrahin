import { END_OF_ROAD } from "./store";

const WallsAtEndOfRoad = () => {
  return (
    <group>
      <mesh position={[0, 2.5, END_OF_ROAD]}>
        <boxGeometry args={[25, 5, 0.1]} />
        <meshBasicMaterial color="cadetblue" />
      </mesh>
      <mesh position={[0, 2.5, -END_OF_ROAD]}>
        <boxGeometry args={[25, 5, 0.1]} />
        <meshBasicMaterial color="cadetblue" />
      </mesh>
    </group>
  );
};

export default WallsAtEndOfRoad;
