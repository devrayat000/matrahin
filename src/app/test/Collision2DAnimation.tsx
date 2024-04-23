import {
  ContactShadows,
  Grid,
  Loader,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { Suspense, useCallback, useEffect, useRef } from "react";
import colors from "~/components/common/CanvasTHREE/colors";
import { TIME_STEP } from "~/components/common/CanvasTHREE/store";
import { XTicks } from "~/components/common/CanvasTHREE/xTicks";
import { checkCollision } from "../collision/utils";
import { DragContext } from "./DragContext";
import Sphere from "./Sphere";
import { PLAYING_STATES, playingAtom, twoDCollisionInputsAtom } from "./store";
import { getUpdatedV, updateArrows } from "./utils";

const MainContent = () => {
  const sphereRef1 = useRef<THREE.Mesh>(null);
  const sphereRef2 = useRef<THREE.Mesh>(null);
  const arrowRef1 = useRef<THREE.ArrowHelper>(null);
  const arrowRef2 = useRef<THREE.ArrowHelper>(null);

  const [values, setValues] = useAtom(twoDCollisionInputsAtom);

  const u1 = useRef({
    x: values[0].V.i.x * TIME_STEP,
    y: values[0].V.i.y * TIME_STEP,
  });
  const u2 = useRef({
    x: values[1].V.i.x * TIME_STEP,
    y: values[1].V.i.y * TIME_STEP,
  });

  const [playing, setPlaying] = useAtom(playingAtom);

  const reset = useCallback(() => {
    setPlaying(PLAYING_STATES.PAUSE);
    u1.current = {
      x: values[0].V.i.x * TIME_STEP,
      y: values[0].V.i.y * TIME_STEP,
    };
    u2.current = {
      x: values[1].V.i.x * TIME_STEP,
      y: values[1].V.i.y * TIME_STEP,
    };
    const obj1 = sphereRef1.current!;
    const obj2 = sphereRef2.current!;
    const arrow1 = arrowRef1.current!;
    const arrow2 = arrowRef2.current!;
    obj1.position.set(-values[0].V.i.y, 1, -values[0].V.i.x);
    obj2.position.set(-values[1].V.i.y, 1, -values[1].V.i.x);

    updateArrows(obj1, arrow1, u1.current);
    updateArrows(obj2, arrow2, u2.current);
  }, [values]);

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    reset();
  }, [values[0].V, values[1].V]);

  useEffect(() => {
    if (playing === PLAYING_STATES.RESET) {
      reset();
    }
  }, [playing]);
  useFrame(() => {
    if (playing !== PLAYING_STATES.PLAY) return;
    const obj1 = sphereRef1.current!;
    const obj2 = sphereRef2.current!;
    const arrow1 = arrowRef1.current!;
    const arrow2 = arrowRef2.current!;

    if (!obj1 || !obj2 || !arrow1 || !arrow2) return;

    if (checkCollision(obj1, obj2)) {
      const v1 = { x: values[0].V.f.x, y: values[0].V.f.y };
      const v2 = { x: values[1].V.f.x, y: values[1].V.f.y };
      u1.current = { x: v1.x * TIME_STEP, y: v1.y * TIME_STEP };
      u2.current = { x: v2.x * TIME_STEP, y: v2.y * TIME_STEP };
    }

    if (
      obj1.position.z > 21 ||
      obj1.position.z < -21 ||
      obj1.position.x > 21 ||
      obj1.position.x < -21
    ) {
      reset();
      return;
    }

    obj1.position.z += u1.current.x;
    obj1.position.x += u1.current.y;
    obj2.position.z += u2.current.x;
    obj2.position.x += u2.current.y;

    updateArrows(obj1, arrow1, u1.current);
    updateArrows(obj2, arrow2, u2.current);
  });

  const updateInputsFromMouseDrag = (index: number, x: number, y: number) => {
    setValues((prev) => {
      const newValues = [...prev];

      newValues[index].V.i.x = -x;
      newValues[index].V.i.y = y;

      const { v1, v2 } = getUpdatedV(
        newValues[0].M,
        newValues[1].M,
        newValues[0].V.i,
        newValues[1].V.i
      );

      newValues[0].V.f = { ...v1 };
      newValues[1].V.f = { ...v2 };
      newValues[index] = {
        ...prev[index],
        V: {
          ...prev[index].V,
          i: {
            x: -x,
            y: y,
          },
        },
      };
      // console.log(
      //   0,
      //   newValues[0].V.i.x,
      //   newValues[0].V.i.y,
      //   newValues[0].V.f.x,
      //   newValues[0].V.f.y
      // );
      // console.log(
      //   1,
      //   newValues[1].V.i.x,
      //   newValues[1].V.i.y,
      //   newValues[1].V.f.x,
      //   newValues[1].V.f.y
      // );
      return newValues;
    });
  };

  return (
    <DragContext>
      <arrowHelper ref={arrowRef1} />
      <arrowHelper ref={arrowRef2} />
      <Sphere
        arrowRef={arrowRef1}
        ref={sphereRef1}
        c={colors[0]}
        updateInputsFromMouseDrag={updateInputsFromMouseDrag}
        index={0}
      />
      <Sphere
        arrowRef={arrowRef2}
        ref={sphereRef2}
        c={colors[2]}
        updateInputsFromMouseDrag={updateInputsFromMouseDrag}
        index={1}
      />
    </DragContext>
  );
};

const Collision2DAnimation = () => {
  return (
    <div className="w-full h-full ">
      <Suspense fallback={<Loader />}>
        <Canvas shadows style={{ contain: "layout" }}>
          {/* <axesHelper args={[20]} /> */}
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
            // enablePan={false}
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
