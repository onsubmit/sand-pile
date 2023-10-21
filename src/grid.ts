import DictionaryGrid from './dictionaryGrid';

export type GridCoordinates = { row: number; column: number };

export type DrawCallback = (row: number, column: number, value: number) => void;
export type ResizeCallback = (newRadius: number) => void;
export type DrawExampleFn = (row: number, column: number, gridRadius: number) => number;

export default class Grid {
  #grid: DictionaryGrid<number>;
  #toppleThreshold: number;
  #drawCallback: DrawCallback;
  #resizeCallback: ResizeCallback;

  constructor(radius: number, toppleThreshold: number, drawCallback: DrawCallback, resizeCallback: ResizeCallback) {
    this.#grid = new DictionaryGrid<number>(radius, 0);
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
        this.setValueOrThrow(row, column, value);
      }
    }
  };

  decrementOrThrow = (row: number, column: number, amount = 1): number => {
    const element = this.getValueOrThrow(row, column);
    if (element === 0) {
      return 0;
    }

    const newValue = element - amount;
    this.#grid.setOrThrow(row, column, newValue);
    this.#drawCallback(row, column, newValue);

    return newValue;
  };

  incrementMaybeResize = (row: number, column: number): number | undefined => {
    const didResize = this.maybeResize(Math.max(this.radius, Math.abs(row), Math.abs(column)));
    const value = this.getValueOrThrow(row, column);

    const newValue = value + 1;
    this.setValueOrThrow(row, column, newValue);

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

  avalancheOnce = () => {
    for (let row = -this.radius; row <= this.radius; row++) {
      for (let column = -this.radius; column <= this.radius; column++) {
        if (this.getValueOrThrow(row, column) >= this.#toppleThreshold) {
          this.avalancheAtCoordinate(row, column);
          return;
        }
      }
    }
  };

  avalancheOnceOverGrid = (): boolean => {
    const coordinatesRequiringAvalanche: Array<{ row: number; column: number }> = [];
    for (let row = -this.radius; row <= this.radius; row++) {
      for (let column = -this.radius; column <= this.radius; column++) {
        if (this.getValueOrThrow(row, column) >= this.#toppleThreshold) {
          coordinatesRequiringAvalanche.push({ row, column });
        }
      }
    }

    for (const { row, column } of coordinatesRequiringAvalanche) {
      this.avalancheAtCoordinate(row, column);
    }

    return coordinatesRequiringAvalanche.length > 0;
  };

  avalancheAtCoordinate = (row: number, column: number): Set<string> => {
    const cardinalBorderCoordinates = [
      [row - 1, column],
      [row, column + 1],
      [row + 1, column],
      [row, column - 1],
    ] as const;

    let coordinatesRequiringAvalanche = new Set<string>();
    for (const coordinates of cardinalBorderCoordinates) {
      const [cellRow, cellColumn] = coordinates;

      const newValue = this.incrementMaybeResize(cellRow, cellColumn);
      if (newValue !== undefined) {
        this.decrementOrThrow(row, column);

        if (newValue >= this.#toppleThreshold) {
          coordinatesRequiringAvalanche.add(`${cellRow},${cellColumn}`);
        }
      }
    }

    return coordinatesRequiringAvalanche;
  };

  avalancheAtCoordinates = (coordinates: Set<string>): Set<string> => {
    let coordinatesRequiringAvalanche = new Set<string>();
    const coordinateNums = [...coordinates].map((c) => {
      const split = c.split(',');
      const row = parseInt(split[0]!, 10);
      const column = parseInt(split[1]!, 10);
      return { row, column };
    });

    for (const { row, column } of coordinateNums) {
      coordinatesRequiringAvalanche = new Set([
        ...coordinatesRequiringAvalanche,
        ...this.avalancheAtCoordinate(row, column),
      ]);
    }

    return coordinatesRequiringAvalanche;
  };

  reset = (row: number, column: number) => {
    this.setValueOrThrow(row, column, 0);
  };

  maybeResize = (newRadius: number) => this.#grid.maybeResize(newRadius);

  getValueOrThrow = (row: number, column: number): number => this.#grid.getOrThrow(row, column);

  private setValueOrThrow = (row: number, column: number, value: number): void => {
    this.#grid.setOrThrow(row, column, value);
    this.#drawCallback(row, column, value);
  };
}
