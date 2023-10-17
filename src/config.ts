export default class Config {
  private static readonly MIN_WIDTH = 800;
  private static readonly MIN_HEIGHT = 800;
  private static readonly MIN_ROWS = 5;
  private static readonly MIN_COLUMNS = 5;
  private static readonly MIN_CELL_WIDTH = 1;
  private static readonly MIN_CELL_HEIGHT = 1;
  private static readonly DEFAULT_CELL_COLOR = '#ffffff';
  private static readonly DEFAULT_CELL_BACKGROUND_COLOR = '#242424';
  private static readonly MAX_STACK_SIZE = 4;
  private static readonly MIN_FRAME_DELAY = 0;

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
    this._canvasWidth = Math.max(Config.MIN_WIDTH, parseInt(params.canvasWidth || '0', 10) || Config.MIN_WIDTH);
    this._canvasHeight = Math.max(Config.MIN_HEIGHT, parseInt(params.canvasHeight || '0', 10) || Config.MIN_HEIGHT);

    this._rows = Math.max(Config.MIN_ROWS, parseInt(params.rows || '0') || Config.MIN_ROWS);
    this._columns = Math.max(Config.MIN_COLUMNS, parseInt(params.columns || '0') || Config.MIN_COLUMNS);
    this._cellWidth = Math.max(Config.MIN_CELL_WIDTH, Math.floor(this._canvasWidth / this._columns));
    this._cellHeight = Math.max(Config.MIN_CELL_HEIGHT, Math.floor(this._canvasHeight / this._rows));
    this._cellColor = params.cellColor || Config.DEFAULT_CELL_COLOR;
    this._cellBackgroundColor = params.cellBackgroundColor || Config.DEFAULT_CELL_BACKGROUND_COLOR;
    this._maxStackSize = Math.max(
      Config.MAX_STACK_SIZE,
      Math.min(255, parseInt(params.maxStackSize || '0') || Config.MAX_STACK_SIZE)
    );
    this._frameDelay = Math.max(Config.MIN_FRAME_DELAY, parseInt(params.frameDelay || '0') || Config.MIN_FRAME_DELAY);

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
