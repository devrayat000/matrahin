import { hc } from "./store";

export const drawTube = (ctx: CanvasRenderingContext2D) => {
  const width = 1000;
  const height = 700;

  ctx.lineWidth = 10;
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.roundRect(10, 10, width - 20, height - 10, [100]);
  ctx.stroke();
};

export const drawMetalBars = (ctx: CanvasRenderingContext2D) => {
  ctx.lineWidth = 40;
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.moveTo(100, 100);
  ctx.lineTo(100, 600);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(900, 100);
  ctx.lineTo(900, 600);
  ctx.stroke();
};

export const drawElectron = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
) => {
  if (x > 900 || x < 100 || !ctx) return;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, 2 * Math.PI);
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
  gradient.addColorStop(0, "white");
  gradient.addColorStop(1, "blue");
  ctx.fillStyle = gradient;
  ctx.fill();
  // ctx.textAlign = "center";
  // ctx.textBaseline = "middle";
  // ctx.textRendering = "optimizeLegibility";
  // ctx.font = "54px Arial";
  // ctx.fillText("e", x, y - 2);
};

const shouldAddElectron = (animationFrameCount: number, intensity: number) => {
  // const time = Math.ceil((animationFrameCount / 200) % 10);
  const intensityNew = intensity / 2;

  if (intensityNew === 0) return false;
  if (intensityNew === 1) return true;
  return animationFrameCount % Math.ceil((1 - intensityNew) * 10) === 0;
};
export const generateNewElectrons = (
  electrons: { x: number; y: number; v: number }[],
  intensity: number,
  animationFrameCount: number,
  velocityOfElectron: number
) => {
  if (shouldAddElectron(animationFrameCount, intensity)) {
    electrons.push({
      x: 140,
      y: Math.random() * 450 + 150,
      v: velocityOfElectron,
    });
  }
};

export const getLightProperties = (wavelength: number) => {
  // 440nm (681THz, 2.82eV)

  const energy = hc / (wavelength * 10 ** -9) / 1.6e-19;
  return `${wavelength.toFixed(0)}nm (${(1000 / wavelength).toFixed(
    2
  )}THz ${energy.toFixed(2)}eV)`;
};

/**
 *
 * @param wavelengthNano in nanometer
 * @param alpha optional opacity, is 1 if not set
 * @returns {string} css color
 */
export function wavelengthToRGB(wavelengthNano, intensity) {
  let wavelength = wavelengthNano;
  if (wavelengthNano < 380) {
    wavelength = 380;
  }
  var Gamma = 0.8,
    IntensityMax = 255,
    factor,
    red,
    green,
    blue;
  if (wavelength >= 380 && wavelength < 440) {
    red = -(wavelength - 440) / (440 - 380);
    green = 0.0;
    blue = 1.0;
  } else if (wavelength >= 440 && wavelength < 490) {
    red = 0.0;
    green = (wavelength - 440) / (490 - 440);
    blue = 1.0;
  } else if (wavelength >= 490 && wavelength < 510) {
    red = 0.0;
    green = 1.0;
    blue = -(wavelength - 510) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    red = (wavelength - 510) / (580 - 510);
    green = 1.0;
    blue = 0.0;
  } else if (wavelength >= 580 && wavelength < 645) {
    red = 1.0;
    green = -(wavelength - 645) / (645 - 580);
    blue = 0.0;
  } else if (wavelength >= 645 && wavelength < 781) {
    red = 1.0;
    green = 0.0;
    blue = 0.0;
  } else {
    red = 0.0;
    green = 0.0;
    blue = 0.0;
  }
  // Let the intensity fall off near the vision limits
  if (wavelength >= 380 && wavelength < 420) {
    factor = 0.3 + (0.7 * (wavelength - 380)) / (420 - 380);
  } else if (wavelength >= 420 && wavelength < 701) {
    factor = 1.0;
  } else if (wavelength >= 701 && wavelength < 781) {
    factor = 0.3 + (0.7 * (780 - wavelength)) / (780 - 700);
  } else {
    factor = 0.0;
  }
  if (red !== 0) {
    red = Math.round(IntensityMax * Math.pow(red * factor, Gamma));
  }
  if (green !== 0) {
    green = Math.round(IntensityMax * Math.pow(green * factor, Gamma));
  }
  if (blue !== 0) {
    blue = Math.round(IntensityMax * Math.pow(blue * factor, Gamma));
  }
  if (wavelengthNano < 380) {
    red = cosineInterpolate(red, 0, (wavelengthNano - 380) / 180);
    green = cosineInterpolate(green, 0, (wavelengthNano - 380) / 180);
    blue = cosineInterpolate(blue, 0, (wavelengthNano - 380) / 180);
  }
  return `rgba(${red},${green},${blue}, ${intensity})`;
}

function cosineInterpolate(a, b, x) {
  var ft = x * Math.PI;
  var f = (1 - Math.cos(ft)) * 0.5;
  return a * (1 - f) + b * f;
}
