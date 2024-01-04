import { StaticImageData } from "next/image";
import Circle from "~/assets/images/moment_of_inertia/Circle.png";
import Cuboid from "~/assets/images/moment_of_inertia/Cuboid.png";
import HollowCyl from "~/assets/images/moment_of_inertia/HollowCyl.png";
import HollowDisk from "~/assets/images/moment_of_inertia/HollowDisk.png";
import HollowSphere from "~/assets/images/moment_of_inertia/HollowSphere.png";
import RectPlate from "~/assets/images/moment_of_inertia/RectPlate.png";
import Rod from "~/assets/images/moment_of_inertia/Rod.png";
import SolidCyl from "~/assets/images/moment_of_inertia/SolidCyl.png";
import SolidDisk from "~/assets/images/moment_of_inertia/SolidDisk.png";
import SolidSphere from "~/assets/images/moment_of_inertia/SolidSphere.png";

import ThinCyl from "~/assets/images/moment_of_inertia/ThinCyl.png";
import ThinSphere from "~/assets/images/moment_of_inertia/ThinSphere.png";
import TwoMass from "~/assets/images/moment_of_inertia/TwoMass.png";
import PointMassImage from "~/assets/images/moment_of_inertia/point_mass2.jpeg";
import UnitConverter, {
  lenghtConverter,
  massConverter,
} from "~/lib/UnitConverter";
import { CaseOfInertia, ShapesOfInertia } from "~/services/Moment_of_inertia";

export type momentOfInertiaSchema = {
  title: string;
  path: string;
  subtitle: string;
  image: StaticImageData;
  shape: ShapesOfInertia;
  options: {
    id: ShapesOfInertia;
    image: StaticImageData;
    title: string;
    shape: ShapesOfInertia;
    axes: string[];
    case: CaseOfInertia;
    description: string[];
    fields: {
      name: string;
      label: string;
      type: string;
      converter: UnitConverter<string>;
    }[];
  }[];
}[];

