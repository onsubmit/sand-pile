export type Dimensions = {
  minRow: number;
  minColumn: number;
  maxRow: number;
  maxColumn: number;
};

type Input<T> = {
  radius: number;
  defaultValue: T;
};

export default class DictionaryGrid<T> {
  #grid: Map<number, Map<number, T>>;
  #defaultValue: T;
  #radius: number;

  constructor({ radius, defaultValue }: Input<T>) {
    if (radius < 0) {
      throw new Error('Radius must be a positive integer.');
    }

    this.#defaultValue = defaultValue;
    this.#radius = Math.floor(radius);

    this.#grid = new Map();
    for (let r = -radius; r <= radius; r++) {
      const gridRow = new Map<number, T>();
      for (let c = -radius; c <= radius; c++) {
        gridRow.set(c, this.#defaultValue);
      }

      this.#grid.set(r, gridRow);
    }
  }

  get radius(): number {
    return this.#radius;
  }

  get = (row: number, column: number): T | undefined => this.#grid.get(row)?.get(column);
  getOrThrow = (row: number, column: number): T => {
    const gridRow = this.#grid.get(row);
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
    if (newRadius !== this.#radius) {
      this.resizeGrid(newRadius);
      return true;
    }

    return false;
  };

  set = (row: number, column: number, value: T): void => {
    // Can't add new rows.
    // Can add new columns.
    this.#grid.get(row)?.set(column, value);
  };

  setOrThrow = (row: number, column: number, value: T): void => {
    const gridRow = this.#grid.get(row);
    if (!gridRow) {
      throw new Error(`Invalid row: ${row}`);
    }

    const element = gridRow.get(column);
    if (element === undefined) {
      throw new Error(`Invalid column: ${column}`);
    }

    gridRow.set(column, value);
  };

  private resizeGrid = (newRadius: number): void => {
    const oldRadius = this.#radius;
    this.#radius = newRadius;

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
          gridRow.set(c, this.#defaultValue);
        }

        this.#grid.set(r, gridRow);
      }

      for (const c of range) {
        for (let r = -newRadius; r < newRadius; r++) {
          this.set(r, c, this.#defaultValue);
        }
      }
    } else {
      const delta = oldRadius - newRadius;

      const min = Array.from({ length: delta }, (_, i) => -oldRadius + i);
      const max = Array.from({ length: delta }, (_, i) => newRadius + i + 1);
      const range = [...min, ...max];

      for (const r of range) {
        this.#grid.delete(r);
      }

      for (const c of range) {
        for (let r = -oldRadius; r < oldRadius; r++) {
          this.#grid.get(r)?.delete(c);
        }
      }
    }
  };
}
