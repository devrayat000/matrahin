"use client";
import { useEffect } from "react";
import WebGPU from "three/examples/jsm/capabilities/WebGPU";
// import WebGPURenderer from "three/examples/jsm/renderers/webgpu/WebGPURenderer";
const Animation = () => {
  // useEffect(() => {
  //   // if (WebGPU.isAvailable() === false) {
  //   //   document.body.appendChild(WebGPU.getErrorMessage());

  //   //   throw new Error("No WebGPU support");
  //   // }
  //   alert(WebGPU.isAvailable());

  //   const canvas = document.getElementById(
  //     "myThreeJsCanvas"
  //   ) as HTMLCanvasElement;
  //   const renderer = new THREE.WebGLRenderer({ canvas: canvas });

  //   renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  //   const fov = 45;
  //   const aspect = canvas.clientWidth / canvas.clientHeight;
  //   const near = 1;
  //   const far = 2000;
  //   const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  //   camera.position.set(0, 0, 1000);

  //   const scene = new THREE.Scene();

  //   const light = new THREE.DirectionalLight(0xffffff, 1);
  //   light.position.set(0, 0, 1000);
  //   scene.add(light);

  //   const geometry = new THREE.BoxGeometry(400, 400, 400);
  //   const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  //   const box = new THREE.Mesh(geometry, material);
  //   scene.add(box);

  //   const animate = () => {
  //     requestAnimationFrame(animate);
  //     box.rotation.x += 0.01;
  //     box.rotation.y += 0.01;
  //     renderer.render(scene, camera);
  //   };
  //   animate();
  // }, []);
  useEffect(() => {
    const isWebGPUAvailable = WebGPU.isAvailable();

    if (isWebGPUAvailable) {
      alert("WebGPU is available!");
      // Proceed with WebGPU setup
    } else {
      alert("WebGPU is not available.");
      // Handle the case where WebGPU is not supported
    }
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" style={{ width: "70vw" }} />
    </div>
  );
};

export default Animation;
