"use client";

import { useEffect, useRef } from "react";

import * as THREE from "three";

import SceneInit from "../sceneInit";

const PointMassAnimation = () => {
  const PointMassRef = useRef<THREE.Group<THREE.Object3DEventMap>>();
  const testRef = useRef<SceneInit>();
  useEffect(() => {
    const test = new SceneInit("myThreeJsCanvas");
    testRef.current = test;
    test.initialize();
    test.animate();

    const group = new THREE.Group();

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute([], 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: false,
      opacity: 1,
    });
    const meshMaterial = new THREE.MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true,
    });

    group.add(new THREE.LineSegments(geometry, lineMaterial));
    group.add(new THREE.Mesh(geometry, meshMaterial));

    const pointMassGeometry = new THREE.SphereGeometry(0.2);
    const pointMassMesh: THREE.Mesh = new THREE.Mesh(
      pointMassGeometry,
      meshMaterial
    );

    const x = 3,
      y = 2;
    pointMassMesh.position.x = x;
    pointMassMesh.position.y = y;

    group.add(pointMassMesh);

    // draw an arrow from y axis to the pointMass
    const origin = new THREE.Vector3(0, y, 0);
    const direction = new THREE.Vector3(x, 0, 0);
    direction.normalize();
    const arrow = new THREE.ArrowHelper(direction, origin, x, 0x00ffff);
    group.add(arrow);

    test.camera.position.y = 35;

    test.scene.add(group);
    PointMassRef.current = group;

    const animate = () => {
      const rotationSpeed = 0.01;
      group.rotation.y += rotationSpeed;
      frameIdRef.current = window.requestAnimationFrame(animate);
    };
    animate();
    return () => {
      // Cleanup: remove the mesh from the scene
      // if (PointMassRef.current) {
      //   test.scene.remove(PointMassRef.current);
      //   PointMassRef.current.children.forEach((child) => {
      //     if (child instanceof THREE.Mesh) {
      //       child.geometry.dispose();
      //       child.material.dispose();
      //     }
      //   });

      //   if (frameIdRef.current !== null) {
      //     window.cancelAnimationFrame(frameIdRef.current);
      //   }
      // }

      if (PointMassRef.current && frameIdRef.current) {
        window.cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, []);

  const frameIdRef = useRef<number | null>(null);

  return (
    <div>
      <canvas id="myThreeJsCanvas" className="max-w-full lg:max-w-full " />
    </div>
  );
};

export default PointMassAnimation;
