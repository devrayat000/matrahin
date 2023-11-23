import { Boat_River_Output } from "~/services/Boat_River";

export const boatRiverSchema = [
  {
    name: "vb_vt",
    label: "Boat Velocity (v<sub>b</sub>), River Velocity (v<sub>r</sub>)",
    fields: [
      {
        name: "vb",
        label: "Boat Velocity (v<sub>b</sub>)",
        type: "number",
      },
      {
        name: "vs",
        label: "River Velocity (v<sub>r</sub>)",
        type: "number",
      },
      {
        name: "width",
        label: "Width of River",
        type: "number",
      },
    ],
  },
  {
    name: "vb_vt_angle",
    label:
      "Initial Angle (α), Boat Velocity (v<sub>b</sub>), River Velocity (v<sub>r</sub>)",
    fields: [
      {
        name: "vb",
        label: "Boat Velocity (v<sub>b</sub>)",
        type: "number",
      },
      {
        name: "vs",
        label: "River Velocity (v<sub>r</sub>)",
        type: "number",
      },
      {
        name: "width",
        label: "Width of River (m)",
        type: "number",
      },
      {
        name: "angle_i",
        label: "Initial Angle (α)",
        type: "number",
      },
    ],
  },
];

const resultDetailsFields: {
  name: keyof Boat_River_Output;
  label: string;
  type: "number" | "string";
}[] = [
  {
    name: "t",
    label: "Time Taken to Reach (s)",
    type: "number",
  },
  {
    name: "v",
    label: "Resultant Velocity Magnitude |V| (m/s)",
    type: "number",
  },
  {
    name: "angle_r",
    label: "Resultant Velocity Angle (theta) (degree)",
    type: "number",
  },
  {
    name: "dd",
    label: "Distance Traveled Diagonally (m)",
    type: "number",
  },
  {
    name: "dx",
    label: "Distance Traveled Parallel to the river (m)",
    type: "number",
  },
  {
    name: "dy",
    label: "Distance Traveled Perpendicular to the river (m)",
    type: "number",
  },
];

export const resultSchema = ((schema: typeof boatRiverSchema) => {
  const fields = schema.flatMap((s) => s.fields).concat(resultDetailsFields);
  const names = fields.map((f) => f.name);
  const uniqueNames = [...new Set(names)];
  const params: {
    name: keyof Boat_River_Output;
    label: string;
  }[] = [];

  for (const it of uniqueNames) {
    const idx = fields.findIndex((f) => f.name === it);
    params.push({
      name: it as unknown as keyof Boat_River_Output,
      label: fields[idx].label,
    });
  }

  return params;
})(boatRiverSchema);
