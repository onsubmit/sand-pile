import { DrawExampleFn } from './canvasGrid';

export const drawCircle = (radius: number, maxValue: number): DrawExampleFn => {
  const radiusSquared = radius * radius;
  return (row: number, column: number, _gridRadius: number) => {
    if (row * row + column * column < radiusSquared) {
      return maxValue;
    }

    return 0;
  };
};

export const fill = (maxValue: number): DrawExampleFn => {
  return (_row: number, _column: number, _gridRadius: number) => {
    return maxValue;
  };
};

export const drawRandomly = (maxValue: number): DrawExampleFn => {
  return (_row: number, _column: number, _gridRadius: number) => {
    return Math.round(maxValue * Math.random());
  };
};

export const drawCheckerboard = (maxValue: number): DrawExampleFn => {
  return (row: number, column: number, gridRadius: number) => {
    const gridDimensions = 1 + 2 * gridRadius;
    const r = (gridRadius + row) / gridDimensions;
    const c = (gridRadius + column) / gridDimensions;

    if ((r < 0.333 || r > 0.666) && (c < 0.333 || c > 0.666)) {
      return maxValue;
    }

    if (r > 0.333 && r < 0.666 && c > 0.333 && c < 0.666) {
      return maxValue;
    }

    return 0;
  };
};
