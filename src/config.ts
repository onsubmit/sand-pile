export default class Config {
  private _canvasWidth: number;
  private _canvasHeight: number;
  private _cellSize: number;
  private _cellColor: string;
  private _frameDelay: number;

  constructor(params: { [key: string]: string }) {
    this._canvasWidth = parseInt(params.canvasWidth, 10) || 800;
    this._canvasHeight = parseInt(params.canvasHeight, 10) || 800;

    this._cellSize = parseInt(params.cellSize) || 10;
    this._cellColor = params.cellColor;
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

  get cellSize() {
    return this._cellSize;
  }

  get cellColor() {
    return this._cellColor;
  }

  get frameDelay() {
    return this._frameDelay;
  }
}
