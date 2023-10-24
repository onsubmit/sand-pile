import { describe, expect, it } from 'vitest';

import Complex from './complex';

describe('Complex', () => {
  it('Can create a complex number', () => {
    const c = new Complex(3, 4);
    expect(c.real).toBe(3);
    expect(c.imaginary).toBe(4);
    expect(c.magnitude).toBe(5);
  });

  it('Can add two complex numbers', () => {
    const a = new Complex(-2, 5);
    const b = new Complex(7, 7);
    const c = Complex.add(a, b);

    expect(c.real).toBe(5);
    expect(c.imaginary).toBe(12);
    expect(c.magnitude).toBe(13);
  });

  it('Can multiply two complex numbers', () => {
    const a = new Complex(5, 4);
    const b = new Complex(6, 5);
    const c = Complex.multiply(a, b);

    expect(c.real).toBe(10);
    expect(c.imaginary).toBe(49);
    expect(c.magnitude).toBe(Math.sqrt(2501));
  });
});
