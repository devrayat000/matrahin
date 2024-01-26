// not used

"use client";

import { useEffect, useRef, useState } from "react";

import * as THREE from "three";

import Chip from "~/components/ui/chip";
import SceneInit from "../sceneInit";

const PlateAnimation = () => {
  const [rotationAxis, setRotationAxis] = useState<"x" | "y" | "e">("y");
  const diskMeshRef = useRef<THREE.Group<THREE.Object3DEventMap>>();
  const testRef = useRef<SceneInit>(null);
  useEffect(() => {
    const test = new SceneInit("myThreeJsCanvas");
    testRef.current = test;
    test.initialize();
    test.animate();

    // const backGroundTexture = new THREE.TextureLoader().load("/space.jpeg");
    // test.scene.background = backGroundTexture;

    const group = new THREE.Group();

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute([], 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
    });
    const meshMaterial = new THREE.MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true,
    });

    group.add(new THREE.LineSegments(geometry, lineMaterial));
    group.add(new THREE.Mesh(geometry, meshMaterial));

    const plateGeometry = new THREE.PlaneGeometry(5, 5);
    const plateMesh: THREE.Mesh = new THREE.Mesh(plateGeometry, meshMaterial);
    plateMesh.rotateX(Math.PI / 2);
    group.add(plateMesh);

    test.scene.add(group);
    diskMeshRef.current = group;
  }, []);

  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const group = diskMeshRef.current;
    if (!group) return;

    group.rotation.set(0, 0, 0);
    const animate = () => {
      const rotationSpeed = 0.01;
      if (rotationAxis === "x") {
        group.rotation.x += rotationSpeed;
      } else if (rotationAxis === "y") {
        group.rotation.y += rotationSpeed;
      } else if (rotationAxis === "e") {
        // todo: modify this
        group.rotation.y += rotationSpeed;
      }
      frameIdRef.current = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (frameIdRef.current !== null) {
        window.cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [rotationAxis]);

  return (
    <div>
      <div className="flex flex-row items-center justify-evenly mb-2 gap-1">
        <p className="text-lg">Rotation Axis</p>
        <div className="flex flex-row items-center justify-evenly gap-2">
          <Chip
            label={"Diameter"}
            selected={rotationAxis === "x"}
            onClick={() => setRotationAxis("x")}
          />
          <Chip
            label={"Center"}
            selected={rotationAxis === "y"}
            onClick={() => setRotationAxis("y")}
          />
          <Chip
            label={"Edge"}
            selected={rotationAxis === "e"}
            onClick={() => setRotationAxis("e")}
          />
        </div>
      </div>
      <canvas id="myThreeJsCanvas" className="max-w-full " />
    </div>
  );
};

export default PlateAnimation;
