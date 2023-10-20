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
