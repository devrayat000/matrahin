import {
  ContactShadows,
  Grid,
  Loader,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Vector3 } from "three";
import colors from "~/components/common/CanvasTHREE/colors";
import { XTicks } from "~/components/common/CanvasTHREE/xTicks";
import { DragContext } from "./DragContext";
import Sphere from "./Sphere";
const MainContent = () => {
  const sphereRef1 = useRef<THREE.Mesh>(null);
  const sphereRef2 = useRef<THREE.Mesh>(null);
  return (
    <DragContext>
      <Sphere ref={sphereRef1} position={[10, 1, 10]} c={colors[0]} />
      <Sphere ref={sphereRef2} position={[20, 1, 10]} c={colors[1]} />
    </DragContext>
  );
};

const Collision2DAnimation = () => {
  return (
    <div className="w-full h-full ">
      <Suspense fallback={<Loader />}>
        <Canvas shadows style={{ contain: "layout" }}>
          <color attach="background" args={["#303035"]} />

          <Lights />
          <Grid
            receiveShadow
            side={2}
            args={[40, 40]}
            cellSize={5}
            sectionSize={10}
            cellColor={"#6f6f6f"}
            sectionColor={"#aaa"}
            cellThickness={1}
            fadeDistance={150}
          />

          <PerspectiveCamera makeDefault position={[-30, 10, 0]} fov={45} />
          {/* <OrthographicCamera makeDefault position={[0, 10, 0]} zoom={10} /> */}
          <ContactShadows
            blur={2}
            far={10}
            opacity={1}
            position={[0, 0, 0]}
            resolution={1024}
            scale={100}
          />

          <XTicks length={25} />

          <OrbitControls
            // enableRotate={false}
            enableDamping={false}
            enablePan={false}
            makeDefault
          />
          <Suspense fallback="loading...">
            <MainContent />
          </Suspense>
        </Canvas>
      </Suspense>
    </div>
  );
};

const Lights = () => (
  <>
    <directionalLight position={[-5, 10, 0]} intensity={1} castShadow />
    <directionalLight position={[0, 5, 5]} intensity={1} castShadow />
    <directionalLight position={[-5, 5, -5]} intensity={1} castShadow />
    <pointLight position={[0, 10, 0]} intensity={0.1} castShadow />
  </>
);
export default Collision2DAnimation;
