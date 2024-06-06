// src/colorUtils.js

export const getColorForDirection = (dir) => {
  // Normalize direction vector
  const normalizedDir = dir.clone().normalize();

  // Color mappings for 9 directions
  const colors = {
    positiveX: 0xff0000, // Red
    negativeX: 0x00ff00, // Green
    positiveY: 0x0000ff, // Blue
    negativeY: 0xffff00, // Yellow
    positiveZ: 0xff00ff, // Magenta
    negativeZ: 0x00ffff, // Cyan
    diagonalXY: 0xffffff, // White
    diagonalXZ: 0x808080, // Grey
    diagonalYZ: 0x800080, // Purple
  };

  // Determine direction and return corresponding color
  if (
    Math.abs(normalizedDir.x) > Math.abs(normalizedDir.y) &&
    Math.abs(normalizedDir.x) > Math.abs(normalizedDir.z)
  ) {
    return normalizedDir.x > 0 ? colors.positiveX : colors.negativeX;
  } else if (
    Math.abs(normalizedDir.y) > Math.abs(normalizedDir.x) &&
    Math.abs(normalizedDir.y) > Math.abs(normalizedDir.z)
  ) {
    return normalizedDir.y > 0 ? colors.positiveY : colors.negativeY;
  } else if (
    Math.abs(normalizedDir.z) > Math.abs(normalizedDir.x) &&
    Math.abs(normalizedDir.z) > Math.abs(normalizedDir.y)
  ) {
    return normalizedDir.z > 0 ? colors.positiveZ : colors.negativeZ;
  } else if (Math.abs(normalizedDir.x) === Math.abs(normalizedDir.y)) {
    return colors.diagonalXY;
  } else if (Math.abs(normalizedDir.x) === Math.abs(normalizedDir.z)) {
    return colors.diagonalXZ;
  } else {
    return colors.diagonalYZ;
  }
};

export const getColorByLength = (length) => {
  // Color mappings for 9 lengths
  const colors = {
    0: 0xff0000, // Red
    1: 0x00ff00, // Green
    2: 0x0000ff, // Blue
    3: 0xffff00, // Yellow
    4: 0xff00ff, // Magenta
    5: 0x00ffff, // Cyan
    6: 0xffffff, // White
    7: 0x808080, // Grey
    8: 0x800080, // Purple
  };

  // Determine length and return corresponding color
  return colors[Math.min(Math.floor(length), 8)];
};
