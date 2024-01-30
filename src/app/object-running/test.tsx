"use client";

import { useEffect, useRef } from "react";

import * as THREE from "three";

import SceneInit from "../(secure)/calc/(calculators)/moi/sceneInit";

const DiskAnimation = () => {
  const testRef = useRef<SceneInit>();
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
      // color: 0xffffff,
      color: 0x000,
      transparent: true,
      opacity: 0.6,
    });
    const meshMaterial = new THREE.MeshPhongMaterial({
      color: 0x069fec,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true,
    });

    group.add(new THREE.LineSegments(geometry, lineMaterial));
    group.add(new THREE.Mesh(geometry, meshMaterial));

    test.scene.add(group);

    const disk = new THREE.CircleGeometry(3);
    disk.rotateX(Math.PI / 2);
    updateGroupGeometry(group, disk);

    const animate = () => {
      group.rotation.x += 0.05;

      window.requestAnimationFrame(animate);
    };
    animate();
  }, []);

  function updateGroupGeometry(
    mesh: THREE.Mesh | THREE.Group,
    geometry: THREE.BufferGeometry
  ) {
    (mesh.children[0] as THREE.Mesh).geometry.dispose();
    (mesh.children[1] as THREE.Mesh).geometry.dispose();

    (mesh.children[0] as THREE.Mesh).geometry = new THREE.WireframeGeometry(
      geometry
    );
    (mesh.children[1] as THREE.Mesh).geometry = geometry;
  }
  return (
    <>
      <canvas id="myThreeJsCanvas" />
    </>
  );
};

export default DiskAnimation;
