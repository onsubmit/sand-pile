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
  const r = hex.substring(1, 3);
  const g = hex.substring(3, 5);
  const b = hex.substring(5, 7);
  return {
    red: parseInt(r, 16),
    green: parseInt(g, 16),
    blue: parseInt(b, 16),
  };
};

function componentToHex(component: number) {
  var hex = component.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}
