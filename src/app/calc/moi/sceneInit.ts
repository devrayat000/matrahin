import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

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
    this.camera = new THREE.PerspectiveCamera(this.fov, 1, 0.1, 100);
    this.camera.position.z = 30;
    this.camera.position.y = 10;
    this.camera.position.x = 30;

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
    this.camera.aspect = 1;
    this.renderer.setSize(this.width, this.width);
    // this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.enableZoom = false; // zoom disabled

    // axes helper
    this.axesHelper = new THREE.AxesHelper(500);
    this.scene.add(this.axesHelper);

    // NOTE: Add lighting.

    const lights = [];
    lights[0] = new THREE.DirectionalLight(0xffffff, 3);
    lights[1] = new THREE.DirectionalLight(0xffffff, 3);
    lights[2] = new THREE.DirectionalLight(0xffffff, 3);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
    this.scene.add(lights[2]);

    // if window resizes
    window.addEventListener("resize", () => this.onWindowResize(), false);
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
    this.camera.aspect = 1;
    // this.width = window.innerWidth * 1.25;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.width,
      this.width

      // window.innerHeight / 3
    );
  }
}
