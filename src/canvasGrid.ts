import MapGrid from './mapGrid';

export type GridCoordinates = { row: number; column: number };

export type DrawCallback = (row: number, column: number, value: number) => void;
export type ResizeCallback = (newRadius: number) => void;
export type DrawExampleFn = (row: number, column: number, gridRadius: number) => number;

type Input = {
  radius: number;
  toppleThreshold: number;
  drawCallback: DrawCallback;
  resizeCallback: ResizeCallback;
};

export default class CanvasGrid {
  #grid: MapGrid<number>;
  #toppleThreshold: number;
  #drawCallback: DrawCallback;
  #resizeCallback: ResizeCallback;

  constructor({ radius, toppleThreshold, drawCallback, resizeCallback }: Input) {
    this.#grid = new MapGrid<number>({ radius, defaultValue: 0 });
    this.#toppleThreshold = toppleThreshold;
    this.#drawCallback = drawCallback;
    this.#resizeCallback = resizeCallback;
  }

  get radius(): number {
    return this.#grid.radius;
  }

  get toppleThreshold(): number {
    return this.#toppleThreshold;
  }

  set toppleThreshold(value: number) {
    this.#toppleThreshold = value;
  }

  redraw = () => {
    for (let row = -this.radius; row <= this.radius; row++) {
      for (let column = -this.radius; column <= this.radius; column++) {
        const value = this.#grid.getOrThrow(row, column);
        this.#drawCallback(row, column, value);
      }
    }
  };

  drawExample = (drawExampleFn: DrawExampleFn) => {
    for (let row = -this.radius; row <= this.radius; row++) {
      for (let column = -this.radius; column <= this.radius; column++) {
        const value = drawExampleFn(row, column, this.radius);
        this.#setValueOrThrow(row, column, value);
      }
    }
  };

  decrementOrThrow = (row: number, column: number, amount = 1): number => {
    const element = this.getValueOrThrow(row, column);
    const newValue = Math.max(0, element - amount);
    this.#grid.setOrThrow(row, column, newValue);
    this.#drawCallback(row, column, newValue);

    return newValue;
  };

  incrementMaybeResize = (row: number, column: number): number | undefined => {
    const didResize = this.maybeResize(Math.max(this.radius, Math.abs(row), Math.abs(column)));
    const value = this.getValueOrThrow(row, column);

    const newValue = value + 1;
    this.#setValueOrThrow(row, column, newValue);

    if (didResize) {
      this.#resizeCallback(this.radius);
    }

    return newValue;
  };

  incrementOrThrow = (row: number, column: number, amount = 1): number => {
    const element = this.getValueOrThrow(row, column);

    const newValue = element + amount;
    this.#grid.setOrThrow(row, column, newValue);
    this.#drawCallback(row, column, newValue);

    return newValue;
  };

  toppleOnce = () => {
    for (let row = -this.radius; row <= this.radius; row++) {
      for (let column = -this.radius; column <= this.radius; column++) {
        if (this.getValueOrThrow(row, column) >= this.#toppleThreshold) {
          this.#toppleAtCoordinate(row, column);
          return;
        }
      }
    }
  };

  toppleOnceOverGrid = (): { didTopple: boolean } => {
    const coordinatesRequiringToppling: Array<{ row: number; column: number }> = [];
    for (let row = -this.radius; row <= this.radius; row++) {
      for (let column = -this.radius; column <= this.radius; column++) {
        if (this.getValueOrThrow(row, column) >= this.#toppleThreshold) {
          coordinatesRequiringToppling.push({ row, column });
        }
      }
    }

    for (const { row, column } of coordinatesRequiringToppling) {
      this.#toppleAtCoordinate(row, column);
    }

    return { didTopple: coordinatesRequiringToppling.length > 0 };
  };

  reset = (row: number, column: number) => {
    this.#setValueOrThrow(row, column, 0);
  };

  maybeResize = (newRadius: number) => this.#grid.maybeResize(newRadius);

  getValueOrThrow = (row: number, column: number): number => this.#grid.getOrThrow(row, column);

  #setValueOrThrow = (row: number, column: number, value: number): void => {
    this.#grid.setOrThrow(row, column, value);
    this.#drawCallback(row, column, value);
  };

  #toppleAtCoordinate = (row: number, column: number): Set<string> => {
    const cardinalBorderCoordinates = [
      [row - 1, column],
      [row, column + 1],
      [row + 1, column],
      [row, column - 1],
    ] as const;

    const coordinatesRequiringToppling = new Set<string>();
    for (const coordinates of cardinalBorderCoordinates) {
      const [cellRow, cellColumn] = coordinates;

      const newValue = this.incrementMaybeResize(cellRow, cellColumn);
      if (newValue !== undefined) {
        this.decrementOrThrow(row, column);

        if (newValue >= this.#toppleThreshold) {
          coordinatesRequiringToppling.add(`${cellRow},${cellColumn}`);
        }
      }
    }

    return coordinatesRequiringToppling;
  };
}
