"use client";

import { useEffect, useRef, useState } from "react";

import * as THREE from "three";

import { useAtomValue } from "jotai";
import Chip from "~/components/ui/chip";
import { CaseOfInertia } from "~/services/Moment_of_inertia";
import SceneInit from "../sceneInit";
import { caseTypeAtom } from "../store";

const DiskAnimation = () => {
  const caseOfInertia = useAtomValue(caseTypeAtom);
  const [rotationAxis, setRotationAxis] = useState<"x" | "y">("y");
  const diskMeshRef = useRef<THREE.Group<THREE.Object3DEventMap>>();
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
    diskMeshRef.current = group;

    // return () => {
    //   // Cleanup: remove the mesh from the scene
    //   if (diskMeshRef.current) {
    //     test.scene.remove(diskMeshRef.current);
    //     diskMeshRef.current.children.forEach((child) => {
    //       if (child instanceof THREE.Mesh) {
    //         child.geometry.dispose();
    //         child.material.dispose();
    //       }
    //     });
    //   }
    // };
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
      } else if (rotationAxis === "z") {
        group.rotation.z += rotationSpeed;
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

  useEffect(() => {
    if (!diskMeshRef.current) return;

    const data = {
      radius: 3,
      innerRadius: 1.5,
    };

    if (caseOfInertia === CaseOfInertia.Solid) {
      const disk = new THREE.CircleGeometry(data.radius);
      disk.rotateX(Math.PI / 2);
      updateGroupGeometry(diskMeshRef.current, disk);
    } else if (caseOfInertia === CaseOfInertia.Hollow) {
      const ringGeometry = new THREE.RingGeometry(
        data.innerRadius,
        data.radius
      );
      ringGeometry.rotateX(Math.PI / 2);

      updateGroupGeometry(diskMeshRef.current, ringGeometry);
    } else if (caseOfInertia === CaseOfInertia.Thin) {
      const circle = new THREE.RingGeometry(data.radius, data.radius);
      circle.rotateX(Math.PI / 2);
      updateGroupGeometry(diskMeshRef.current, circle);
    }
  }, [caseOfInertia]);

  function updateGroupGeometry(
    mesh: THREE.Mesh | THREE.Group,
    geometry: THREE.BufferGeometry,
    toRemove: boolean = true
  ) {
    mesh.children.forEach((child, index) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (index > 1) {
          child.material.dispose();
        }
      }
    });
    (mesh.children[0] as THREE.Mesh).geometry = new THREE.WireframeGeometry(
      geometry
    );
    (mesh.children[1] as THREE.Mesh).geometry = geometry;

    //console.log(mesh.children);
    if (toRemove) {
      const newChildren = mesh.children.slice(0, 2);
      mesh.children = [];
      newChildren.forEach((child) => {
        mesh.add(child);
      });
      //console.log("removing");
    }
    //console.log(mesh.children);
    // these do not update nicely together if shared
  }
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
        </div>
      </div>
      <canvas id="myThreeJsCanvas" className="max-w-full lg:max-w-full " />
    </div>
  );
};

export default DiskAnimation;
