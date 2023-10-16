export default class Grid {
  private _rows: number;
  private _columns: number;
  private _grid: number[][];

  constructor(rows: number, columns: number) {
    this._rows = rows;
    this._columns = columns;
    this._grid = Array.from(Array(rows), () => Array.from(Array(columns), () => 0));
  }

  set = (row: number, column: number, value: number) => {
    this._grid[row][column] = value;
  };
}
