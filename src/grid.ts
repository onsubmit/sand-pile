export default class Grid {
  private _rows: number;
  private _columns: number;
  private _grid: number[][];
  private _maxValue: number;

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

  constructor(rows: number, columns: number, maxValue: number) {
    this._rows = rows;
    this._columns = columns;
    this._grid = Array.from(Array(rows), () => Array.from(Array(columns), () => 0));
    this._maxValue = maxValue;
  }

  decrementOrThrow = (row: number, column: number): number => {
    const element = this.getValueOrThrow(row, column);
    if (element === 0) {
      return 0;
    }

    const newValue = element - 1;
    this._grid[row]![column] = newValue;

    return newValue;
  };

  increment = (row: number, column: number): number | undefined => {
    const element = this.getValue(row, column);

    if (element === undefined) {
      return;
    }

    if (element === this._maxValue) {
      return this._maxValue;
    }

    const newValue = element + 1;
    this.setValue(row, column, newValue);

    return newValue;
  };

  incrementOrThrow = (row: number, column: number): number => {
    const element = this.getValueOrThrow(row, column);

    if (element === this._maxValue) {
      return this._maxValue;
    }

    const newValue = element + 1;
    this._grid[row]![column] = newValue;

    return newValue;
  };

  topple = (row: number, column: number) => {
    this.reset(row, column);

    for (const direction of Grid.directions) {
      const newRow = row + direction[0];
      const newColumn = column + direction[1];

      this.increment(newRow, newColumn);
    }
  };

  reset = (row: number, column: number) => {
    this.setValueOrThrow(row, column, 0);
  };

  private getValue = (row: number, column: number): number | undefined => {
    const gridRow = this._grid[row];
    if (!gridRow) {
      return;
    }

    const element = gridRow[column];
    if (element === undefined) {
      return;
    }

    return element;
  };

  private setValue = (row: number, column: number, value: number): void => {
    const gridRow = this._grid[row];
    if (!gridRow) {
      return;
    }

    if (gridRow[column] === undefined) {
      return;
    }

    gridRow[column] = value;
  };

  private getValueOrThrow = (row: number, column: number): number => {
    const gridRow = this._grid[row];
    if (!gridRow) {
      throw new Error(`Invalid row: ${row}`);
    }

    const element = gridRow[column];
    if (element === undefined) {
      throw new Error(`Invalid column: ${column}`);
    }

    return element;
  };

  private setValueOrThrow = (row: number, column: number, value: number): void => {
    const gridRow = this._grid[row];
    if (!gridRow) {
      throw new Error(`Invalid row: ${row}`);
    }

    if (gridRow[column] === undefined) {
      throw new Error(`Invalid column: ${column}`);
    }

    gridRow[column] = value;
  };
}
