"use client";

import { Html, Line } from "@react-three/drei";
import { MathJax } from "better-react-mathjax";
import { MinusCircle, PlusCircle } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import * as THREE from "three";
import ReactFiberBasic from "~/components/common/ReactFiberBasic";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import Checkbox from "~/components/ui/checkbox";

const colors = [
  "#ff0000",
  "#0080ff",
  "#80aaaa",
  "#0000ff",
  "#ff8000",
  "#8000ff",
  "#ffff00",
  "#00ffff",
  "#00ff80",
  "#00ff00",
  "#ff00ff",
  "#ff0080",
];

const createSingleArrow = (
  label: string,
  vector: THREE.Vector3,
  visible: boolean
) => {
  return (
    <group>
      <arrowHelper
        args={[
          vector.clone().normalize(),
          new THREE.Vector3(0, 0, 0),
          vector.length(),
          colors[0],
        ]}
      />
      <Html visible={visible} position={vector.toArray()}>
        <p
          style={{
            maxWidth: "50px",
            color: colors[0],
            fontSize: "16px",
            display: visible ? "block" : "none",
          }}
        >
          {label}
        </p>
      </Html>
    </group>
  );
};
const createArrow = (vectors: { label: string; vector: THREE.Vector3 }[]) => {
  return (
    <group>
      {vectors.map(({ label, vector: v }, index) => {
        // const rgb = getRandomRGB();
        // console.log(rgb);
        const arrow: [
          direction: THREE.Vector3,
          origin: THREE.Vector3,
          length: number,
          color: THREE.ColorRepresentation
        ] = [
          v.clone().normalize(),
          new THREE.Vector3(0, 0, 0),
          v.length(),
          colors[index],
        ];
        return (
          <Fragment key={index}>
            <arrowHelper args={arrow} />
            <Html position={v.toArray()}>
              <p
                style={{
                  maxWidth: "50px",
                  color: colors[index],
                  fontSize: "16px",
                }}
              >
                {label}
              </p>
            </Html>
          </Fragment>
        );
      })}
    </group>
  );
};
const PlaneNormalToVector = ({ vector, length }) => {
  const planeGeometry = new THREE.PlaneGeometry(length, length, 1, 1);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0x00aaba,
    side: THREE.DoubleSide,
  });
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

  // Align the plane with the given normal vector
  const normal = new THREE.Vector3().copy(vector).normalize();
  planeMesh.lookAt(normal);

  // Position the plane at the origin
  planeMesh.position.set(0, 0, 0);

  return <primitive object={planeMesh} />;
};

const Parallelogram = ({ vector1, vector2 }) => {
  // Create a parallelogram geometry based on two vectors
  const vertices = [
    0,
    0,
    0,
    vector1.x,
    vector1.y,
    vector1.z,
    vector1.x + vector2.x,
    vector1.y + vector2.y,
    vector1.z + vector2.z,
    vector2.x,
    vector2.y,
    vector2.z,
  ];

  const indices = [0, 1, 2, 0, 2, 3];

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  geometry.setIndex(indices);

  const material = new THREE.MeshBasicMaterial({
    color: 0x06b2ec,
    side: THREE.DoubleSide,
  });

  return <mesh geometry={geometry} material={material} />;
};

const precision = 2;
const formatNumberSign = (num: number): string =>
  num < 0 ? "-" + Math.abs(num).toFixed(precision) : num.toFixed(precision);
const formatVector = (x: number, y: number, z: number): string =>
  `${formatNumberSign(x)}\\hat{i}   
  ${y > 0 ? "+" : ""}
  ${formatNumberSign(y)}\\hat{j} 
  ${z > 0 ? "+" : ""}
  ${formatNumberSign(z)}\\hat{k}`;

