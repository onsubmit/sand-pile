import DictionaryGrid, { ValueAndDidExpand } from './dictionaryGrid';

export type DrawCallback = (row: number, column: number, value: number) => void;
export type ExpandCallback = (newRadius: number) => void;

export default class Grid {
  private _grid: DictionaryGrid<number>;
  private _maxValue: number;
  private _drawCallback: DrawCallback;
  private _expandCallback: ExpandCallback;

  private static readonly directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, -1],
  ] as const;

  constructor(radius: number, maxValue: number, drawCallback: DrawCallback, expandCallback: ExpandCallback) {
    this._grid = new DictionaryGrid<number>(radius, 0);
    this._maxValue = maxValue;
    this._drawCallback = drawCallback;
    this._expandCallback = expandCallback;
  }

  get radius(): number {
    return this._grid.radius;
  }

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

    if (value === this._maxValue) {
      return this._maxValue;
    }

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

  startAvalanche = () => {
    let coordinatesRequiringAvalanche = new Set<string>();
    for (let row = -this.radius; row <= this.radius; row++) {
      for (let column = -this.radius; column <= this.radius; column++) {
        if (
          !coordinatesRequiringAvalanche.has(`${row},${column}`) &&
          this.getValueOrThrow(row, column) >= this._maxValue
        ) {
          coordinatesRequiringAvalanche = new Set([
            ...coordinatesRequiringAvalanche,
            ...this.avalancheAtCoordinate(row, column),
          ]);
        }
      }
    }

    while (coordinatesRequiringAvalanche.size) {
      coordinatesRequiringAvalanche = this.avalancheAtCoordinates(coordinatesRequiringAvalanche);
    }
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

  topple = (row: number, column: number) => {
    this.reset(row, column);

    for (const direction of Grid.directions) {
      const newRow = row + direction[0];
      const newColumn = column + direction[1];

      this.incrementMaybeExpand(newRow, newColumn);
    }
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
