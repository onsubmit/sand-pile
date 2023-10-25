type NumberParam = Readonly<{
  min: number;
  max: number;
  value: number;
}>;

const examples = ['circle', 'fill', 'checkerboard', 'mandelbrot', 'polygon', 'noise'] as const;
type Example = (typeof examples)[number];

export default class Config {
  radius: NumberParam;
  toppleThreshold: NumberParam;
  maxCellGrains: NumberParam;
  cellSize: NumberParam;
  penSize: NumberParam;
  penWeight: NumberParam;
  polygonSides: NumberParam;
  cellColor: string;
  cellBackgroundColor: string;
  defaultExample: Example | undefined;

  constructor(params: { [key: string]: string }) {
    this.radius = this.#getNumberParam(params.radius, { min: 4, max: 1000, defaultValue: 20 });
    this.toppleThreshold = this.#getNumberParam(params.toppleThreshold, { min: 2, max: 256, defaultValue: 4 });
    this.maxCellGrains = this.#getNumberParam(params.maxCellGrains, { min: 4, max: 256, defaultValue: 4 });
    this.cellSize = this.#getNumberParam(params.cellSize, { min: 3, max: 500, defaultValue: 10 });
    this.penSize = this.#getNumberParam(params.penSize, { min: 1, max: 128, defaultValue: 1 });
    this.penWeight = this.#getNumberParam(params.penWeight, { min: 1, max: this.maxCellGrains.value, defaultValue: 1 });
    this.polygonSides = this.#getNumberParam(params.polygonSides, { min: 3, max: 128, defaultValue: 6 });
    this.cellColor = this.#getColorParam(params.cellColor, '#ffffff');
    this.cellBackgroundColor = this.#getColorParam(params.cellBackgroundColor, '#242424');
    this.defaultExample = this.#getExampleParam(params.example);
  }

  #getNumberParam = (
    paramValue: string | undefined,
    options: { min: number; max: number; defaultValue: number }
  ): NumberParam => {
    const { min, max, defaultValue } = options;

    let value = parseInt(paramValue || '0') || defaultValue;
    value = Math.max(value, min);
    value = Math.min(value, max);

    return {
      min,
      max,
      value,
    };
  };

  #getColorParam = (paramValue: string | undefined, defaultValue: string): string => {
    if (paramValue) {
      return paramValue.startsWith('#') ? paramValue : `#${paramValue}`;
    }

    return defaultValue;
  };

  #getExampleParam = (paramValue: string | undefined): Example | undefined => {
    if (!paramValue) {
      return;
    }

    if (examples.includes(paramValue as Example)) {
      return paramValue as Example;
    }
  };
}
