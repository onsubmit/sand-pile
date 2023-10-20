import DictionaryGrid, { ValueAndDidExpand } from './dictionaryGrid';

export type DrawCallback = (row: number, column: number, value: number) => void;
export type ExpandCallback = (newRadius: number) => void;
export type DrawExampleFn = (row: number, column: number) => number;

export default class Grid {
  private _grid: DictionaryGrid<number>;
  private _maxValue: number;
  private _drawCallback: DrawCallback;
  private _expandCallback: ExpandCallback;

  constructor(radius: number, maxValue: number, drawCallback: DrawCallback, expandCallback: ExpandCallback) {
    this._grid = new DictionaryGrid<number>(radius, 0);
    this._maxValue = maxValue;
    this._drawCallback = drawCallback;
    this._expandCallback = expandCallback;
  }

  get radius(): number {
    return this._grid.radius;
  }

  get maxValue(): number {
    return this._maxValue;
  }

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

  incrementMaybeExpand = (row: number, column: number): number | undefined => {
    const { value, didExpand } = this.getValueMaybeExpand(row, column);

    const newValue = value + 1;
    this.setValueMaybeExpand(row, column, newValue);

    if (didExpand) {
      this._expandCallback(this.radius);
    }

    return newValue;
  };

  incrementOrThrow = (row: number, column: number, amount = 1): number => {
    const element = this.getValueOrThrow(row, column);

    if (element === this._maxValue) {
      return this._maxValue;
    }

    const newValue = element + amount;
    this._grid.setOrThrow(row, column, newValue);
    this._drawCallback(row, column, newValue);

    return newValue;
  };

  avalancheOnce = () => {
    for (let row = -this.radius; row <= this.radius; row++) {
      for (let column = -this.radius; column <= this.radius; column++) {
        if (this.getValueOrThrow(row, column) >= this._maxValue) {
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
        if (this.getValueOrThrow(row, column) >= this._maxValue) {
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

      const newValue = this.incrementMaybeExpand(cellRow, cellColumn);
      if (newValue !== undefined) {
        this.decrementOrThrow(row, column);

        if (newValue >= this._maxValue) {
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

  getValueOrThrow = (row: number, column: number): number => this._grid.getOrThrow(row, column);

  private getValueMaybeExpand = (row: number, column: number): ValueAndDidExpand<number> =>
    this._grid.getMaybeExpand(row, column);

  private setValueMaybeExpand = (row: number, column: number, value: number): void => {
    const didExpand = this._grid.setMaybeExpand(row, column, value);
    this._drawCallback(row, column, value);

    if (didExpand) {
      this._expandCallback(this.radius);
    }
  };

  private setValueOrThrow = (row: number, column: number, value: number): void => {
    this._grid.setOrThrow(row, column, value);
    this._drawCallback(row, column, value);
  };
}
