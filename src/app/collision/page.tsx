"use client";

import {
  BBAnchor,
  ContactShadows,
  Grid,
  Html,
  Loader,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAtom, useAtomValue } from "jotai";
import { Maximize, Minimize } from "lucide-react";
import { ForwardedRef, Fragment, Suspense, forwardRef, useRef } from "react";
import * as THREE from "three";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import colors from "./colors";
import {
  BOX_SIZE,
  END_OF_ROAD,
  TIME_STEP,
  fullScreenOnAtom,
  massOneAtom,
  massTwoAtom,
} from "./store";

const calculateVelocityAfterCollision = (
  m1: number,
  v1: number,
  m2: number,
  v2: number
): { v1f: number; v2f: number } => {
  const v1f = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
  const v2f = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
  return { v1f, v2f };
};

// const woodColor = new THREE.TextureLoader().load("/wood_color.jpg");
// const woodTexture = new THREE.TextureLoader().load("/wood_roughness.jpg");
// const marbleColor = new THREE.TextureLoader().load("/marble_color.jpg");
// const marbleTexture = new THREE.TextureLoader().load("/marble_roughness.jpg");

// const colors = [woodColor, marbleColor];
// const roughness = [woodTexture, marbleTexture];

const precision = 1;
const updateText = (
  v: number,
  m: number,
  mText: HTMLParagraphElement,
  vText: HTMLParagraphElement,
  pText: HTMLParagraphElement,
  kEText: HTMLParagraphElement
) => {
  if (vText) vText.innerText = v.toFixed(precision);
  if (mText) mText.innerText = m.toFixed(precision);
  if (pText) pText.innerText = (m * v).toFixed(precision);
  if (kEText) kEText.innerText = (0.5 * m * v * v).toFixed(precision);
};

const updateTotalKE = (totalKE: number, totalKEText: HTMLParagraphElement) => {
  if (totalKEText) totalKEText.innerText = totalKE.toFixed(precision);
};

const updateTotalPE = (totalPE: number, totalPEText: HTMLParagraphElement) => {
  if (totalPEText) totalPEText.innerText = totalPE.toFixed(precision);
};

const BoundingBox = new THREE.Box3();
const vec = new THREE.Vector3();
const updateArrows = (
  arrow: THREE.ArrowHelper,
  mesh: THREE.Mesh,
  v: number
) => {
  arrow.setDirection(vec.set(0, 0, v).normalize());
  arrow.position.setZ(mesh.position.z);

  // hide the arrow if the velocity is 0
  arrow.visible = v !== 0;
};

const SingleBlock = forwardRef(
  (
    {
      count,
    }: {
      count: number;
    },
    ref: ForwardedRef<THREE.Mesh>
  ) => {
    return (
      <mesh
        castShadow
        ref={ref}
        position={[0, 0, 10 * (count % 2 === 0 ? -1 : 1)]}
      >
        <boxGeometry args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]} />
        <meshStandardMaterial
          // map={colors[count - 1]}
          // roughnessMap={roughness[count - 1]}
          // metalness={0.5}
          // roughness={0.8}
          color={colors[count - 1]}
        />

        <BBAnchor anchor={[-1, 0.5, -0.5]}>
          <Html
            transform
            occlude
            position={[-0.01, 0, 0]}
            rotation-y={-Math.PI / 2}
            style={{
              letterSpacing: "0.1em",
              fontSize: "2em",
              fontFamily: "consolas",
              userSelect: "none",
            }}
            className="text-white absolute rounded-md bg-black p-1 px-2"
          >
            M<sub>{count}</sub>
          </Html>
        </BBAnchor>
      </mesh>
    );
  }
);

