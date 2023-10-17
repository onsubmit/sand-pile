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

  decrementOrThrow = (row: number, column: number, amount = 1): number => {
    const element = this.getValueOrThrow(row, column);
    if (element === 0) {
      return 0;
    }

    const newValue = element - amount;
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

  incrementOrThrow = (row: number, column: number, amount = 1): number => {
    const element = this.getValueOrThrow(row, column);

    if (element === this._maxValue) {
      return this._maxValue;
    }

    const newValue = element + amount;
    this._grid[row]![column] = newValue;

    return newValue;
  };

  startAvalanche = () => {
    let coordinatesRequiringAvalanche = new Set<string>();
    for (let row = 0; row < this._rows; row++) {
      for (let column = 0; column < this._columns; column++) {
        if (this.getValueOrThrow(row, column) >= this._maxValue) {
          coordinatesRequiringAvalanche = new Set([
            ...coordinatesRequiringAvalanche,
            ...this.avalanceAtCoordinate(row, column),
          ]);
        }
      }
    }

    while (coordinatesRequiringAvalanche.size) {
      coordinatesRequiringAvalanche = this.avalancheAtCoordinates(coordinatesRequiringAvalanche);
    }
  };

  avalanceAtCoordinate = (row: number, column: number): Set<string> => {
    const cardinalBorderCoordinates = [
      [row - 1, column],
      [row + 1, column],
      [row, column - 1],
      [row, column + 1],
    ] as const;

    let coordinatesRequiringAvalanche = new Set<string>();
    for (const coordinates of cardinalBorderCoordinates) {
      const [cellRow, cellColumn] = coordinates;

      const newValue = this.increment(cellRow, cellColumn);
      if (newValue && newValue >= this._maxValue) {
        coordinatesRequiringAvalanche.add(`${cellRow},${cellColumn}`);
      }
    }

    const originValue = this.getValue(row, column);
    if (originValue && originValue >= this._maxValue) {
      coordinatesRequiringAvalanche.add(`${row},${column}`);
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
      this.decrementOrThrow(row, column, this._maxValue);
    }

    for (const { row, column } of coordinateNums) {
      coordinatesRequiringAvalanche = new Set([
        ...coordinatesRequiringAvalanche,
        ...this.avalanceAtCoordinate(row, column),
      ]);
    }

    return coordinatesRequiringAvalanche;
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
