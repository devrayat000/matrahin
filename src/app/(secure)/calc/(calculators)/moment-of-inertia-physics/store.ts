import { atom } from "jotai";
import { CaseOfInertia } from "~/services/Moment_of_inertia";
import * as THREE from "three";

export const caseTypeAtom = atom<CaseOfInertia>(CaseOfInertia.Solid);

export const solidMaterial = new THREE.MeshPhongMaterial({
  color: new THREE.Color(0x069fec),
  emissive: new THREE.Color(0x072534),
  side: THREE.DoubleSide,
  flatShading: true,
});

export const wireframeMaterial = new THREE.LineBasicMaterial({
  color: new THREE.Color(0xffffff),
  transparent: true,
  opacity: 0.6,
});
