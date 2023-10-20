import { DrawExampleFn } from './grid';

export const drawCircle = (radius: number, maxValue: number): DrawExampleFn => {
  const radiusSquared = radius * radius;
  return (row: number, column: number) => {
    if (row * row + column * column < radiusSquared) {
      return maxValue;
    }

    return 0;
  };
};

export const fill = (maxValue: number): DrawExampleFn => {
  return (_row: number, _column: number) => {
    return maxValue;
  };
};

export const drawRandomly = (maxValue: number): DrawExampleFn => {
  return (_row: number, _column: number) => {
    return Math.round(maxValue * Math.random());
  };
};