const Results = ({
  refs, // as m,v,p,kE
  totalKETextRef,
  totalPETextRef,
  updateAllTexts,
}: {
  refs: React.MutableRefObject<HTMLParagraphElement>[][];

  totalKETextRef: React.MutableRefObject<HTMLParagraphElement>;
  totalPETextRef: React.MutableRefObject<HTMLParagraphElement>;
  updateAllTexts: (count: number) => void;
}) => {
  const params = (i: number) => [
    { label: `M`, ref: refs[i - 1][0], unit: "kg" },
    { label: `V`, ref: refs[i - 1][1], unit: "m/s" },
    { label: `P`, ref: refs[i - 1][2], unit: "kgm/s" },
    { label: `KE`, ref: refs[i - 1][3], unit: "J" },
  ];

  return (
    <div
      style={{
        fontFamily: "consolas",
      }}
      className="flex flex-col justify-between items-center   w-full h-full   "
    >
      <div className="flex flex-col justify-between items-start  w-full gap-2 m-1  ">
        {/* Object 1 */}
        <Accordion
          onValueChange={(value) => {
            if (value === "Object 1") updateAllTexts(1);
          }}
          defaultValue="Object 1"
          type="single"
          collapsible={true}
          className=" backdrop-blur-[1px] backdrop-brightness-75 text-white border-none "
        >
          <AccordionItem
            value="Object 1"
            className="px-2 rounded-xl border-2 border-border"
          >
            <AccordionTrigger className="lg:text-xl py-1  font-bold w-full">
              Object 1
            </AccordionTrigger>
            <AccordionContent className="text-xs lg:text-lg">
              {
                params(1).map((param) => (
                  <div
                    key={param.label}
                    className="flex flex-row w-full items-center"
                  >
                    <p className="text-left w-[3ch]">
                      {param.label}
                      <sub>1</sub>
                    </p>
                    :<p className="text-right  w-[8ch]" ref={param.ref}></p>
                    <p className="text-left ml-1">{param.unit}</p>
                  </div>
                )) // m,v,p,KE
              }
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Object 2 */}

        <Accordion
          onValueChange={(value) => {
            if (value === "Object 2") updateAllTexts(2);
          }}
          defaultValue="Object 2"
          type="single"
          collapsible={true}
          className=" backdrop-blur-[1px] backdrop-brightness-75 text-white border-none "
        >
          <AccordionItem
            value="Object 2"
            className="px-2 rounded-xl border-2 border-border"
          >
            <AccordionTrigger className="lg:text-xl py-1  font-bold w-full">
              Object 2
            </AccordionTrigger>
            <AccordionContent className="text-xs lg:text-lg">
              {
                params(2).map((param) => (
                  <div
                    key={param.label}
                    className="flex  flex-row w-full items-center"
                  >
                    <p className="text-left w-[3ch]">
                      {param.label}
                      <sub>2</sub>
                    </p>
                    :<p className="text-right  w-[8ch]" ref={param.ref}></p>
                    <p className="text-left ml-1">{param.unit}</p>
                  </div>
                )) // m,v,p,KE
              }
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {/* Total */}
        <Accordion
          defaultValue="Total"
          type="single"
          collapsible={true}
          className=" backdrop-blur-[1px] backdrop-brightness-75 text-white border-none "
          onValueChange={(value) => {
            if (value === "Total") updateAllTexts(0);
          }}
        >
          <AccordionItem
            value="Total"
            className="px-2 rounded-xl border-2 border-border"
          >
            <AccordionTrigger className="lg:text-xl py-1  font-bold w-full">
              Total
            </AccordionTrigger>
            <AccordionContent className="text-xs lg:text-lg">
              <div className="flex  flex-row w-full items-center">
                <p className="text-left w-[3ch]">KE:</p>
                <p className="text-right  w-[8ch]" ref={totalKETextRef}></p>
                <p className="text-left ml-1">J</p>
              </div>
              <div className="flex  flex-row w-full items-center">
                <p className="text-left w-[3ch]">P:</p>
                <p className="text-right  w-[8ch]" ref={totalPETextRef}></p>
                <p className="text-left ml-1">kgm/s</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

const checkCollision = (
  object1: THREE.Object3D<THREE.Object3DEventMap>,
  object2: THREE.Object3D<THREE.Object3DEventMap>
) => {
  const box1 = BoundingBox.clone();
  const box2 = BoundingBox.clone();
  box1.setFromObject(object1);
  box2.setFromObject(object2);
  return box1.intersectsBox(box2);
};
const Objects = ({
  divRef,
}: {
  divRef: React.MutableRefObject<HTMLDivElement | null>;
}) => {
  const [fullScreenOn, setFullScreenOn] = useAtom(fullScreenOnAtom);
  const m1 = useAtomValue(massOneAtom);
  const m2 = useAtomValue(massTwoAtom);

  const meshRef1: React.MutableRefObject<THREE.Mesh | null> = useRef(null);
  const meshRef2: React.MutableRefObject<THREE.Mesh | null> = useRef(null);
  const v1: React.MutableRefObject<number> = useRef(-5 * TIME_STEP);
  const v2: React.MutableRefObject<number> = useRef(1 * TIME_STEP);

  const arrowRef1: React.MutableRefObject<THREE.ArrowHelper | null> =
    useRef(null);
  const arrowRef2: React.MutableRefObject<THREE.ArrowHelper | null> =
    useRef(null);

  const v1TextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);
  const v2TextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);

  const m1TextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);
  const m2TextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);
  const p1TextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);
  const p2TextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);

  const kE1TextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);
  const kE2TextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);

  const totalKETextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);
  const totalMomentumTextRef: React.MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);

  /**
   * Update the text of the objects, always updates the total KE and momentum
   * @param count 0: update all, 1: update 1, 2: update 2
   */
  const updateAllTexts = (count: number) => {
    if (count == 0 || count == 1) {
      updateText(
        v1.current / TIME_STEP,
        m1,
        m1TextRef.current as HTMLParagraphElement,
        v1TextRef.current as HTMLParagraphElement,
        p1TextRef.current as HTMLParagraphElement,
        kE1TextRef.current as HTMLParagraphElement
      );
    }
    if (count == 0 || count == 2)
      updateText(
        v2.current / TIME_STEP,
        m2,
        m2TextRef.current as HTMLParagraphElement,
        v2TextRef.current as HTMLParagraphElement,
        p2TextRef.current as HTMLParagraphElement,
        kE2TextRef.current as HTMLParagraphElement
      );

    // update the total kinetic energy
    updateTotalKE(
      (0.5 * m1 * v1.current * v1.current) / TIME_STEP / TIME_STEP +
        (0.5 * m2 * v2.current * v2.current) / TIME_STEP / TIME_STEP,
      totalKETextRef.current as HTMLParagraphElement
    );

    // update the total momentum
    updateTotalPE(
      (m1 * v1.current + m2 * v2.current) / TIME_STEP,
      totalMomentumTextRef.current as HTMLParagraphElement
    );
  };

  useFrame(() => {
    const mesh1 = meshRef1.current as THREE.Mesh;
    const mesh2 = meshRef2.current as THREE.Mesh;
    if (!mesh1 || !mesh2) return;
    if (checkCollision(mesh1, mesh2)) {
      // calculate the velocity after collision
      const { v1f, v2f } = calculateVelocityAfterCollision(
        m1,
        v1.current,
        m2,
        v2.current
      );

      // update the velocity
      v1.current = v1f;
      v2.current = v2f;

      updateAllTexts(0);
    }

    // moves along x axis
    mesh1.position.z += v1.current;
    mesh2.position.z += v2.current;

    // if it reaches the end of the road, reverse the direction
    if (mesh1.position.z > END_OF_ROAD || mesh1.position.z < -END_OF_ROAD) {
      v1.current = -v1.current;
      updateAllTexts(1);
    }

    if (mesh2.position.z > END_OF_ROAD || mesh2.position.z < -END_OF_ROAD) {
      v2.current = -v2.current;
      updateAllTexts(2);
    }
    // update the arrow direction and position

    updateArrows(arrowRef1.current as THREE.ArrowHelper, mesh1, v1.current);
    updateArrows(arrowRef2.current as THREE.ArrowHelper, mesh2, v2.current);
  });

  return (
    <group scale={[1, 1, 1]}>
      <SingleBlock ref={meshRef1} count={1} />
      <SingleBlock ref={meshRef2} count={2} />
      <Html
        fullscreen
        style={{
          letterSpacing: "0.1em",
          userSelect: "none",
        }}
        prepend
        className="p-1 lg:px-2  w-full"
      >
        <div className="flex items-center justify-center text-white text-3xl my-2">
          Collision
        </div>
        <div className="absolute bottom-2 right-2 ">
          <button
            onClick={() => {
              if (divRef.current) {
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                  setFullScreenOn(false);
                } else {
                  divRef.current
                    .requestFullscreen()
                    .then(() => {
                      setFullScreenOn(true);
                    })
                    .catch((err) => {
                      console.error(
                        "Error attempting to enable full-screen mode:",
                        err.message
                      );
                    });
                }
              }
            }}
            className=" backdrop-blur-[1px] backdrop-brightness-75 text-white p-1 lg:scale-125 hover:scale-150  rounded-md"
          >
            {fullScreenOn ? <Minimize size={40} /> : <Maximize size={40} />}
          </button>
        </div>
        <Results
          refs={[
            [m1TextRef, v1TextRef, p1TextRef, kE1TextRef],
            [m2TextRef, v2TextRef, p2TextRef, kE2TextRef],
          ]}
          totalKETextRef={totalKETextRef}
          totalPETextRef={totalMomentumTextRef}
          updateAllTexts={updateAllTexts}
        />
      </Html>

      {/* draw arrow from box to the direction of velocity */}
      <arrowHelper
        ref={arrowRef1}
        args={[
          vec.set(0, 0, v1.current).normalize(),
          vec.clone().set(0, BOX_SIZE / 2, 0),
          4,
        ]}
      />
      <arrowHelper
        ref={arrowRef2}
        args={[
          vec.set(0, 0, v2.current).normalize(),
          vec.clone().set(0, BOX_SIZE / 2, 0),
          4,
        ]}
      />
    </group>
  );
};

