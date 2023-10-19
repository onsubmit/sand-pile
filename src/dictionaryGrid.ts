export type Dimensions = {
  minRow: number;
  minColumn: number;
  maxRow: number;
  maxColumn: number;
};

export type ValueAndDidExpand<T> = {
  value: T;
  didExpand: boolean;
};

export default class DictionaryGrid<T> {
  private _grid: Map<number, Map<number, T>>;
  private _defaultValue: T;
  private _radius: number;

  constructor(radius: number, defaultValue: T) {
    this._defaultValue = defaultValue;
    this._radius = radius;

    this._grid = new Map();
    for (let r = -radius; r <= radius; r++) {
      const gridRow = new Map<number, T>();
      for (let c = -radius; c <= radius; c++) {
        gridRow.set(c, this._defaultValue);
      }

      this._grid.set(r, gridRow);
    }
  }

  get radius(): number {
    return this._radius;
  }

  get = (row: number, column: number): T | undefined => this._grid.get(row)?.get(column);
  getOrThrow = (row: number, column: number): T => {
    const gridRow = this._grid.get(row);
    if (!gridRow) {
      throw new Error(`Invalid row: ${row}`);
    }

    const element = gridRow.get(column);
    if (element === undefined) {
      throw new Error(`Invalid column: ${column}`);
    }

    return element;
  };

  getMaybeExpand = (row: number, column: number): ValueAndDidExpand<T> => {
    if (row < -this._radius - 1 || row > this._radius + 1) {
      throw new Error('The grid can only be expanded one column at a time.');
    }

    if (column < -this._radius - 1 || column > this._radius + 1) {
      throw new Error('The grid can only be expanded one row at a time.');
    }

    let needsExpansion = Math.abs(row) > this._radius || Math.abs(column) > this._radius;
    if (needsExpansion) {
      this.expandGrid();
    }

    const value = this.getOrThrow(row, column);
    return { value, didExpand: needsExpansion };
  };

  set = (row: number, column: number, value: T): void => {
    this._grid.get(row)?.set(column, value);
  };

  setOrThrow = (row: number, column: number, value: T): void => {
    const gridRow = this._grid.get(row);
    if (!gridRow) {
      throw new Error(`Invalid row: ${row}`);
    }

    gridRow.set(column, value);
  };

  setMaybeExpand = (row: number, column: number, value: T): boolean => {
    if (row < -this._radius - 1 || row > this._radius + 1) {
      throw new Error('The grid can only be expanded one column at a time.');
    }

    if (column < -this._radius - 1 || column > this._radius + 1) {
      throw new Error('The grid can only be expanded one row at a time.');
    }

    let needsExpansion = Math.abs(row) > this._radius || Math.abs(column) > this._radius;
    if (needsExpansion) {
      this.expandGrid();
    }

    this.set(row, column, value);
    return needsExpansion;
  };

  private expandGrid = (): void => {
    this._radius += 1;

    for (const r of [-this._radius, this._radius]) {
      const gridRow = new Map<number, T>();
      for (let c = -this._radius; c <= this._radius; c++) {
        gridRow.set(c, this._defaultValue);
      }

      this._grid.set(r, gridRow);
    }

    for (const c of [-this._radius, this._radius]) {
      for (let r = -this._radius; r < this._radius; r++) {
        this.set(r, c, this._defaultValue);
      }
    }
  };
}
