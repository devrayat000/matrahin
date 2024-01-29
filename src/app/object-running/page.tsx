"use client";

import { useEffect, useRef } from "react";

import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import SceneInit from "./sceneInit";

const DiskAnimation = () => {
  const testRef = useRef<SceneInit>();
  const surfaceGroupRef = useRef<THREE.Group>();
  const mixerRef = useRef<THREE.AnimationMixer>();
  const clock = new THREE.Clock();
  const speed = 0.75;
  let position = -2000;
  useEffect(() => {
    const test = new SceneInit("myThreeJsCanvas");
    testRef.current = test;
    test.initialize();
    test.animate();

    const surfaceGroup = new THREE.Group();

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0xaaaaaa, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    test.scene.add(mesh);

    const gridHelper = new THREE.GridHelper(4000, 1000, 0x0000ff, 0x808080);
    surfaceGroup.add(gridHelper);
    surfaceGroupRef.current = surfaceGroup;
    surfaceGroup.position.set(0, 0, -4000);
    // surfaceGroup.add(surface);
    test.scene.add(surfaceGroup);

    const loader = new GLTFLoader();
    loader.load("./Soldier.glb", function (gltf) {
      const model = gltf.scene;
      test.scene.add(model);

      model.traverse(function (object) {
        if (object.isObject3D) object.castShadow = true;
      });

      const animations = gltf.animations;
      const mixer = new THREE.AnimationMixer(model);
      const action = mixer.clipAction(animations[1]);
      action.enabled = true;
      action.setEffectiveTimeScale(1);
      action.setEffectiveWeight(1);

      mixerRef.current = mixer;
      action.play();
    });

    const animate = () => {
      if (surfaceGroupRef.current && mixerRef.current) {
        const delta = clock.getDelta();
        // surfaceGroupRef.current?.position.set(delta * speed, 0, 0);
        position += speed * 0.025;
        surfaceGroupRef.current?.position.set(0, 0, position);

        mixerRef.current?.update(delta * speed);
      }
      window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      testRef.current?.renderer.dispose();
    };
  }, []);
  return <canvas id="myThreeJsCanvas" style={{ width: "70vw" }} />;
};

export default DiskAnimation;
