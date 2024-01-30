import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
// import {
//   tslFn,
//   texture,
//   uv,
//   uint,
//   positionWorld,
//   modelWorldMatrix,
//   cameraViewMatrix,
//   timerLocal,
//   timerDelta,
//   cameraProjectionMatrix,
//   vec2,
//   instanceIndex,
//   positionGeometry,
//   storage,
//   MeshBasicNodeMaterial,
//   If,
// } from "three/nodes";

// import WebGPU from "three/addons/capabilities/WebGPU";

// import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils";

export default class SceneInit {
  scene: THREE.Scene | undefined;
  camera: THREE.PerspectiveCamera | undefined;
  renderer: THREE.WebGLRenderer | undefined;
  fov: number;
  nearPlane: number;
  farPlane: number;
  canvasId: string;
  clock: THREE.Clock | undefined;
  stats: Stats | undefined;
  controls: OrbitControls | undefined;
  spotLight: THREE.SpotLight | undefined;
  ambientLight: THREE.AmbientLight | undefined;
  uniforms: { [uniform: string]: { type: string; value: any } };
  loader: THREE.TextureLoader | undefined;
  directionalLight: THREE.DirectionalLight;
  axesHelper: THREE.AxesHelper | undefined;

  width: number;
  constructor(canvasId: string) {
    // NOTE: Core components to initialize Three.js app.
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;

    // NOTE: Camera params;
    this.fov = 10;
    this.nearPlane = 1;
    this.farPlane = 1000;
    this.canvasId = canvasId;

    // NOTE: Additional components.
    this.clock = undefined;
    this.stats = undefined;
    this.controls = undefined;

    // NOTE: Lighting is basically required.
    this.spotLight = undefined;
    this.directionalLight = undefined;
    this.ambientLight = undefined;
    this.axesHelper = undefined;
    // NOTE: for positioning in html page :
    this.width = window.innerWidth;
  }

  initialize() {
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0x444444);
    this.scene.background = new THREE.Color(0xffffff);
    this.camera = new THREE.PerspectiveCamera(45, 1.5, 1, 1000);
    this.camera.position.set(8, 2, 0);
    this.camera.lookAt(0, 1, 0);

    // NOTE: Specify a canvas which is already created in the HTML.
    const canvas = document.getElementById(this.canvasId);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      // NOTE: Anti-aliasing smooths out the edges.
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // setting size of canvas
    this.width = canvas.clientWidth * 1;
    // this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.aspect = 1.5;
    this.renderer.setSize(this.width, this.width / this.camera.aspect);
    // this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.enableZoom = false; // zoom disabled

    // NOTE: Add lighting.
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
    hemiLight.position.set(0, 20, 0);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(8, 8, -10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = -2;
    dirLight.shadow.camera.left = -2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    this.scene.add(dirLight);
    // if window resizes
    window.addEventListener("resize", () => this.onWindowResize(), false);

    this.renderer.shadowMap.enabled = true;
  }

  animate() {
    // NOTE: Window is implied.
    // requestAnimationFrame(this.animate.bind(this));
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    // this.stats.update();
    this.controls.update();
  }

  render() {
    // NOTE: Update uniform data on each render.
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    // this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.aspect = 1.5;
    this.renderer.setSize(this.width, this.width / this.camera.aspect);

    // this.width = window.innerWidth * 1.25;
    this.camera.updateProjectionMatrix();
  }
}
