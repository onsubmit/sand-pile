export type CartesianCoordinate = { x: number; y: number };

export default class Canvas {
  #canvas: HTMLCanvasElement;
  #context: CanvasRenderingContext2D;
  #size: number;

  constructor(canvasSelector: string, size: number) {
    this.#canvas = this.#getCanvas(canvasSelector);
    this.#context = this.#getContext();
    this.#size = size;
    this.#resizeCanvas();
  }

  get size() {
    return this.#size;
  }

  set size(value: number) {
    this.#size = value;
    this.#resizeCanvas();
  }

  get element(): HTMLCanvasElement {
    return this.#canvas;
  }

  get context(): CanvasRenderingContext2D {
    return this.#context;
  }

  #getCanvas(canvasSelector: string) {
    const canvas = document.querySelector<HTMLCanvasElement>(canvasSelector);
    if (!canvas) {
      throw new Error(`Canvas with selector <${canvasSelector}> not found.`);
    }

    return canvas;
  }

  #getContext() {
    const context = this.#canvas.getContext('2d');
    if (!context) {
      throw 'Could not get rendering context';
    }

    return context;
  }

  #resizeCanvas() {
    this.#canvas.width = this.#size;
    this.#canvas.height = this.#size;
    this.#canvas.style.width = `${this.#size}px`;
    this.#canvas.style.height = `${this.#size}px`;
  }
}
