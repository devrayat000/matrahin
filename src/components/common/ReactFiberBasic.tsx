import { Html, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const axisLength = 10;
const AxesNotation = () => (
  <>
    {/* Labels for X, Y, Z axes */}
    <Html position={[axisLength / 2, 0, 0]}>
      <div style={{ color: "#553311" }}>X</div>
    </Html>

    <Html position={[0, axisLength / 2, 0]}>
      <div style={{ color: "#004411" }}>Y</div>
    </Html>

    <Html position={[0, 0, axisLength / 2]}>
      <div style={{ color: "#000000" }}>Z</div>
    </Html>
  </>
);
const ReactFiberBasic = ({ children }: { children: React.ReactNode }) => {
  return (
    <Canvas>
      <color attach="background" args={["#dddddd"]} />
      <PerspectiveCamera
        makeDefault
        position={[30, 10, 30]}
        fov={10}
        near={1}
        far={5000}
      />
      <OrbitControls />
      {children}
      <directionalLight position={[100, 100, 0]} intensity={5} />
      <directionalLight position={[100, -100, 0]} intensity={5} />
      {/* <directionalLight position={[1, 0, 0]} intensity={0.5} /> */}
      <ambientLight position={[5, 5, 5]} intensity={1} />
      <axesHelper args={[10]} />
      <AxesNotation />
    </Canvas>
  );
};

export default ReactFiberBasic;
