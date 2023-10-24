export default class Complex {
  #real: number;
  #imaginary: number;

  #realSquared: number;
  #imaginarySquared: number;

  constructor(real: number, imaginary: number) {
    this.#real = real;
    this.#imaginary = imaginary;

    this.#realSquared = real * real;
    this.#imaginarySquared = imaginary * imaginary;
  }

  get real(): number {
    return this.#real;
  }

  get imaginary(): number {
    return this.#imaginary;
  }

  get magnitude() {
    return Math.sqrt(this.#realSquared + this.#imaginarySquared);
  }

  static add = (a: Complex, b: Complex) => {
    const real = a.#real + b.#real;
    const imag = a.#imaginary + b.#imaginary;
    return new Complex(real, imag);
  };

  static multiply = (a: Complex, b: Complex) => {
    const real = a.#real * b.#real - a.#imaginary * b.#imaginary;
    const imag = a.#real * b.#imaginary + a.#imaginary * b.#real;
    return new Complex(real, imag);
  };
}
