import * as THREE from "three";
import { TIME_STEP } from "~/components/common/CanvasTHREE/store";
import { END_OF_ROAD } from "~/components/project/collisions/store";

const BoundingBox = new THREE.Box3();
const vec = new THREE.Vector3();
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const matrix4 = new THREE.Matrix4();
const precision = 1;

const checkIfReachedEndOfRoad = (mesh: THREE.Mesh, size: number) => {
  return (
    mesh.position.z + size > END_OF_ROAD ||
    mesh.position.z - size < -END_OF_ROAD
  );
};

/**
 * Calculates the velocities of two objects after a collision.
 *
 * @param m1 The mass of object 1.
 * @param v1 The velocity of object 1.
 * @param m2 The mass of object 2.
 * @param v2 The velocity of object 2.
 * @returns An object containing the final velocities of both objects.
 */
const calculateVelocityAfterCollision = (
  m1: number,
  v1: number,
  m2: number,
  v2: number
): { v1f: number; v2f: number } => {
  const v1f = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
  const v2f = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
  return { v1f, v2f };
};

/**
 * Updates the text content of HTML elements with the provided values.
 * @param v - The velocity value.
 * @param m - The mass value.
 * @param mText - The HTML paragraph element for displaying the mass value.
 * @param vText - The HTML paragraph element for displaying the velocity value.
 * @param pText - The HTML paragraph element for displaying the momentum value.
 * @param kEText - The HTML paragraph element for displaying the kinetic energy value.
 */
const updateText = (
  v: number,
  m: number,
  mText: HTMLParagraphElement,
  vText: HTMLParagraphElement,
  pText: HTMLParagraphElement,
  kEText: HTMLParagraphElement
) => {
  if (vText) vText.innerText = v.toFixed(precision);
  if (mText) mText.innerText = m.toFixed(precision);
  if (pText) pText.innerText = (m * v).toFixed(precision);
  if (kEText) kEText.innerText = (0.5 * m * v * v).toFixed(precision);
};

/**
 * Updates the total kinetic energy and displays it in the specified HTML paragraph element.
 * @param totalKE - The total kinetic energy value to be displayed.
 * @param totalKEText - The HTML paragraph element where the total kinetic energy will be displayed.
 */
const updateTotalKE = (totalKE: number, totalKEText: HTMLParagraphElement) => {
  if (totalKEText) totalKEText.innerText = totalKE.toFixed(precision);
};

/**
 * Updates the total potential energy value and displays it in the given HTML paragraph element.
 * @param totalPE - The total potential energy value to be updated.
 * @param totalPEText - The HTML paragraph element where the updated value will be displayed.
 */
const updateTotalMomentum = (
  totalPE: number,
  totalPEText: HTMLParagraphElement
) => {
  if (totalPEText) totalPEText.innerText = totalPE.toFixed(precision);
};

/**
 * Updates the arrow helper to visualize the direction and magnitude of a velocity vector.
 * @param arrow - The arrow helper object.
 * @param mesh - The mesh object representing the object's position.
 * @param v - The magnitude of the velocity.
 */
const updateArrows = (
  arrow: THREE.ArrowHelper,
  position: number,
  v: number
) => {
  if (!arrow) return;
  arrow.setDirection(vec.set(0, 0, v).normalize());
  arrow.position.z = position;
  arrow.setLength(Math.abs(v / TIME_STEP));

  // hide the arrow if the velocity is 0
  arrow.visible = v !== 0;
};

/**
 * Checks if two objects collide with each other. It uses the bounding boxes of the objects to check for collision.
 * @param object1 The first object to check for collision.
 * @param object2 The second object to check for collision.
 * @returns True if the objects collide, false otherwise.
 */
const checkCollision = (
  object1: THREE.Object3D<THREE.Object3DEventMap>,
  object2: THREE.Object3D<THREE.Object3DEventMap>
) => {
  const box1 = BoundingBox.clone();
  const box2 = BoundingBox.clone();
  box2.setFromObject(object1);
  box1.setFromObject(object2);
  return box1.intersectsBox(box2);
};

/**
 *
 * @param size size of the box
 * @param count count of the box. count= 1 -> right , 2 -> left
 * @returns THREE.Vector3 object to use as position
 */
const getDefaultPositionOfBox = (size: number, count: number): THREE.Vector3 =>
  vec.clone().set(0, size / 2, 10 * (count === 1 ? 1 : -1));

const getKE = (m: number, v: number) =>
  (0.5 * m * v * v) / TIME_STEP / TIME_STEP;
const getMomentum = (m: number, v: number) => (m * v) / TIME_STEP;

const getTotalKE = (m1: number, v1: number, m2: number, v2: number): number =>
  getKE(m1, v1) + getKE(m2, v2);

const getTotalMomentum = (
  m1: number,
  v1: number,
  m2: number,
  v2: number
): number => getMomentum(m1, v1) + getMomentum(m2, v2);

const getSizeOfBox = (m: number) => 1 + m / 10;

export {
  boxGeometry,
  calculateVelocityAfterCollision,
  checkCollision,
  checkIfReachedEndOfRoad,
  getDefaultPositionOfBox,
  getSizeOfBox,
  getTotalKE,
  getTotalMomentum,
  matrix4,
  updateArrows,
  updateText,
  updateTotalKE,
  updateTotalMomentum,
  vec,
};
