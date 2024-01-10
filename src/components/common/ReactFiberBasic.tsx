import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
const ReactFiberBasic = ({ children }) => {
  return (
    <Canvas>
      <color attach="background" args={["#444444"]} />
      <PerspectiveCamera
        makeDefault
        position={[30, 10, 30]}
        fov={10}
        near={1}
        far={1000}
      />
      <OrbitControls />
      {children}
      <directionalLight position={[0, 10, 0]} intensity={1} />
      <directionalLight position={[1, 0, 0]} intensity={0.5} />
      <ambientLight position={[5, 5, 5]} intensity={0.25} />
      <axesHelper args={[50]} />
    </Canvas>
  );
};

export default ReactFiberBasic;
