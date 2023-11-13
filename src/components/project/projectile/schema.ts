import { ProjectileOutput } from "~/services/Projectile";

export const projectileSchema = [
  {
    name: "vi_angle",
    label: "Initial Velocity (v<sub>i</sub>), Launch Angle (α)",
    fields: [
      { name: "vi", label: "Initial Velocity (v<sub>i</sub>)", type: "number" },
      { name: "angle", label: "Launch Angle (α)", type: "number" },
    ],
  },
  {
    name: "ym_xm",
    label: "Horizontal Distance (R), Max. Height (h<sub>m</sub>)",
    fields: [
      { name: "xm", label: "Horizontal Distance (R)", type: "number" },
      { name: "ym", label: "Max. Height (h<sub>m</sub>)", type: "number" },
    ],
  },
  {
    name: "vi_t",
    label: "Initial Velocity (v<sub>i</sub>), Time of Flight (t)",
    fields: [
      { name: "vi", label: "Initial Velocity (v<sub>i</sub>)", type: "number" },
      { name: "t", label: "Time of Flight (t)", type: "number" },
    ],
  },
  {
    name: "vi_ym",
    label: "Initial Velocity (v<sub>i</sub>), Max. Height (h<sub>m</sub>)",
    fields: [
      { name: "vi", label: "Initial Velocity (v<sub>i</sub>)", type: "number" },
      { name: "ym", label: "Max. Height (h<sub>m</sub>)", type: "number" },
    ],
  },
  {
    name: "t_xm",
    label: "Horizontal Distance (R), Time of Flight (t)",
    fields: [
      { name: "t", label: "Time of Flight (t)", type: "number" },
      { name: "xm", label: "Horizontal Distance (R)", type: "number" },
    ],
  },
  {
    name: "vi_xm",
    label: "Initial Velocity (v<sub>i</sub>), Horizontal Distance (R)",
    fields: [
      { name: "vi", label: "Initial Velocity (v<sub>i</sub>)", type: "number" },
      { name: "xm", label: "Horizontal Distance (R)", type: "number" },
    ],
  },
  {
    name: "angle_xm",
    label: "Launch Angle (α), Horizontal Distance (R)",
    fields: [
      { name: "angle", label: "Launch Angle (α)", type: "number" },
      { name: "xm", label: "Horizontal Distance (R)", type: "number" },
    ],
  },
  {
    name: "angle_t",
    label: "Launch Angle (α), Time of Flight (t)",
    fields: [
      { name: "angle", label: "Launch Angle (α)", type: "number" },
      { name: "t", label: "Time of Flight (t)", type: "number" },
    ],
  },
  {
    name: "angle_ym",
    label: "Launch Angle (α), Max. Height (h<sub>m</sub>)",
    fields: [
      { name: "angle", label: "Launch Angle (α)", type: "number" },
      { name: "ym", label: "Max. Height (h<sub>m</sub>)", type: "number" },
    ],
  },
];

export const resultSchema = ((schema: typeof projectileSchema) => {
  const fields = schema.flatMap((s) => s.fields);
  const names = schema.flatMap((s) => s.fields).map((f) => f.name);
  const uniqueNames = [...new Set(names)];

  const params: {
    name: keyof ProjectileOutput;
    label: string;
  }[] = [{ name: "g", label: "Gravity" }];

  for (const it of uniqueNames) {
    const idx = fields.findIndex((f) => f.name === it);
    params.push({
      name: it as unknown as keyof ProjectileOutput,
      label: fields[idx].label,
    });
  }

  return params;
})(projectileSchema);
