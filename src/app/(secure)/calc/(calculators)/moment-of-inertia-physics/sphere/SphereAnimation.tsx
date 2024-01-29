"use client";

import { useEffect, useRef } from "react";

import * as THREE from "three";

import { useAtomValue } from "jotai";
import { CaseOfInertia } from "~/services/Moment_of_inertia";
import SceneInit from "../sceneInit";
import { caseTypeAtom, rotationSpeed } from "../store";

const SphereAnimation = () => {
  const caseOfInertia = useAtomValue(caseTypeAtom);
  const sphereMeshRef = useRef<THREE.Group<THREE.Object3DEventMap>>();
  const test = useRef<SceneInit>();
  useEffect(() => {
    test.current = new SceneInit("myThreeJsCanvas");
    test.current.initialize();
    test.current.animate();

    const backGroundTexture = new THREE.TextureLoader().load("/space.jpeg");
    test.current.scene.background = backGroundTexture;

    const group = new THREE.Group();

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute([], 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
    });
    const meshMaterial = new THREE.MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true,
    });

    group.add(new THREE.LineSegments(geometry, lineMaterial));
    group.add(new THREE.Mesh(geometry, meshMaterial));

    test.current.scene.add(group);
    sphereMeshRef.current = group;

    const speed = rotationSpeed;
    const animate = () => {
      group.rotateY(speed);
      window.requestAnimationFrame(animate);
    };
    animate();

    // return () => {
    //   // Cleanup: remove the mesh from the scene
    //   if (sphereMeshRef.current) {
    //     test.current.scene.remove(sphereMeshRef.current);
    //     sphereMeshRef.current.children.forEach((child) => {
    //       if (child instanceof THREE.Mesh) {
    //         child.geometry.dispose();
    //         child.material.dispose();
    //       }
    //     });
    //   }
    // };
  }, []);

  useEffect(() => {
    if (!sphereMeshRef.current) return;

    const data = {
      radius: 3,
      innerRadius: 1,
      widthSegments: 32,
      heightSegments: 16,
      phiStart: 0,
      phiLength: Math.PI * 2,
      thetaStart: 0,
      thetaLength: Math.PI,
    };

    let texture: THREE.Texture | undefined = undefined;
    const geometry = new THREE.SphereGeometry(
      data.radius,
      data.widthSegments,
      data.heightSegments,
      data.phiStart,
      data.phiLength,
      data.thetaStart,
      data.thetaLength
    );

    if (caseOfInertia === CaseOfInertia.Solid) {
      texture = new THREE.TextureLoader().load("/earth.jpeg");
      texture.colorSpace = THREE.SRGBColorSpace;
      updateGroupGeometry(sphereMeshRef.current, geometry, texture);
    }
    // todo: fix it:

    if (caseOfInertia === CaseOfInertia.Hollow) {
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
      // ringGeometry.rotateX(Math.PI / 2);
      const ring = new THREE.Mesh(
        ringGeometry,
        (sphereMeshRef.current.children[1] as THREE.Mesh)
          .material as THREE.MeshPhongMaterial
      );

      ring.rotateZ(Math.PI / 2);
      ring.rotateX(Math.PI / 2);
      ring.position.y = data.radius;
      sphereMeshRef.current.add(ring);
      updateGroupGeometry(
        sphereMeshRef.current,
        new THREE.SphereGeometry(
          data.radius,
          data.widthSegments,
          data.heightSegments,
          data.phiStart,
          (data.phiLength * 3) / 4,
          data.thetaStart,
          data.thetaLength
        )
      );
    }

    if (caseOfInertia === CaseOfInertia.Thin) {
      updateGroupGeometry(sphereMeshRef.current, geometry);
    }
  }, [caseOfInertia]);

  function updateGroupGeometry(
    mesh: THREE.Mesh | THREE.Group,
    geometry: THREE.BufferGeometry,
    texture: THREE.Texture | undefined = undefined,
    toRemove: boolean = true
  ) {
    if (texture !== undefined) {
      (mesh.children[1] as THREE.Mesh).material = new THREE.MeshBasicMaterial({
        map: texture,
        // wireframe: true,
      });

      ((mesh.children[0] as THREE.Mesh).material as THREE.Material).opacity = 0;
    } else {
      const meshMaterial = new THREE.MeshPhongMaterial({
        color: 0x069fec,
        emissive: 0x072534,
        side: THREE.DoubleSide,
        flatShading: true,
      });
      (mesh.children[1] as THREE.Mesh).material = meshMaterial;
      (
        (mesh.children[0] as THREE.Mesh).material as THREE.Material
      ).opacity = 0.5;
    }
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
      <canvas id="myThreeJsCanvas" className="max-w-full lg:max-w-full " />
    </div>
  );
};

export default SphereAnimation;
