export type ColorRgb = {
  red: number;
  green: number;
  blue: number;
};

export const blend = (background: ColorRgb, foreground: ColorRgb, opacity: number) => {
  const red = Math.floor(background.red + (foreground.red - background.red) * opacity);
  const green = Math.floor(background.green + (foreground.green - background.green) * opacity);
  const blue = Math.floor(background.blue + (foreground.blue - background.blue) * opacity);

  return rgbToHex(red, green, blue);
};

export const hexToRgb = (hex: string): ColorRgb => {
  if (hex.length !== 7 || hex.at(0) !== '#') {
    throw new Error('Only 6-digit hex strings are supported');
  }

  const red = parseInt(hex.substring(1, 3), 16);
  const green = parseInt(hex.substring(3, 5), 16);
  const blue = parseInt(hex.substring(5, 7), 16);

  if (Number.isNaN(red) || Number.isNaN(green) || Number.isNaN(blue)) {
    throw new Error('Only 6-digit hex strings are supported');
  }

  return {
    red,
    green,
    blue,
  };
};

function componentToHex(component: number) {
  const hex = component.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

export const exportedForTesting = {
  componentToHex,
  rgbToHex,
};
