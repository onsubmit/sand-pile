import { CartesianCoordinate } from './canvas';
import { DrawExampleFn } from './canvasGrid';
import Complex from './complex';

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

export const drawMandelbrot = (maxValue: number): DrawExampleFn => {
  const maxMandelbrotIterations = maxValue * 10;

  const complexPlaneSearchRange = {
    min: {
      x: -2,
      y: -1.5,
    },
    max: {
      x: 1,
      y: 1.5,
    },
  };

  function mandelbrot(c: Complex) {
    let i = 0;
    let z = new Complex(0, 0);

    for (i = 0; z.magnitude <= 2 && i <= maxMandelbrotIterations; i++) {
      z = Complex.add(Complex.multiply(z, z), c);
    }

    return i;
  }

  return (row: number, column: number, gridRadius: number) => {
    const x = column * (2.5 / gridRadius);
    const y = row * (2.5 / gridRadius);

    if (x < complexPlaneSearchRange.min.x || x > complexPlaneSearchRange.max.x) {
      return 0;
    }

    if (y < complexPlaneSearchRange.min.y || y > complexPlaneSearchRange.max.y) {
      return 0;
    }

    const c = new Complex(x, y);
    const m = mandelbrot(c);

    return Math.floor(maxValue * (m / maxMandelbrotIterations));
  };
};

export const drawPolygon = (numSides: number, maxValue: number): DrawExampleFn => {
  const piDivSides = Math.PI / numSides;
  const twoPiDivSides = 2 * piDivSides;
  const adjustment = numSides % 2 === 0 ? piDivSides : -Math.PI / 2;

  const polygon: Array<CartesianCoordinate> = [];
  for (let i = 0; i < numSides; i++) {
    polygon.push({ x: Math.cos(adjustment + i * twoPiDivSides), y: Math.sin(adjustment + i * twoPiDivSides) });
  }

  // https://stackoverflow.com/a/17490923
  function pointIsInPolygon(p: CartesianCoordinate) {
    let isInside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const p_i = polygon[i]!;
      const p_j = polygon[j]!;
      if (p_i.y > p.y !== p_j.y > p.y && p.x < ((p_j.x - p_i.x) * (p.y - p_i.y)) / (p_j.y - p_i.y) + p_i.x) {
        isInside = !isInside;
      }
    }

    return isInside;
  }

  return (row: number, column: number, gridRadius: number) => {
    const x = column / gridRadius;
    const y = row / gridRadius;

    return pointIsInPolygon({ x, y }) ? maxValue : 0;
  };
};
