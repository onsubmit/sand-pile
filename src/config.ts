export default class Config {
  private static readonly MIN_FRAME_DELAY = 0;

  private _frameDelay: number;
  private _hideControlsWhenRunning: boolean;

  constructor(params: { [key: string]: string }) {
    this._frameDelay = Math.max(Config.MIN_FRAME_DELAY, parseInt(params.frameDelay || '0') || Config.MIN_FRAME_DELAY);
    this._hideControlsWhenRunning = params.hideControlsWhenRunning === '1';
  }

  get frameDelay() {
    return this._frameDelay;
  }

  get hideControlsWhenRunning() {
    return this._hideControlsWhenRunning;
  }
}
