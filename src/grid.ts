export default class Grid {
  private _rows: number;
  private _columns: number;
  private _grid: number[][];
  private _maxValue: number;

  constructor(rows: number, columns: number, maxValue: number) {
    this._rows = rows;
    this._columns = columns;
    this._grid = Array.from(Array(rows), () => Array.from(Array(columns), () => 0));
    this._maxValue = maxValue;
  }

  decrement = (row: number, column: number): number => {
    if (this._grid[row][column] === 0) {
      return 0;
    }

    const newValue = this._grid[row][column] - 1;
    this._grid[row][column] = newValue;

    return newValue;
  };

  increment = (row: number, column: number): number => {
    if (this._grid[row][column] === this._maxValue) {
      return this._grid[row][column];
    }

    const newValue = this._grid[row][column] + 1;
    this._grid[row][column] = newValue;

    return newValue;
  };

  reset = (row: number, column: number) => {
    this._grid[row][column] = 0;
  };
}