const Lights = () => (
  <>
    <directionalLight position={[-5, 10, 0]} intensity={1} castShadow />
    <directionalLight position={[0, 5, 5]} intensity={1} castShadow />
    <directionalLight position={[-5, 5, -5]} intensity={1} castShadow />
    <pointLight position={[0, 10, 0]} intensity={0.7} />
  </>
);

const XTicks = ({ length }: { length: number }) => {
  // returns x ticks from -length to +length in 5 gaps
  return (
    <>
      {Array.from({ length: length / 5 }, (_, i) => (
        <Fragment key={i}>
          <Html
            className="text-white text-xs"
            position={[0, -BOX_SIZE / 2, i * 5]}
          >
            {i * 5}
          </Html>
          <Html
            className="text-white text-xs"
            position={[0, -BOX_SIZE / 2, -i * 5]}
          >
            {-i * 5}
          </Html>
        </Fragment>
      ))}
    </>
  );
};
const Simulation = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [fullScreenOn, setFullScreenOn] = useAtom(fullScreenOnAtom);
  window.addEventListener("keypress", (e) => {
    if (e.key === "f") {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setFullScreenOn(false);
      } else {
        divRef.current
          .requestFullscreen()
          .then(() => {
            setFullScreenOn(true);
          })
          .catch((err) => {
            console.error(
              "Error attempting to enable full-screen mode:",
              err.message
            );
          });
      }
    }
  });

  return (
    <div ref={divRef} className="my-2 w-5/6 lg:w-[95%]  h-[70svh] lg:h-[80svh]">
      <Suspense fallback={<Loader />}>
        <Canvas shadows style={{ contain: "layout" }}>
          <color attach="background" args={["#303035"]} />
          {/* <Environment
            blur={1}
            ground
            frames={Infinity}
            resolution={256}
            preset="sunset"
          /> */}
          <Lights />
          <Grid
            receiveShadow
            infiniteGrid
            cellSize={5}
            sectionSize={10}
            cellColor={"#6f6f6f"}
            sectionColor={"#aaa"}
            position-y={-BOX_SIZE / 2}
            cellThickness={1}
            fadeDistance={300}
          />

          <PerspectiveCamera makeDefault position={[-30, 10, 0]} fov={30} />
          <ContactShadows
            blur={2}
            far={10}
            opacity={1}
            position={[0, 0, 0]}
            resolution={1024}
            scale={100}
          />

          <XTicks length={50} />

          <OrbitControls enableDamping={false} enablePan={false} makeDefault />
          <Objects divRef={divRef} />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default function CollisionPage() {
  return (
    <div className="grid lg:grid-cols-10 grid-cols-1  my-2 justify-center items-center lg:items-start">
      <center className="lg:col-span-10   ">
        <Simulation />
      </center>
      {/* <center>
        <p className="text-2xl font-bold">Collision</p>
      </center> */}
    </div>
  );
}