const BasicVectorCalcultor = () => {
  const v = new THREE.Vector3();

  const [controls, setControls] = useState({
    showGridonXZ: true,
    showGridonXY: false,
    showAonB: false,
    showBonA: false,
    showParallelogram: true,
  });
  const initial = {
    A: {
      x: 3.3,
      y: 0.1,
      z: -0.5,
    },
    B: {
      x: -1,
      y: -0.8,
      z: 1.3,
    },
  };
  const [inputs, setInputs] = useState(initial);
  const [valueA, setValueA] = useState<{ x: number; y: number; z: number }>(
    initial.A
  );
  const [valueB, setValueB] = useState<{ x: number; y: number; z: number }>(
    initial.B
  );
  const A = useMemo(
    () => v.clone().set(valueA.x, valueA.y, valueA.z),
    [valueA]
  );
  const B = useMemo(
    () => v.clone().set(valueB.x, valueB.y, valueB.z),
    [valueB]
  );
  const dotMult = useMemo(() => A.clone().dot(B), [A, B]);
  const cross = useMemo(() => A.clone().cross(B), [A, B]);
  const add = useMemo(() => A.clone().add(B), [A, B]);
  const sub = useMemo(() => A.clone().sub(B), [A, B]);

  const handleValueChange = (
    vector: "A" | "B",
    component: "x" | "y" | "z",
    value: string
  ) => {
    if (vector === "A") {
      // setValueA((prevValueA) => ({
      //   ...prevValueA,
      //   [component]: parseFloat(value) || 0,
      // }));
      setInputs((prev) => ({
        ...prev,
        A: {
          ...prev.A,
          [component]: parseFloat(value) || 0,
        },
      }));
    } else if (vector === "B") {
      // setValueB((prevValueB) => ({
      //   ...prevValueB,
      //   [component]: parseFloat(value) || 0,
      // }));
      setInputs((prev) => ({
        ...prev,
        B: {
          ...prev.B,
          [component]: parseFloat(value) || 0,
        },
      }));
    }
  };

  const handleSubmit = () => {
    setValueA(inputs.A);
    setValueB(inputs.B);
  };

  const AdditionProcess = useMemo(
    () => (
      <MathJax>
        {`
      $
        \\begin{align}
        \\overrightarrow{A}+\\overrightarrow{B}
        &=
          (${formatVector(valueA.x, valueA.y, valueA.z)})  
        ${newLineWithSpace(3)}
        + 
          (${formatVector(valueB.x, valueB.y, valueB.z)}) 
          \\\\
        &= 
          (
            ${valueA.x.toFixed(precision)} 
              ${valueB.x > 0 ? "+" : ""}
            ${formatNumberSign(valueB.x)}
          )\\hat{i} + 

          (
            ${valueA.y.toFixed(precision)} 
              ${valueB.y > 0 ? "+" : ""}
            ${formatNumberSign(valueB.y)}
          )\\hat{j} 
            
            ${newLineWithSpace(5)}
            + 
            (
              ${valueA.z.toFixed(precision)} 
                ${valueB.z > 0 ? "+" : ""}
              ${formatNumberSign(valueB.z)}
            )\\hat{k}
           \\\\
           \\\\
        &=
        ${formatVector(add.x, add.y, add.z)} \\\\
        \\end{align}
      $

    `}
      </MathJax>
    ),
    [valueA, valueB]
  );
  const SubtractionProcess = useMemo(
    () => (
      <MathJax>
        {`
          $
            \\begin{align}
            \\overrightarrow{A}-\\overrightarrow{B}
            &=
            ( ${formatVector(valueA.x, valueA.y, valueA.z)} )  
            
            ${newLineWithSpace(3)}
            - 
              (${formatVector(valueB.x, valueB.y, valueB.z)}) \\\\
            &= 
            (
              ${valueA.x.toFixed(precision)} - 
              ${
                valueB.x < 0
                  ? "(" + valueB.x.toFixed(precision) + ")"
                  : valueB.x.toFixed(precision)
              })\\hat{i} 

              
               + 
              (${valueA.y.toFixed(precision)} - 
              ${
                valueB.y < 0
                  ? "(" + valueB.y.toFixed(precision) + ")"
                  : valueB.y.toFixed(precision)
              })\\hat{j} 
              ${newLineWithSpace(5)}
              + 
              (${valueA.z.toFixed(precision)} - 
              ${
                valueB.z < 0
                  ? "(" + valueB.z.toFixed(precision) + ")"
                  : valueB.z.toFixed(precision)
              })\\hat{k} 
             
            \\\\
            \\\\
            
            &=
            ${formatVector(sub.x, sub.y, sub.z)} \\\\
            \\end{align}
          $
        `}
      </MathJax>
    ),
    [valueA, valueB]
  );
  const DotMultProcess = useMemo(
    () => (
      <MathJax>
        {`
          $
            \\begin{align}
            \\overrightarrow{A}\\cdot \\overrightarrow{B}
            &=
            ( ${formatVector(valueA.x, valueA.y, valueA.z)} )  
            
            ${newLineWithSpace(3)}
            \\cdot 
              (${formatVector(valueB.x, valueB.y, valueB.z)}) \\\\
            &= 
            (
              ${valueA.x.toFixed(precision)} \\times 
              ${
                valueB.x < 0
                  ? "(" + valueB.x.toFixed(precision) + ")"
                  : valueB.x.toFixed(precision)
              })

              
               + 
              (${valueA.y.toFixed(precision)} \\times
              ${
                valueB.y < 0
                  ? "(" + valueB.y.toFixed(precision) + ")"
                  : valueB.y.toFixed(precision)
              }) 
              ${newLineWithSpace(5)}
              + 
              (${valueA.z.toFixed(precision)} \\times
              ${
                valueB.z < 0
                  ? "(" + valueB.z.toFixed(precision) + ")"
                  : valueB.z.toFixed(precision)
              })
             
            \\\\
            
            &=
            ${formatNumberSign(valueA.x * valueB.x)} 
            ${valueA.y * valueB.y < 0 ? "" : "+"} 
            ${formatNumberSign(valueA.y * valueB.y)}  
            ${valueA.z * valueB.z < 0 ? "" : "+"} 
            ${formatNumberSign(valueA.z * valueB.z)}  \\\\
            \\\\
            &= 
            ${valueA.x * valueB.x + valueA.y * valueB.y + valueA.z * valueB.z}
            
            \\end{align}
          $
        `}
      </MathJax>
    ),
    [valueA, valueB]
  );
  const CrossMultProcess = useMemo(
    () => (
      <MathJax>
        {`
          $
            \\begin{align}
            \\overrightarrow{A}\\times \\overrightarrow{B}
            &=
            ( ${formatVector(valueA.x, valueA.y, valueA.z)} )  
            
            ${newLineWithSpace(3)}
            \\times 
              (${formatVector(valueB.x, valueB.y, valueB.z)}) \\\\
            &= 
          
            \\begin{vmatrix}
            \\hat{i} & \\hat{j} & \\hat{k} \\\\
            ${valueA.x} & ${valueA.y} & ${valueA.z} \\\\
            ${valueB.x} & ${valueB.y} & ${valueB.z} \\\\
            \\end{vmatrix}

            \\\\

            &=
            (
              ${valueA.y} \\times ${valueB.z} - 
              (${valueA.z} \\times ${valueB.y})
            )
              \\space  \\hat{i}

                ${newLineWithSpace(3)}
              - 
              (
                ${valueA.x} \\times ${valueB.z} - 
                (${valueA.z} \\times ${valueB.x}) 
              )
              \\space  \\hat{j}
                ${newLineWithSpace(3)}
              + 
               ( 
                ${valueA.x} \\times ${valueB.y} -
               ( ${valueA.y} \\times ${valueB.x})
              )
              \\space   \\hat{k}
            \\\\
            \\\\
            &=
            ${formatVector(cross.x, cross.y, cross.z)}

            \\end{align}
          $
        `}
      </MathJax>
    ),
    [valueA, valueB]
  );
  const lengthOfVector = ({ x, y, z }: { x: number; y: number; z: number }) =>
    Math.sqrt(x * x + y * y + z * z);
  const ComponentOfBonA = useMemo(
    () => (
      <div>
        <p>
          <b>A</b> বরাবর <b>B</b> এর অভিক্ষেপঃ
        </p>
        <MathJax>
          {`
          $
          \\begin{align}
              |\\overrightarrow{B}|\\cos\\theta\\
            &=
              \\frac{\\overrightarrow{A}\\cdot \\overrightarrow{B}}{|\\overrightarrow{A}|}\\\\
            &= 
              \\frac
              {
                ${formatNumberSign(valueA.x * valueB.x)} 
                  ${valueA.y * valueB.y < 0 ? "" : "+"} 
                ${formatNumberSign(valueA.y * valueB.y)}  
                  ${valueA.z * valueB.z < 0 ? "" : "+"} 
                ${formatNumberSign(valueA.z * valueB.z)} 
              } {
                \\sqrt{
                  (${valueA.x.toFixed(precision)})^2  + 
                  (${valueA.y.toFixed(precision)})^2 + 
                  (${valueA.z.toFixed(precision)})^2
                }
              }
            \\\\
          &= 
          \\frac
            {${dotMult.toFixed(precision)}}
            
            {${lengthOfVector(valueA).toFixed(2)}} 
            = ${(dotMult / lengthOfVector(valueA)).toFixed(2)}
          
          \\end{align}
          $
          `}
        </MathJax>
        <p className="mt-1">
          <b>A</b> বরাবর <b>B</b> এর উপাংশঃ
        </p>

        <MathJax>
          {`
          $$
          \\begin{align}
            |\\overrightarrow{B}| cos\\theta \\cdot \\hat{a}

            &= 
            \\frac{\\overrightarrow{A}\\cdot \\overrightarrow{B}}{|\\overrightarrow{A}|} 
            \\cdot
            \\frac{\\overrightarrow{A}}{|\\overrightarrow{A}|} \\\\

            &=
            ${(dotMult / lengthOfVector(valueA)).toFixed(2)} \\cdot
            \\frac{${formatVector(
              valueA.x,
              valueA.y,
              valueA.z
            )}}{${lengthOfVector(valueA).toFixed(precision)}} \\\\
            &= 
              ${formatVector(
                (dotMult / lengthOfVector(valueA) ** 2) * valueA.x,
                (dotMult / lengthOfVector(valueA) ** 2) * valueA.y,
                (dotMult / lengthOfVector(valueA) ** 2) * valueA.z
              )}
          \\end{align}
          $$
          `}
        </MathJax>
      </div>
    ),
    [valueA, valueB]
  );
  const ComponentOfAonB = useMemo(
    () => (
      <div>
        <p>
          <b>B</b> বরাবর <b>A</b> এর অভিক্ষেপঃ
        </p>
        <MathJax>
          {`
          $
          \\begin{align}
              |\\overrightarrow{A}|\\cos\\theta\\
            &=
              \\frac{\\overrightarrow{A}\\cdot \\overrightarrow{B}}{|\\overrightarrow{B}|}\\\\
            &= 
              \\frac
              {
                ${formatNumberSign(valueA.x * valueB.x)} 
                  ${valueA.y * valueB.y < 0 ? "" : "+"} 
                ${formatNumberSign(valueA.y * valueB.y)}  
                  ${valueA.z * valueB.z < 0 ? "" : "+"} 
                ${formatNumberSign(valueA.z * valueB.z)} 
              } {
                \\sqrt{
                  (${valueB.x.toFixed(precision)})^2  + 
                  (${valueB.y.toFixed(precision)})^2 + 
                  (${valueB.z.toFixed(precision)})^2
                }
              }
            \\\\
          &= 
          \\frac
            {${dotMult.toFixed(precision)}}

            {${lengthOfVector(valueB).toFixed(precision)}} 
            = ${(dotMult / lengthOfVector(valueB)).toFixed(precision)}
          
          \\end{align}
          $
          `}
        </MathJax>
        <p className="mt-1">
          <b>B</b> বরাবর <b>A</b> এর উপাংশঃ
        </p>

        <MathJax>
          {`
          $$
          \\begin{align}
            |\\overrightarrow{A}| cos\\theta \\cdot \\hat{a}

            &= 
            \\frac{\\overrightarrow{A}\\cdot \\overrightarrow{B}}{|\\overrightarrow{B}|} 
            \\cdot
            \\frac{\\overrightarrow{B}}{|\\overrightarrow{B}|} \\\\

            &=
            ${(dotMult / lengthOfVector(valueB)).toFixed(precision)} \\cdot
            \\frac{${formatVector(
              valueB.x,
              valueB.y,
              valueB.z
            )}}{${lengthOfVector(valueB).toFixed(precision)}} \\\\
            &= 
              ${formatVector(
                (dotMult / lengthOfVector(valueB) ** 2) * valueB.x,
                (dotMult / lengthOfVector(valueB) ** 2) * valueB.y,
                (dotMult / lengthOfVector(valueB) ** 2) * valueB.z
              )}
          \\end{align}
          $$
          `}
        </MathJax>
      </div>
    ),
    [valueA, valueB]
  );
  const unitNormalVector = useMemo(
    () => (
      <MathJax>
        {`
      $$
      \\begin{align}
      \\hat{\\eta} &= \\frac{\\overrightarrow{A} \\times \\overrightarrow{B}}{|\\overrightarrow{A} \\times \\overrightarrow{B}|} \\\\
      &= \\frac{${formatVector(cross.x, cross.y, cross.z)}}
      {
        \\sqrt{ 
          (${cross.x.toFixed(precision)})^2 + 
          (${cross.y.toFixed(precision)})^2 + 
          (${cross.z.toFixed(precision)})^2
        }
      } \\\\
      &= \\frac{${formatVector(cross.x, cross.y, cross.z)}}{${lengthOfVector(
          cross
        ).toFixed(precision)}} \\\\
      &= ${formatVector(
        cross.x / lengthOfVector(cross),
        cross.y / lengthOfVector(cross),
        cross.z / lengthOfVector(cross)
      )}
      \\end{align}
      $$
      `}
      </MathJax>
    ),
    [valueA, valueB]
  );

  const angleBetween = useMemo(
    () => (
      <div>
        <b>A</b> এবং <b>B</b> ভেক্টরের মধ্যে কোণ θ হলে,
        <MathJax>
          {`
          $
          \\begin{align}
          \\cos\\theta &= \\frac{\\overrightarrow{A}\\cdot \\overrightarrow{B}}{|\\overrightarrow{A}|\\cdot|\\overrightarrow{B}|} \\\\
          &= \\frac{${dotMult.toFixed(precision)}}{${lengthOfVector(
            valueA
          ).toFixed(precision)}\\times${lengthOfVector(valueB).toFixed(
            precision
          )}} \\\\
          &= ${Math.cos(
            dotMult / (lengthOfVector(valueA) * lengthOfVector(valueB))
          ).toFixed(precision)}\\\\

          \\theta &= \\cos^{-1}(${Math.cos(
            dotMult / (lengthOfVector(valueA) * lengthOfVector(valueB))
          ).toFixed(precision)}) \\\\
          \\theta &\\approx ${(
            Math.acos(
              dotMult / (lengthOfVector(valueA) * lengthOfVector(valueB))
            ) *
            (180 / Math.PI)
          ).toFixed(precision)}^\\circ

            
          \\end{align}
          $ 
          `}
        </MathJax>
      </div>
    ),
    [valueA, valueB]
  );

  const processes = useMemo(
    () => [
      [
        { name: "Addition ( যোগ )", value: AdditionProcess },
        { name: "Subtraction ( বিয়োগ )", value: SubtractionProcess },
        { name: "Dot Product ( ডট গুণন )", value: DotMultProcess },
        { name: "Cross Product ( ক্রস গুণন )", value: CrossMultProcess },
        {
          name: "Angle between vectors (ভেক্টরের মধ্যবর্তী কোণ)",
          value: angleBetween,
        },
      ],
      [
        {
          name: "Component of A on B (A বরাবর B এর উপাংশ)",
          value: ComponentOfBonA,
        },
        {
          name: "Component of B on A (B বরাবর A এর উপাংশ)",
          value: ComponentOfAonB,
        },

        {
          name: "Unit normal vector (লম্ব একক ভেক্টর)",
          value: unitNormalVector,
        },
      ],
    ],
    [valueA, valueB]
  );

  const AandBVectors = useMemo(
    () => (
      <MathJax>
        {`
          $
          \\begin{align}
          \\overrightarrow{A}
          &= ${formatVector(valueA.x, valueA.y, valueA.z)} \\\\
          \\overrightarrow{B}
          &= ${formatVector(valueB.x, valueB.y, valueB.z)}
          \\end{align}
          $
        `}
      </MathJax>
    ),
    [valueA, valueB]
  );
  const ComponentAOnBVector = useMemo(
    () => A.clone().projectOnVector(B),
    [A, B]
  );

  const ComponentBOnAVector = useMemo(
    () => B.clone().projectOnVector(A),
    [A, B]
  );
  return (
    <div className="mb-3 flex flex-col ">
      <div className="flex flex-col  md:flex-row items-center justify-center gap-2 m-2">
        <div className="m-auto  md:mx-0 my-4 h-[50vh] w-[40vh] md:w-[60%] md:h-[80vh]">
          <ReactFiberBasic>
            <gridHelper
              visible={controls.showGridonXZ}
              args={[100, 100, 0x666666, 0x666666]}
            />
            <gridHelper
              visible={controls.showGridonXY}
              args={[100, 100, 0x666666, 0x666666]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <group>
              {createArrow([
                { label: "A", vector: A },
                { label: "B", vector: B },
                { label: "AxB", vector: cross },
                { label: "AxB", vector: cross.clone().negate() },
                { label: "A+B", vector: add },
                { label: "A-B", vector: sub },
              ])}
              <group visible={controls.showParallelogram}>
                <Parallelogram vector1={A} vector2={B} />
              </group>
            </group>

            <group visible={controls.showAonB}>
              {createSingleArrow(
                "A_on_B",
                ComponentAOnBVector,
                controls.showAonB
              )}

              <Line
                dashOffset={10}
                dashScale={10}
                dashSize={1}
                dashed={true}
                points={[A, ComponentAOnBVector, v.clone().set(0, 0, 0)]}
              />
            </group>
            <group visible={controls.showBonA}>
              {createSingleArrow(
                "B_on_A",
                ComponentBOnAVector,
                controls.showBonA
              )}
              <Line
                dashOffset={10}
                dashScale={10}
                dashSize={1}
                dashed={true}
                points={[B, ComponentBOnAVector, v.clone().set(0, 0, 0)]}
              />
            </group>
          </ReactFiberBasic>
        </div>

        <div className="flex  flex-col self-center md:self-start items-center justify-center gap-2">
          {/* <div className="  mx-6 p-2  text-center bg-stone-100 text-xl">
          Inputs
        </div> */}
          <div className=" mx-2 self-start flex flex-row items-center gap-2 md:gap-2 text-center justify-center p-2 ">
            <div className=" border p-2 bg-stone-100">
              <VectorInput
                label={"Ax"}
                value={inputs.A.x}
                onChangeInput={handleValueChange}
              />

              <hr className="my-2 border-t border-gray-300" />
              <VectorInput
                label={"Ay"}
                value={inputs.A.y}
                onChangeInput={handleValueChange}
              />
              <hr className="my-2 border-t border-gray-300" />
              <VectorInput
                label={"Az"}
                value={inputs.A.z}
                onChangeInput={handleValueChange}
              />
            </div>
            <div className="border p-2 bg-stone-100">
              <VectorInput
                label={"Bx"}
                value={inputs.B.x}
                onChangeInput={handleValueChange}
              />
              <hr className="my-2 border-t border-gray-300" />
              <VectorInput
                label={"By"}
                value={inputs.B.y}
                onChangeInput={handleValueChange}
              />
              <hr className="my-2 border-t border-gray-300" />
              <VectorInput
                label={"Bz"}
                value={inputs.B.z}
                onChangeInput={handleValueChange}
              />
            </div>
          </div>
          <div className="flex flex-row items-center justify-between gap-2">
            <Button
              onClick={() => {
                setInputs(initial);
                setValueA(initial.A);
                setValueB(initial.B);
              }}
              variant={"destructive"}
              name="Reset"
              title="Reset the values to default"
              // className="bg-stone-100 text-black p-2 rounded-md"
            >
              Reset
            </Button>
            <Button
              onClick={handleSubmit}
              variant={"default"}
              name="Submit"
              title="Submit the values to see the results"
              // className="bg-stone-100 text-black p-2 rounded-md"
            >
              Calculate
            </Button>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-col items-left gap-2">
              <Checkbox
                label={"সামান্তরিক"}
                checked={controls.showParallelogram}
                onChange={() =>
                  setControls((prev) => ({
                    ...prev,
                    showParallelogram: !prev.showParallelogram,
                  }))
                }
              />
              <Checkbox
                label={"Grid on XZ plane"}
                checked={controls.showGridonXZ}
                onChange={() =>
                  setControls((prev) => ({
                    ...prev,
                    showGridonXZ: !prev.showGridonXZ,
                  }))
                }
              />
              <Checkbox
                label={"Grid on XY plane"}
                checked={controls.showGridonXY}
                onChange={() =>
                  setControls((prev) => ({
                    ...prev,
                    showGridonXY: !prev.showGridonXY,
                  }))
                }
              />
            </div>
            <div className="flex self-start flex-col items-left gap-2">
              <Checkbox
                label={"A বরাবর B এর উপাংশ"}
                checked={controls.showBonA}
                onChange={() =>
                  setControls((prev) => ({
                    ...prev,
                    showBonA: !prev.showBonA,
                  }))
                }
              />
              <Checkbox
                label={"B বরাবর A এর উপাংশ"}
                checked={controls.showAonB}
                onChange={() =>
                  setControls((prev) => ({
                    ...prev,
                    showAonB: !prev.showAonB,
                  }))
                }
              />
            </div>
          </div>

          <div className="mt-2">
            <div>{AandBVectors}</div>
          </div>
        </div>
      </div>
      {/* Results */}
      <p className="text-2xl text-center">Results</p>

      <div className=" mx-auto flex flex-col md:flex-row items-center md:justify-between md:gap-2">
        <div className="md:self-start w-full">
          <Accordion
            type="multiple"
            collapsible
            className="mt-5   list-image-check-circle flex flex-col gap-2"
          >
            {processes[0].map((item, index) => (
              <AccordionItem
                key={index}
                value={item.name}
                className="px-8 rounded-xl border-2 border-border"
              >
                <AccordionTrigger>
                  <p>{item.name}</p>
                </AccordionTrigger>
                <AccordionContent className="flex gap-1 items-start md:text-lg ">
                  {/* main content */}
                  {item.value}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="md:self-start w-full">
          <Accordion
            type="multiple"
            collapsible
            className="mt-2 md:mt-5 list-image-check-circle flex flex-col gap-2"
          >
            {processes[1].map((item, index) => (
              <AccordionItem
                key={index}
                value={item.name}
                className="px-8 rounded-xl border-2 border-border"
              >
                <AccordionTrigger>
                  <p>{item.name}</p>
                </AccordionTrigger>
                <AccordionContent className="flex gap-1 items-start md:text-lg ">
                  {/* main content */}
                  {item.value}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default BasicVectorCalcultor;
interface VectorInputProps {
  label: string;
  value: number;
  onChangeInput: (
    vector: "A" | "B",
    component: "x" | "y" | "z",
    value: string
  ) => void;
}

const VectorInput: React.FC<VectorInputProps> = ({
  label,
  value,
  onChangeInput,
}) => {
  return (
    <div className="flex flex-col gap-1 items-center mb-2">
      <div className="flex flex-row justify-between  w-full  gap-1 items-center">
        <label className="text-xl" style={{ marginRight: "2px" }}>
          <MathJax>{`\\(${label[0]}_${label[1]}\\)`}</MathJax>
        </label>

        <input
          className="max-w-16 ml-1 p-2 border"
          type="number"
          step={0.1}
          min={-100}
          max={100}
          value={value}
          onChange={(e) =>
            onChangeInput(
              label[0] as "A" | "B",
              label[1] as "x" | "y" | "z",
              e.target.value
            )
          }
        />
      </div>

      <div className="flex flex-row justify-between  w-full  gap-1 items-center">
        <button
          onClick={() =>
            onChangeInput(
              label[0] as "A" | "B",
              label[1] as "x" | "y" | "z",
              value - 1 + ""
            )
          }
        >
          <MinusCircle color="red" size={16} />
        </button>
        <input
          type="range"
          min={-100}
          max={100}
          step={1}
          value={value}
          onChange={(e) =>
            onChangeInput(
              label[0] as "A" | "B",
              label[1] as "x" | "y" | "z",
              e.target.value
            )
          }
        />
        <button
          onClick={() =>
            onChangeInput(
              label[0] as "A" | "B",
              label[1] as "x" | "y" | "z",
              value + 1 + ""
            )
          }
        >
          <PlusCircle color="green" size={16} />
        </button>
      </div>
    </div>
  );
};

const newLineWithSpace = (n: number) => "\\\\&" + "\\space ".repeat(n);