const constants: momentOfInertiaSchema = [
  // point-mass
  {
    path: "point-mass",
    shape: ShapesOfInertia.PointMass,
    title: "Point Mass",
    subtitle:
      "Moment of inertia is the rotational equivalent of mass. It is a measure of an object's resistance to changes in its rotation rate.",
    image: PointMassImage,
    options: [
      {
        id: ShapesOfInertia.PointMass,
        image: PointMassImage,
        title: "Point Mass",
        shape: ShapesOfInertia.PointMass,
        axes: ["central axis"],
        case: CaseOfInertia.None,
        description: [
          "\\[I = \\ M \\cdot r^2\\] I is the mass moment of inertia of a particle (point mass).",
        ],
        fields: [
          {
            name: "mass",
            label: "Mass (M)",
            type: "number",
            converter: massConverter,
          },
          {
            name: "radius",
            label: "Radius (r)",
            type: "number",
            converter: lenghtConverter,
          },
        ],
      },
    ],
  },
  // two-point-mass
  {
    path: "two-point-mass",
    title: "Two Point Mass",
    shape: ShapesOfInertia.TwoMass,
    subtitle:
      "Moment of inertia is the rotational equivalent of mass. It is a measure of an object's resistance to changes in its rotation rate.",
    image: TwoMass,
    options: [
      {
        id: ShapesOfInertia.TwoMass,
        image: TwoMass,
        shape: ShapesOfInertia.TwoMass,
        axes: ["axis at center of mass"],
        case: CaseOfInertia.None,
        title: "Two Point Mass",
        description: [
          "\\[I = \\frac{M \\cdot m}{M + m} \\cdot d^2\\] I is the moment of inertia of two point masses about their center of mass.",
        ],
        fields: [
          {
            name: "mass",
            label: "Mass (M)",
            type: "number",
            converter: massConverter,
          },
          {
            name: "mass2",
            label: "Mass 2 (m)",
            type: "number",
            converter: massConverter,
          },
          {
            name: "distance",
            label: "Distance (d)",
            type: "number",
            converter: lenghtConverter,
          },
        ],
      },
    ],
  },
  // rectangular-plate
  {
    path: "rectangular-plate",
    title: "Rectangular Plate",
    shape: ShapesOfInertia.Plate,
    subtitle:
      "Moment of inertia is the rotational equivalent of mass. It is a measure of an object's resistance to changes in its rotation rate.",

    image: RectPlate,
    options: [
      {
        id: ShapesOfInertia.Plate,
        image: RectPlate,
        title: "Rectangular Plate",
        shape: ShapesOfInertia.Plate,
        axes: [
          "the perpendicular central axis",
          "a symmetry axis in the plate plane",
          "axis at the end of the plate",
        ],
        case: CaseOfInertia.None,
        description: [
          "About perpendicular central axis \\[I_z = \\frac{1}{12} \\cdot m \\cdot (h^2 + w^2)\\] ",
          "About symmetry axis in the plate plane \\[I_x = I_y = \\frac{1}{24} \\cdot m \\cdot (h^2 + w^2)\\]",
          "About axis at the end of the plate \\[I_e = \\frac{1}{12} \\cdot m \\cdot (4 \\cdot h^2 + w^2)\\]",
        ],
        fields: [
          {
            name: "mass",
            label: "Mass (m)",
            type: "number",
            converter: massConverter,
          },
          {
            name: "height",
            label: "Height (h)",
            type: "number",
            converter: lenghtConverter,
          },
          {
            name: "width",
            label: "Width (w)",
            type: "number",
            converter: lenghtConverter,
          },
        ],
      },
    ],
  },
  // rod
  {
    path: "rod",
    title: "Thin Rod",
    shape: ShapesOfInertia.Rod,
    subtitle:
      "Moment of inertia is the rotational equivalent of mass. It is a measure of an object's resistance to changes in its rotation rate.",
    image: Rod,
    options: [
      {
        id: ShapesOfInertia.Rod,
        image: Rod,
        title: "Thin Rod",
        shape: ShapesOfInertia.Rod,
        axes: ["central axis", "", "axis at end"],
        case: CaseOfInertia.None,
        description: [
          "About central axis \\[I_z = \\frac{1}{12} \\cdot M \\cdot L^2\\]",
          "About axis at end \\[I_e = \\frac{1}{3} \\cdot M \\cdot L^2\\]",
        ],
        fields: [
          {
            name: "mass",
            label: "Mass (M)",
            type: "number",
            converter: massConverter,
          },
          {
            name: "length",
            label: "Length (L)",
            type: "number",
            converter: lenghtConverter,
          },
        ],
      },
    ],
  },
  // solid-cuboid
  {
    path: "solid-cuboid",
    title: "Solid Cuboid",
    shape: ShapesOfInertia.Cuboid,
    subtitle:
      "Moment of inertia is the rotational equivalent of mass. It is a measure of an object's resistance to changes in its rotation rate.",
    image: Cuboid,
    options: [
      {
        id: ShapesOfInertia.Cuboid,
        image: Cuboid,
        title: "Solid Cuboid",
        shape: ShapesOfInertia.Cuboid,
        axes: [
          "Central axis along height",
          "Central axis along width",
          "Central axis along depth",
        ],
        case: CaseOfInertia.None,
        description: [
          "About central axis along height \\[I_h = \\frac{1}{12} \\cdot M \\cdot (w^2 + d^2)\\]",
          "About central axis along width \\[I_w = \\frac{1}{12} \\cdot M \\cdot (h^2 + d^2)\\]",
          "About central axis along depth \\[I_d = \\frac{1}{12} \\cdot M \\cdot (h^2 + w^2)\\]",
        ],
        fields: [
          {
            name: "mass",
            label: "Mass (M)",
            type: "number",
            converter: massConverter,
          },
          {
            name: "height",
            label: "Height (h)",
            type: "number",
            converter: lenghtConverter,
          },
          {
            name: "width",
            label: "Width (w)",
            type: "number",
            converter: lenghtConverter,
          },
          {
            name: "depth",
            label: "Depth (d)",
            type: "number",
            converter: lenghtConverter,
          },
        ],
      },
    ],
  },
  // cylinder
  {
    path: "cylinder",
    title: "Cylinder",
    shape: ShapesOfInertia.Cylinder,
    subtitle:
      "Moment of inertia is the rotational equivalent of mass. It is a measure of an object's resistance to changes in its rotation rate.",
    image: SolidCyl,
    options: [
      {
        id: ShapesOfInertia.Cylinder,
        image: SolidCyl,
        title: "Solid Cylinder",
        shape: ShapesOfInertia.Cylinder,
        axes: ["Central axis along height", "Axis through diameter"],
        case: CaseOfInertia.Solid,
        description: [
          "About central axis along height \\[I_z = \\frac{1}{2} \\cdot m \\cdot R^2\\]",
          "About axis through diameter \\[I_x = I_y = \\frac{1}{4} \\cdot m \\cdot R^2 + \\frac{1}{12} \\cdot m \\cdot h^2 \\]",
        ],
        fields: [
          {
            name: "mass",
            label: "Mass (m)",
            type: "number",
            converter: massConverter,
          },
          {
            name: "radius",
            label: "Radius (R)",
            type: "number",
            converter: lenghtConverter,
          },

          {
            name: "height",
            label: "Height (for axis along diameter) (h)",
            type: "number",
            converter: lenghtConverter,
          },
        ],
      },
      {
        id: ShapesOfInertia.Cylinder,
        image: HollowCyl,
        title: "Hollow Cylinder",
        shape: ShapesOfInertia.Cylinder,
        axes: ["Central axis along height", "Axis through diameter"],
        case: CaseOfInertia.Hollow,
        description: [
          "About Central axis along height \\[I_z = \\frac{1}{2} \\cdot m \\cdot (R^2 + r^2) \\] ",
          "About axis through diameter \\[I_x = I_y = \\frac{1}{4} \\cdot m \\cdot (R^2 + r^2) + \\frac{1}{12} \\cdot m \\cdot h^2 \\]",
        ],
        fields: [
          {
            name: "mass",
            label: "Mass (M)",
            type: "number",
            converter: massConverter,
          },

          {
            name: "radius",
            label: "Outer Radius (R)",
            type: "number",
            converter: lenghtConverter,
          },
          {
            name: "innerRadius",
            label: "Inner Radius (r)",
            type: "number",
            converter: lenghtConverter,
          },
          {
            name: "height",
            label: "Height (for axis along diameter) (h)",
            type: "number",
            converter: lenghtConverter,
          },
        ],
      },
      {
        id: ShapesOfInertia.Cylinder,
        image: ThinCyl,
        title: "Thin Cylinder",
        shape: ShapesOfInertia.Cylinder,
        axes: ["Central axis along height", "Axis through diameter"],
        case: CaseOfInertia.Thin,
        description: [
          "About Central axis along height \\[I_z = m \\cdot R^2 \\] ",
          "About axis through diameter \\[I_x = I_y = \\frac{1}{2} \\cdot m \\cdot R^2 + \\frac{1}{12} \\cdot m \\cdot h^2  \\]",
        ],
        fields: [
          {
            name: "mass",
            label: "Mass (m)",
            type: "number",
            converter: massConverter,
          },

          {
            name: "radius",
            label: "Radius (R)",
            type: "number",
            converter: lenghtConverter,
          },
          {
            name: "height",
            label: "Height (for axis along diameter) (h)",
            type: "number",
            converter: lenghtConverter,
          },
        ],
      },
    ],
  },
  // sphere
  {
    path: "sphere",
    title: "Sphere",
    shape: ShapesOfInertia.Sphere,
    subtitle:
      "Moment of inertia is the rotational equivalent of mass. It is a measure of an object's resistance to changes in its rotation rate.",
    image: ThinSphere,
    options: [
      {
        id: ShapesOfInertia.Sphere,
        image: SolidSphere,
        title: "Solid Sphere",
        shape: ShapesOfInertia.Sphere,
        axes: ["About diameter"],
        case: CaseOfInertia.Solid,
        description: [
          "About diameter \\[I = \\frac{2}{5} \\cdot m \\cdot R^2\\]",
        ],
        fields: [
          {
            name: "mass",
            label: "Mass (m)",
            type: "number",
            converter: massConverter,
          },
          {
            name: "radius",
            label: "Radius (R)",
            type: "number",
            converter: lenghtConverter,
          },
        ],
      },
      {
        id: ShapesOfInertia.Sphere,
        image: HollowSphere,
        title: "Hollow Sphere",
        shape: ShapesOfInertia.Sphere,
        axes: ["About diameter"],
        case: CaseOfInertia.Hollow,
        description: [
          "About diameter \\[I = \\frac{2}{5} \\cdot m \\cdot \\frac{R^5 - r^5}{R^3 - r^3}\\]",
        ],
        fields: [
          {
            name: "mass",
            label: "Mass (m)",
            type: "number",
            converter: massConverter,
          },

          {
            name: "radius",
            label: "Outer Radius (R)",
            type: "number",
            converter: lenghtConverter,
          },
          {
            name: "innerRadius",
            label: "Inner Radius (r)",
            type: "number",
            converter: lenghtConverter,
          },
        ],
      },
      {
        id: ShapesOfInertia.Sphere,
        image: ThinSphere,
        title: "Thin Sphere",
        shape: ShapesOfInertia.Sphere,
        axes: ["About diameter"],
        case: CaseOfInertia.Thin,
        description: [
          "About diameter \\[I = \\frac{2}{3} \\cdot m \\cdot R^2\\]",
        ],
        fields: [
          {
            name: "mass",
            label: "Mass (m)",
            type: "number",
            converter: massConverter,
          },

          {
            name: "radius",
            label: "Radius (R)",
            type: "number",
            converter: lenghtConverter,
          },
        ],
      },
    ],
  },
  // disk
  {
    path: "disk",
    title: "Disk Or Circle",
    shape: ShapesOfInertia.Disk,
    subtitle:
      "Moment of inertia is the rotational equivalent of mass. It is a measure of an object's resistance to changes in its rotation rate.",
    image: PointMassImage,
    options: [
      {
        id: ShapesOfInertia.Disk,
        image: SolidDisk,
        title: "Solid Disk",
        shape: ShapesOfInertia.Disk,
        axes: ["About Central Axis", "About diameter"],
        case: CaseOfInertia.Solid,
        description: [
          "About central axis \\[I_z = \\frac{1}{2} \\cdot m \\cdot R^2\\]",
          "About diameter \\[I_x = I_y = \\frac{1}{4} \\cdot m \\cdot R^2\\]",
        ],
        fields: [
          {
            name: "mass",
            label: "Mass (m)",
            type: "number",
            converter: massConverter,
          },
          {
            name: "radius",
            label: "Radius (R)",
            type: "number",
            converter: lenghtConverter,
          },
        ],
      },
      {
        id: ShapesOfInertia.Disk,
        image: HollowDisk,
        title: "Anulus",
        shape: ShapesOfInertia.Disk,
        axes: ["About Central Axis", "About diameter"],
        case: CaseOfInertia.Hollow,
        description: [
          "About central axis \\[I_z = \\frac{1}{2} \\cdot m \\cdot (R^2 + r^2)\\]",

          "About diameter \\[I_x = I_y = \\frac{1}{4} \\cdot m \\cdot (R^2 + r^2)\\]",
        ],
        fields: [
          {
            name: "mass",
            label: "Mass (m)",
            type: "number",
            converter: massConverter,
          },

          {
            name: "radius",
            label: "Outer Radius (R)",
            type: "number",
            converter: lenghtConverter,
          },
          {
            name: "innerRadius",
            label: "Inner Radius (r)",
            type: "number",
            converter: lenghtConverter,
          },
        ],
      },
      {
        id: ShapesOfInertia.Disk,
        image: Circle,
        title: "Circle",
        shape: ShapesOfInertia.Disk,
        axes: ["About Central Axis", "About diameter"],
        case: CaseOfInertia.Thin,
        description: [
          "Moment of inertia about central axis: \\[ I_z =  \\frac{1}{2} \\cdot M \\cdot R^2\\]",

          "Moment of inertia about diameter: \\[I_x = I_y = \\frac{1}{4} \\cdot M \\cdot R^2\\]",
        ],
        fields: [
          {
            name: "mass",
            label: "Mass (M)",
            type: "number",
            converter: massConverter,
          },

          {
            name: "radius",
            label: "Radius (R)",
            type: "number",
            converter: lenghtConverter,
          },
        ],
      },
    ],
  },
];

export default constants;
