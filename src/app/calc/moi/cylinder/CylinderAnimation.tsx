"use client";

import { useEffect, useRef, useState } from "react";

import * as THREE from "three";

import { useAtomValue } from "jotai";
import Chip from "~/components/ui/chip";
import { CaseOfInertia } from "~/services/Moment_of_inertia";
import SceneInit from "../sceneInit";
import { caseTypeAtom, rotationSpeed } from "../store";

const CylinderAnimation = () => {
  const caseOfInertia = useAtomValue(caseTypeAtom);
  const cylinderMeshRef = useRef<THREE.Group<THREE.Object3DEventMap>>();
  const testRef = useRef<SceneInit>();
  const [rotationAxis, setRotationAxis] = useState<"x" | "y">("y");

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

    test.scene.add(group);
    cylinderMeshRef.current = group;

    return () => {
      // Cleanup: remove the mesh from the scene
      if (cylinderMeshRef.current) {
        test.scene.remove(cylinderMeshRef.current);
        cylinderMeshRef.current.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            child.material.dispose();
          }
        });
      }
    };
  }, []);

  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const group = cylinderMeshRef.current;
    if (!group) return;

    group.rotation.set(0, 0, 0);

    const speed = rotationSpeed;
    const animate = () => {
      if (rotationAxis === "x") {
        group.rotation.x += speed;
      } else if (rotationAxis === "y") {
        group.rotation.y += speed;
      } else if (rotationAxis === "z") {
        group.rotation.z += speed;
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
    if (!cylinderMeshRef.current) return;

    const data = {
      radius: 3,
      height: 5,
      innerRadius: 1.5,
    };

    const generalCylinder = new THREE.CylinderGeometry(
      data.radius,
      data.radius,
      data.height,
      32,
      1,
      true
    );
    if (caseOfInertia === CaseOfInertia.Solid) {
      updateGroupGeometry(
        cylinderMeshRef.current,
        new THREE.CylinderGeometry(data.radius, data.radius, data.height)
      );
    } else if (caseOfInertia === CaseOfInertia.Hollow) {
      const RingData = {
        innerRadius: data.innerRadius,
        outerRadius: data.radius,
        thetaSegments: 32,
        phiSegments: 1,
        thetaStart: 0,
        thetaLength: Math.PI * 2,
      };

      const ringGeometry = new THREE.RingGeometry(
        RingData.innerRadius,
        RingData.outerRadius,
        RingData.thetaSegments,
        RingData.phiSegments,
        RingData.thetaStart,
        RingData.thetaLength
      );
      ringGeometry.rotateX(Math.PI / 2);
      const ring = new THREE.Mesh(
        ringGeometry,
        (cylinderMeshRef.current.children[1] as THREE.Mesh)
          .material as THREE.MeshPhongMaterial
      );
      ring.position.y = data.height / 2;
      const ring2 = ring.clone();
      ring2.position.y = -data.height / 2;
      cylinderMeshRef.current.add(ring2);
      cylinderMeshRef.current.add(ring);

      const cylinder = new THREE.CylinderGeometry(
        RingData.innerRadius,
        RingData.innerRadius,
        data.height,
        32,
        1,
        true
      );
      const cylinder2 = new THREE.Mesh(
        cylinder,
        (cylinderMeshRef.current.children[1] as THREE.Mesh)
          .material as THREE.MeshPhongMaterial
      );

      cylinderMeshRef.current.add(cylinder2);
      updateGroupGeometry(cylinderMeshRef.current, generalCylinder, false);
    } else if (caseOfInertia === CaseOfInertia.Thin) {
      updateGroupGeometry(cylinderMeshRef.current, generalCylinder);
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

    // console.log(mesh.children);
    if (toRemove) {
      const newChildren = mesh.children.slice(0, 2);
      mesh.children = [];
      newChildren.forEach((child) => {
        mesh.add(child);
      });
      // console.log("removing");
    }
    // console.log(mesh.children);
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

export default CylinderAnimation;
