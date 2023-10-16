export default class Config {
  private _canvasWidth: number;
  private _canvasHeight: number;
  private _rows: number;
  private _columns: number;
  private _cellWidth: number;
  private _cellHeight: number;
  private _cellColor: string;
  private _cellBackgroundColor: string;
  private _maxStackSize: number;
  private _frameDelay: number;

  constructor(params: { [key: string]: string }) {
    this._canvasWidth = parseInt(params.canvasWidth, 10) || 800;
    this._canvasHeight = parseInt(params.canvasHeight, 10) || 800;

    this._rows = parseInt(params.rows) || 10;
    this._columns = parseInt(params.columns) || 10;
    this._cellWidth = Math.floor(this._canvasWidth / this._columns);
    this._cellHeight = Math.floor(this._canvasHeight / this._rows);
    this._cellColor = params.cellColor || '#ffffff';
    this._cellBackgroundColor = params.cellBackgroundColor || '#242424';
    this._maxStackSize = parseInt(params.maxStackSize) || 4;
    this._frameDelay = parseInt(params.frameDelay) || 0;

    if (this._cellColor && !this._cellColor.startsWith('#')) {
      this._cellColor = `#${this._cellColor}`;
    }
  }

  get canvasWidth() {
    return this._canvasWidth;
  }

  get canvasHeight() {
    return this._canvasHeight;
  }

  get rows() {
    return this._rows;
  }

  get columns() {
    return this._columns;
  }

  get cellWidth() {
    return this._cellWidth;
  }

  get cellHeight() {
    return this._cellHeight;
  }

  get cellColor() {
    return this._cellColor;
  }

  get cellBackgroundColor() {
    return this._cellBackgroundColor;
  }

  get maxStackSize() {
    return this._maxStackSize;
  }

  get frameDelay() {
    return this._frameDelay;
  }
}
