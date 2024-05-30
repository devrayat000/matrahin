import { Float, Sky } from "@react-three/drei";
import { Color } from "three";
import Banks from "./Banks";
import Ocean from "./Ocean";

const OceanScene = () => {
  return (
    <group>
      <ambientLight intensity={0.9} />
      <Ocean />
      <Float
        position={[0, 0, 0]}
        scale={2}
        speed={1}
        rotationIntensity={1}
        floatIntensity={1}
        floatingRange={[1, 4]}
      >
        <boxGeometry args={[4, 4, 4]} />
        <meshStandardMaterial color="blue" />
      </Float>
      <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0}
        azimuth={0.25}
        turbidity={10}
        rayleigh={2}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      <Banks />
      <hemisphereLight
        args={[new Color(0xdddddd), new Color(0x00ffaa), 3]}
        position={[0, 5, 0]}
      />
    </group>
  );
};

export default OceanScene;
