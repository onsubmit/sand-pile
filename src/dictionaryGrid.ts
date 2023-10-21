export type Dimensions = {
  minRow: number;
  minColumn: number;
  maxRow: number;
  maxColumn: number;
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

  maybeResize = (newRadius: number): boolean => {
    if (newRadius !== this._radius) {
      this.resizeGrid(newRadius);
      return true;
    }

    return false;
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

  private resizeGrid = (newRadius: number): void => {
    const oldRadius = this._radius;
    this._radius = newRadius;

    if (newRadius === oldRadius) {
      return;
    }

    if (newRadius > oldRadius) {
      const delta = newRadius - oldRadius;

      const min = Array.from({ length: delta }, (_, i) => -newRadius + i);
      const max = Array.from({ length: delta }, (_, i) => oldRadius + i + 1);
      const range = [...min, ...max];

      for (const r of range) {
        const gridRow = new Map<number, T>();
        for (let c = -newRadius; c <= newRadius; c++) {
          gridRow.set(c, this._defaultValue);
        }

        this._grid.set(r, gridRow);
      }

      for (const c of range) {
        for (let r = -newRadius; r < newRadius; r++) {
          this.set(r, c, this._defaultValue);
        }
      }
    } else {
      const delta = oldRadius - newRadius;

      const min = Array.from({ length: delta }, (_, i) => -oldRadius + i);
      const max = Array.from({ length: delta }, (_, i) => newRadius + i + 1);
      const range = [...min, ...max];

      for (const r of range) {
        this._grid.delete(r);
      }

      for (const c of range) {
        for (let r = -oldRadius; r < oldRadius; r++) {
          this._grid.get(r)?.delete(c);
        }
      }
    }
  };
}
