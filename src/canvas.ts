export type CanvasCoordinates = { x: number; y: number };

export default class Canvas {
  #canvas: HTMLCanvasElement;
  #context: CanvasRenderingContext2D;
  #size: number;

  constructor(canvasSelector: string) {
    this.#canvas = this.#getCanvas(canvasSelector);
    this.#context = this.#getContext();
    this.#size = this.#canvas.width; // square
  }

  get size() {
    return this.#size;
  }

  set size(value: number) {
    this.#size = value;
    this.#canvas.width = value;
    this.#canvas.height = value;
    this.#canvas.style.width = `${value}px`;
    this.#canvas.style.height = `${value}px`;
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
}
