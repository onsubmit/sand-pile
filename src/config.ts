export default class Config {
  private static readonly MIN_WIDTH = 800;
  private static readonly MIN_HEIGHT = 800;
  private static readonly MIN_RADIUS = 2;
  private static readonly DEFAULT_CELL_COLOR = '#ffffff';
  private static readonly DEFAULT_CELL_BACKGROUND_COLOR = '#242424';
  private static readonly MAX_STACK_SIZE = 4;
  private static readonly MIN_FRAME_DELAY = 0;

  private _canvasWidth: number;
  private _canvasHeight: number;
  private _radius: number;
  private _cellColor: string;
  private _cellBackgroundColor: string;
  private _maxStackSize: number;
  private _frameDelay: number;

  constructor(params: { [key: string]: string }) {
    this._canvasWidth = Math.max(Config.MIN_WIDTH, parseInt(params.canvasWidth || '0', 10) || Config.MIN_WIDTH);
    this._canvasHeight = Math.max(Config.MIN_HEIGHT, parseInt(params.canvasHeight || '0', 10) || Config.MIN_HEIGHT);
    this._radius = Math.max(Config.MIN_RADIUS, parseInt(params.radius || '0') || Config.MIN_RADIUS);
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

  get radius() {
    return this._radius;
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
