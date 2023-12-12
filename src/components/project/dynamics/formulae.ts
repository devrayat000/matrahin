export function a(params: {
  v?: number | "";
  u?: number | "";
  t?: number | "";
  s?: number | "";
}) {
  const { v, u, t, s } = params;
  if (v && u && t) {
    return (v - u) / t;
  } else if (v && u && s) {
    return (v * v - u * u) / (2 * s);
  } else if (u && s && t) {
    return (2 * (s - u * t)) / t ** 2;
  } else if (v && s && t) {
    return (2 * (v * t - s)) / t ** 2;
  } else {
    return "";
  }
}

export function s(params: {
  v?: number | "";
  u?: number | "";
  t?: number | "";
  a?: number | "";
}) {
  const { v, u, t, a } = params;
  if (v && u && t) {
    return ((v + u) / 2) * t;
  } else if (u && v && a) {
    return (v * v - u * u) / (2 * a);
  } else if (u && a && t) {
    return u * t + (a * t ** 2) / 2;
  } else if (v && a && t) {
    return v * t - (a * t ** 2) / 2;
  } else {
    return "";
  }
}

export function v(params: {
  s?: number | "";
  u?: number | "";
  t?: number | "";
  a?: number | "";
}) {
  const { s, u, t, a } = params;
  if (s && u && t) {
    return (2 * s) / t - u;
  } else if (u && a && t) {
    return u + a * t;
  } else if (s && a && t) {
    return (2 * s) / t - a * t;
  } else if (s && u && a) {
    return Math.sqrt(u * u + 2 * a * s);
  } else {
    return "";
  }
}

export function u(params: {
  v?: number | "";
  s?: number | "";
  t?: number | "";
  a?: number | "";
}) {
  const { v, s, t, a } = params;
  if (v && s && t) {
    return (2 * s) / t - v;
  } else if (v && a && t) {
    return v - a * t;
  } else if (s && a && t) {
    return (2 * s) / t - a * t;
  } else if (v && s && a) {
    return Math.sqrt(v * v - 2 * a * s);
  } else {
    return "";
  }
}

export function t(params: {
  v?: number | "";
  u?: number | "";
  s?: number | "";
  a?: number | "";
}) {
  const { v, u, s, a } = params;
  if (v && u && a) {
    return (v - u) / a;
  } else if (v && u && s) {
    return (2 * s) / (v + u);
  } else if (u && s && a) {
    return Math.sqrt((2 * s) / a);
  } else if (v && s && a) {
    return Math.sqrt((2 * s) / a);
  } else {
    return "";
  }
}
