"use client";

import { Html } from "@react-three/drei";
import React, { useMemo, useState } from "react";
import * as THREE from "three";
import ReactFiberBasic from "~/components/common/ReactFiberBasic";

const colors = [
  "#ff0000",
  "#00ffff",
  "#80ff00",
  "#0000ff",
  "#ff8000",
  "#ffff00",
  "#00ff80",
  "#0080ff",
  "#00ff00",
  "#ff00ff",
  "#ff0080",
  "#8000ff",
];
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
          <React.Fragment key={index}>
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
          </React.Fragment>
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

const Animation = () => {
  const v = new THREE.Vector3();
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
  const cross = useMemo(() => A.clone().cross(B), [A, B]);
  const add = useMemo(() => A.clone().add(B), [A, B]);
  const sub = useMemo(() => A.clone().sub(B), [A, B]);

  const handleValueChange = (
    vector: "A" | "B",
    component: "x" | "y" | "z",
    value: string
  ) => {
    if (vector === "A") {
      setValueA((prevValueA) => ({
        ...prevValueA,
        [component]: parseFloat(value) || 0,
      }));
    } else if (vector === "B") {
      setValueB((prevValueB) => ({
        ...prevValueB,
        [component]: parseFloat(value) || 0,
      }));
    }
  };
  return (
    <>
      <h1 className="text-center text-4xl py-3 text-primary font-bold leading-8 text-gray-900 ">
        Vector Calculation
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <div className="m-auto md:mx-0 my-4 h-[50vh] w-[40vh] md:w-[100vh] md:h-[80vh]">
          <ReactFiberBasic>
            <group>
              {createArrow([
                { label: "A", vector: A },
                { label: "B", vector: B },
                { label: "AxB", vector: cross },
                { label: "AxB", vector: cross.clone().negate() },
                { label: "A+B", vector: add },
                { label: "A-B", vector: sub },
              ])}
              <Parallelogram vector1={A} vector2={B} />
            </group>
          </ReactFiberBasic>
        </div>

        <div className="m-auto mx-2 flex flex-row items-center gap-2 md:gap-2 text-center justify-center p-2">
          <div className=" border p-2 bg-stone-100">
            <VectorInput
              label={"Ax"}
              value={A.x}
              onChangeInput={handleValueChange}
            />

            <hr className="my-2 border-t border-gray-300" />
            <VectorInput
              label={"Ay"}
              value={A.y}
              onChangeInput={handleValueChange}
            />
            <hr className="my-2 border-t border-gray-300" />
            <VectorInput
              label={"Az"}
              value={A.z}
              onChangeInput={handleValueChange}
            />
          </div>
          <div className="border p-2 bg-stone-100">
            <VectorInput
              label={"Bx"}
              value={B.x}
              onChangeInput={handleValueChange}
            />
            <hr className="my-2 border-t border-gray-300" />
            <VectorInput
              label={"By"}
              value={B.y}
              onChangeInput={handleValueChange}
            />
            <hr className="my-2 border-t border-gray-300" />
            <VectorInput
              label={"Bz"}
              value={B.z}
              onChangeInput={handleValueChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Animation;
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
        <label style={{ marginRight: "5px" }}>{label}</label>

        <input
          className="max-w-16 ml-1 p-2 border"
          type="number"
          step={0.1}
          min={-10}
          max={10}
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
      <input
        type="range"
        min={-10}
        max={10}
        step={0.1}
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
  );
};
