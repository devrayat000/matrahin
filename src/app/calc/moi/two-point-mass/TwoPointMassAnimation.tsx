"use client";

import { useEffect, useRef } from "react";

import * as THREE from "three";

import SceneInit from "../sceneInit";

const TwoPointMassAnimation = () => {
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
    // center_of_mass = (m1*r1 + m2*r2) / (m1 + m2)
    const y = 2,
      m1 = 0.5,
      m2 = 0.25,
      r1 = -1,
      r2 = 2;
    const pointMassGeometry1 = new THREE.SphereGeometry(m1);
    const pointMassMesh1: THREE.Mesh = new THREE.Mesh(
      pointMassGeometry1,
      meshMaterial
    );
    pointMassMesh1.position.x = r1;
    pointMassMesh1.position.y = y;

    const pointMassGeometry2 = new THREE.SphereGeometry(m2);
    const pointMassMesh2: THREE.Mesh = new THREE.Mesh(
      pointMassGeometry2,
      meshMaterial
    );
    pointMassMesh2.position.x = r2;
    pointMassMesh2.position.y = y;

    group.add(pointMassMesh1);
    group.add(pointMassMesh2);

    // draw an arrow from y axis to the pointMass
    const origin = new THREE.Vector3(r1, y, 0);
    const direction = new THREE.Vector3(r2, 0, 0);
    direction.normalize();
    const arrow = new THREE.ArrowHelper(
      direction,
      origin,
      Math.abs(r1) + Math.abs(r2),
      0x000
    );
    group.add(arrow);

    test.camera.position.y = 10;

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
      if (PointMassRef.current) {
        test.scene.remove(PointMassRef.current);
        PointMassRef.current.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            child.material.dispose();
          }
        });

        if (frameIdRef.current !== null) {
          window.cancelAnimationFrame(frameIdRef.current);
        }
      }
    };
  }, []);

  const frameIdRef = useRef<number | null>(null);

  return (
    <div>
      <canvas id="myThreeJsCanvas" className="max-w-full" />
    </div>
  );
};

export default TwoPointMassAnimation;
