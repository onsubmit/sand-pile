export default class Config {
  private static readonly MIN_MAX_STACK_SIZE = 4;
  private static readonly MIN_FRAME_DELAY = 0;

  private _drawNumbers: boolean;
  private _maxStackSize: number;
  private _frameDelay: number;
  private _hideControlsWhenRunning: boolean;

  constructor(params: { [key: string]: string }) {
    this._drawNumbers = params.drawNumbers === '1';
    this._maxStackSize = Math.max(
      Config.MIN_MAX_STACK_SIZE,
      Math.min(255, parseInt(params.maxStackSize || '0') || Config.MIN_MAX_STACK_SIZE)
    );
    this._frameDelay = Math.max(Config.MIN_FRAME_DELAY, parseInt(params.frameDelay || '0') || Config.MIN_FRAME_DELAY);
    this._hideControlsWhenRunning = params.hideControlsWhenRunning === '1';
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
