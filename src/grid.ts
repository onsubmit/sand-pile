import DictionaryGrid from './dictionaryGrid';

export type DrawCallback = (row: number, column: number, value: number) => void;
export type ResizeCallback = (newRadius: number) => void;
export type DrawExampleFn = (row: number, column: number) => number;

export default class Grid {
  private _grid: DictionaryGrid<number>;
  private _toppleThreshold: number;
  private _drawCallback: DrawCallback;
  private _resizeCallback: ResizeCallback;

  constructor(radius: number, toppleThreshold: number, drawCallback: DrawCallback, resizeCallback: ResizeCallback) {
    this._grid = new DictionaryGrid<number>(radius, 0);
    this._toppleThreshold = toppleThreshold;
    this._drawCallback = drawCallback;
    this._resizeCallback = resizeCallback;
  }

  get radius(): number {
    return this._grid.radius;
  }

  get toppleThreshold(): number {
    return this._toppleThreshold;
  }

  set toppleThreshold(value: number) {
    this._toppleThreshold = value;
  }

  redraw = () => {
    for (let row = -this.radius; row <= this.radius; row++) {
      for (let column = -this.radius; column <= this.radius; column++) {
        const value = this._grid.getOrThrow(row, column);
        this._drawCallback(row, column, value);
      }
    }
  };

  drawExample = (drawExampleFn: DrawExampleFn) => {
    for (let row = -this.radius; row <= this.radius; row++) {
      for (let column = -this.radius; column <= this.radius; column++) {
        const value = drawExampleFn(row, column);
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
    this._grid.setOrThrow(row, column, newValue);
    this._drawCallback(row, column, newValue);

    return newValue;
  };

  incrementMaybeResize = (row: number, column: number): number | undefined => {
    const didResize = this.maybeResize(Math.max(this.radius, Math.abs(row), Math.abs(column)));
    const value = this.getValueOrThrow(row, column);

    const newValue = value + 1;
    this.setValueOrThrow(row, column, newValue);

    if (didResize) {
      this._resizeCallback(this.radius);
    }

    return newValue;
  };

  incrementOrThrow = (row: number, column: number, amount = 1): number => {
    const element = this.getValueOrThrow(row, column);

    const newValue = element + amount;
    this._grid.setOrThrow(row, column, newValue);
    this._drawCallback(row, column, newValue);

    return newValue;
  };

  avalancheOnce = () => {
    for (let row = -this.radius; row <= this.radius; row++) {
      for (let column = -this.radius; column <= this.radius; column++) {
        if (this.getValueOrThrow(row, column) >= this._toppleThreshold) {
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
        if (this.getValueOrThrow(row, column) >= this._toppleThreshold) {
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

        if (newValue >= this._toppleThreshold) {
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

  maybeResize = (newRadius: number) => this._grid.maybeResize(newRadius);

  getValueOrThrow = (row: number, column: number): number => this._grid.getOrThrow(row, column);

  // getValueMaybeResize = (row: number, column: number): ValueAndDidResize<number> =>
  //   this._grid.getMaybeResize(row, column);

  // private setValueMaybeResize = (row: number, column: number, value: number): void => {
  //   const didResize = this._grid.setMaybeResize(row, column, value);
  //   this._drawCallback(row, column, value);

  //   if (didResize) {
  //     this._resizeCallback(this.radius);
  //   }
  // };

  private setValueOrThrow = (row: number, column: number, value: number): void => {
    this._grid.setOrThrow(row, column, value);
    this._drawCallback(row, column, value);
  };
}
