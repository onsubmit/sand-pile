export default class Canvas {
  #canvas: HTMLCanvasElement;
  #context: CanvasRenderingContext2D;

  constructor(canvasSelector: string) {
    this.#canvas = this.#getCanvas(canvasSelector);
    this.#context = this.#getContenxt();
  }

  set size(value: number) {
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

  #getContenxt() {
    const context = this.#canvas.getContext('2d');
    if (!context) {
      throw 'Could not get rendering context';
    }

    return context;
  }
}
