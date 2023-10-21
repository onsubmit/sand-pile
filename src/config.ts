export default class Config {
  private static readonly MIN_RADIUS = 2;
  private static readonly MIN_CELL_SIZE = 3;
  private static readonly DEFAULT_CELL_SIZE = 50;
  private static readonly DEFAULT_CELL_COLOR = '#ffffff';
  private static readonly DEFAULT_CELL_BACKGROUND_COLOR = '#242424';
  private static readonly MIN_MAX_STACK_SIZE = 4;
  private static readonly MIN_FRAME_DELAY = 0;

  private _radius: number;
  private _cellSize: number;
  private _cellColor: string;
  private _cellBackgroundColor: string;
  private _drawNumbers: boolean;
  private _maxStackSize: number;
  private _frameDelay: number;
  private _hideControlsWhenRunning: boolean;

  constructor(params: { [key: string]: string }) {
    this._radius = Math.max(Config.MIN_RADIUS, parseInt(params.radius || '0') || Config.MIN_RADIUS);
    this._cellSize = Math.max(Config.MIN_CELL_SIZE, parseInt(params.cellSize || '0', 10) || Config.DEFAULT_CELL_SIZE);
    this._cellColor = params.cellColor || Config.DEFAULT_CELL_COLOR;
    this._cellBackgroundColor = params.cellBackgroundColor || Config.DEFAULT_CELL_BACKGROUND_COLOR;
    this._drawNumbers = params.drawNumbers === '1';
    this._maxStackSize = Math.max(
      Config.MIN_MAX_STACK_SIZE,
      Math.min(255, parseInt(params.maxStackSize || '0') || Config.MIN_MAX_STACK_SIZE)
    );
    this._frameDelay = Math.max(Config.MIN_FRAME_DELAY, parseInt(params.frameDelay || '0') || Config.MIN_FRAME_DELAY);
    this._hideControlsWhenRunning = params.hideControlsWhenRunning === '1';

    if (this._cellColor && !this._cellColor.startsWith('#')) {
      this._cellColor = `#${this._cellColor}`;
    }
  }

  get radius() {
    return this._radius;
  }

  get cellSize() {
    return this._cellSize;
  }

  get cellColor() {
    return this._cellColor;
  }

  get cellBackgroundColor() {
    return this._cellBackgroundColor;
  }

  get drawNumbers() {
    return this._drawNumbers;
  }

  get maxStackSize() {
    return this._maxStackSize;
  }

  get frameDelay() {
    return this._frameDelay;
  }

  get hideControlsWhenRunning() {
    return this._hideControlsWhenRunning;
  }
}
