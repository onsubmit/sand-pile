export default class Complex {
  #real: number;
  #imag: number;

  constructor(real: number, imag: number) {
    this.#real = real;
    this.#imag = imag;
  }

  get magnitude() {
    return Math.sqrt(this.#real * this.#real + this.#imag * this.#imag);
  }

  toCoords() {
    return {
      x: this.#real,
      y: this.#imag,
    };
  }

  static add = (a: Complex, b: Complex) => {
    const real = a.#real + b.#real;
    const imag = a.#imag + b.#imag;
    return new Complex(real, imag);
  };

  static multiply = (a: Complex, b: Complex) => {
    const real = a.#real * b.#real - a.#imag * b.#imag;
    const imag = a.#real * b.#imag + a.#imag * b.#real;
    return new Complex(real, imag);
  };
}
