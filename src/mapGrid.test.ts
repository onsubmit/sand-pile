import { describe, expect, it } from 'vitest';

import MapGrid from './mapGrid';

describe('MapGrid', () => {
  it('Should create a grid of radius 1', () => {
    const grid = new MapGrid<number>({ radius: 1, defaultValue: 0 });

    expect(grid.radius).toBe(1);

    expect(grid.get(-1, -1)).toBe(0);
    expect(grid.get(-1, 0)).toBe(0);
    expect(grid.get(-1, 1)).toBe(0);
    expect(grid.get(0, -1)).toBe(0);
    expect(grid.get(0, 0)).toBe(0);
    expect(grid.get(0, 1)).toBe(0);
    expect(grid.get(1, -1)).toBe(0);
    expect(grid.get(1, 0)).toBe(0);
    expect(grid.get(1, 1)).toBe(0);

    expect(grid.get(-2, -2)).toBeUndefined();
    expect(grid.get(-2, -1)).toBeUndefined();
    expect(grid.get(-2, 0)).toBeUndefined();
    expect(grid.get(-2, 1)).toBeUndefined();
    expect(grid.get(-2, 2)).toBeUndefined();

    expect(grid.get(-1, -2)).toBeUndefined();
    expect(grid.get(-1, 2)).toBeUndefined();
    expect(grid.get(0, -2)).toBeUndefined();
    expect(grid.get(0, 2)).toBeUndefined();
    expect(grid.get(1, -2)).toBeUndefined();
    expect(grid.get(1, 2)).toBeUndefined();

    expect(grid.get(2, -2)).toBeUndefined();
    expect(grid.get(2, -1)).toBeUndefined();
    expect(grid.get(2, 0)).toBeUndefined();
    expect(grid.get(2, 1)).toBeUndefined();
    expect(grid.get(2, 2)).toBeUndefined();
  });

  it('Should create a grid of radius 2', () => {
    const grid = new MapGrid<number>({ radius: 2, defaultValue: 0 });

    expect(grid.radius).toBe(2);

    expect(grid.get(-1, -1)).toBe(0);
    expect(grid.get(-1, 0)).toBe(0);
    expect(grid.get(-1, 1)).toBe(0);
    expect(grid.get(0, -1)).toBe(0);
    expect(grid.get(0, 0)).toBe(0);
    expect(grid.get(0, 1)).toBe(0);
    expect(grid.get(1, -1)).toBe(0);
    expect(grid.get(1, 0)).toBe(0);
    expect(grid.get(1, 1)).toBe(0);

    expect(grid.get(-2, -2)).toBe(0);
    expect(grid.get(-2, -1)).toBe(0);
    expect(grid.get(-2, 0)).toBe(0);
    expect(grid.get(-2, 1)).toBe(0);
    expect(grid.get(-2, 2)).toBe(0);

    expect(grid.get(-1, -2)).toBe(0);
    expect(grid.get(-1, 2)).toBe(0);
    expect(grid.get(0, -2)).toBe(0);
    expect(grid.get(0, 2)).toBe(0);
    expect(grid.get(1, -2)).toBe(0);
    expect(grid.get(1, 2)).toBe(0);

    expect(grid.get(2, -2)).toBe(0);
    expect(grid.get(2, -1)).toBe(0);
    expect(grid.get(2, 0)).toBe(0);
    expect(grid.get(2, 1)).toBe(0);
    expect(grid.get(2, 2)).toBe(0);
  });

  it('Should throw for getting values for coordinates outside the radius', () => {
    const grid = new MapGrid<number>({ radius: 1, defaultValue: 0 });

    expect(() => grid.getOrThrow(-2, -2)).toThrowError('Invalid row: -2');
    expect(() => grid.getOrThrow(-2, -1)).toThrowError('Invalid row: -2');
    expect(() => grid.getOrThrow(-2, 0)).toThrowError('Invalid row: -2');
    expect(() => grid.getOrThrow(-2, 1)).toThrowError('Invalid row: -2');
    expect(() => grid.getOrThrow(-2, 2)).toThrowError('Invalid row: -2');

    expect(() => grid.getOrThrow(-1, -2)).toThrowError('Invalid column: -2');
    expect(() => grid.getOrThrow(-1, 2)).toThrowError('Invalid column: 2');
    expect(() => grid.getOrThrow(0, -2)).toThrowError('Invalid column: -2');
    expect(() => grid.getOrThrow(0, 2)).toThrowError('Invalid column: 2');
    expect(() => grid.getOrThrow(1, -2)).toThrowError('Invalid column: -2');
    expect(() => grid.getOrThrow(1, 2)).toThrowError('Invalid column: 2');

    expect(() => grid.getOrThrow(2, -2)).toThrowError('Invalid row: 2');
    expect(() => grid.getOrThrow(2, -1)).toThrowError('Invalid row: 2');
    expect(() => grid.getOrThrow(2, 0)).toThrowError('Invalid row: 2');
    expect(() => grid.getOrThrow(2, 1)).toThrowError('Invalid row: 2');
    expect(() => grid.getOrThrow(2, 2)).toThrowError('Invalid row: 2');
  });

  it('Should create new columns but not rows when setting values for coordinates outside the radius', () => {
    const grid = new MapGrid<number>({ radius: 1, defaultValue: 0 });

    grid.set(-2, -2, 1);
    expect(grid.get(-2, -2)).toBeUndefined();
    grid.set(-2, -1, 1);
    expect(grid.get(-2, -1)).toBeUndefined();
    grid.set(-2, 0, 1);
    expect(grid.get(-2, 0)).toBeUndefined();
    grid.set(-2, 1, 1);
    expect(grid.get(-2, 1)).toBeUndefined();
    grid.set(-2, 2, 1);
    expect(grid.get(-2, 2)).toBeUndefined();

    grid.set(-1, -2, 1);
    expect(grid.get(-1, -2)).toBe(1);
    grid.set(-1, 2, 1);
    expect(grid.get(-1, 2)).toBe(1);
    grid.set(0, -2, 1);
    expect(grid.get(0, -2)).toBe(1);
    grid.set(0, 2, 1);
    expect(grid.get(0, 2)).toBe(1);
    grid.set(1, -2, 1);
    expect(grid.get(1, -2)).toBe(1);
    grid.set(1, 2, 1);
    expect(grid.get(1, 2)).toBe(1);

    grid.set(2, -2, 1);
    expect(grid.get(2, -2)).toBeUndefined();
    grid.set(2, -1, 1);
    expect(grid.get(2, -1)).toBeUndefined();
    grid.set(2, 0, 1);
    expect(grid.get(2, 0)).toBeUndefined();
    grid.set(2, 1, 1);
    expect(grid.get(2, 1)).toBeUndefined();
    grid.set(2, 2, 1);
    expect(grid.get(2, 2)).toBeUndefined();
  });

  it('Should throw for setting values for coordinates outside the radius', () => {
    const grid = new MapGrid<number>({ radius: 1, defaultValue: 0 });

    expect(() => grid.setOrThrow(-2, -2, 1)).toThrowError('Invalid row: -2');
    expect(() => grid.setOrThrow(-2, -1, 1)).toThrowError('Invalid row: -2');
    expect(() => grid.setOrThrow(-2, 0, 1)).toThrowError('Invalid row: -2');
    expect(() => grid.setOrThrow(-2, 1, 1)).toThrowError('Invalid row: -2');
    expect(() => grid.setOrThrow(-2, 2, 1)).toThrowError('Invalid row: -2');

    expect(() => grid.setOrThrow(-1, -2, 1)).toThrowError('Invalid column: -2');
    expect(() => grid.setOrThrow(-1, 2, 1)).toThrowError('Invalid column: 2');
    expect(() => grid.setOrThrow(0, -2, 1)).toThrowError('Invalid column: -2');
    expect(() => grid.setOrThrow(0, 2, 1)).toThrowError('Invalid column: 2');
    expect(() => grid.setOrThrow(1, -2, 1)).toThrowError('Invalid column: -2');
    expect(() => grid.setOrThrow(1, 2, 1)).toThrowError('Invalid column: 2');

    expect(() => grid.setOrThrow(2, -2, 1)).toThrowError('Invalid row: 2');
    expect(() => grid.setOrThrow(2, -1, 1)).toThrowError('Invalid row: 2');
    expect(() => grid.setOrThrow(2, 0, 1)).toThrowError('Invalid row: 2');
    expect(() => grid.setOrThrow(2, 1, 1)).toThrowError('Invalid row: 2');
    expect(() => grid.setOrThrow(2, 2, 1)).toThrowError('Invalid row: 2');
  });

  it('Should not resize if new radius is the same as the old one', () => {
    const grid = new MapGrid<number>({ radius: 1, defaultValue: 0 });
    expect(grid.maybeResize(1)).toBe(false);
    expect(grid.radius).toBe(1);
  });

  it('Should expand the grid', () => {
    const grid = new MapGrid<number>({ radius: 1, defaultValue: 0 });
    expect(grid.maybeResize(2)).toBe(true);
    expect(grid.radius).toBe(2);

    expect(grid.get(-1, -1)).toBe(0);
    expect(grid.get(-1, 0)).toBe(0);
    expect(grid.get(-1, 1)).toBe(0);
    expect(grid.get(0, -1)).toBe(0);
    expect(grid.get(0, 0)).toBe(0);
    expect(grid.get(0, 1)).toBe(0);
    expect(grid.get(1, -1)).toBe(0);
    expect(grid.get(1, 0)).toBe(0);
    expect(grid.get(1, 1)).toBe(0);

    expect(grid.get(-2, -2)).toBe(0);
    expect(grid.get(-2, -1)).toBe(0);
    expect(grid.get(-2, 0)).toBe(0);
    expect(grid.get(-2, 1)).toBe(0);
    expect(grid.get(-2, 2)).toBe(0);

    expect(grid.get(-1, -2)).toBe(0);
    expect(grid.get(-1, 2)).toBe(0);
    expect(grid.get(0, -2)).toBe(0);
    expect(grid.get(0, 2)).toBe(0);
    expect(grid.get(1, -2)).toBe(0);
    expect(grid.get(1, 2)).toBe(0);

    expect(grid.get(2, -2)).toBe(0);
    expect(grid.get(2, -1)).toBe(0);
    expect(grid.get(2, 0)).toBe(0);
    expect(grid.get(2, 1)).toBe(0);
    expect(grid.get(2, 2)).toBe(0);
  });

  it('Should shrink the grid', () => {
    const grid = new MapGrid<number>({ radius: 2, defaultValue: 0 });

    expect(grid.maybeResize(1)).toBe(true);
    expect(grid.radius).toBe(1);

    expect(grid.get(-1, -1)).toBe(0);
    expect(grid.get(-1, 0)).toBe(0);
    expect(grid.get(-1, 1)).toBe(0);
    expect(grid.get(0, -1)).toBe(0);
    expect(grid.get(0, 0)).toBe(0);
    expect(grid.get(0, 1)).toBe(0);
    expect(grid.get(1, -1)).toBe(0);
    expect(grid.get(1, 0)).toBe(0);
    expect(grid.get(1, 1)).toBe(0);

    expect(grid.get(-2, -2)).toBeUndefined();
    expect(grid.get(-2, -1)).toBeUndefined();
    expect(grid.get(-2, 0)).toBeUndefined();
    expect(grid.get(-2, 1)).toBeUndefined();
    expect(grid.get(-2, 2)).toBeUndefined();

    expect(grid.get(-1, -2)).toBeUndefined();
    expect(grid.get(-1, 2)).toBeUndefined();
    expect(grid.get(0, -2)).toBeUndefined();
    expect(grid.get(0, 2)).toBeUndefined();
    expect(grid.get(1, -2)).toBeUndefined();
    expect(grid.get(1, 2)).toBeUndefined();

    expect(grid.get(2, -2)).toBeUndefined();
    expect(grid.get(2, -1)).toBeUndefined();
    expect(grid.get(2, 0)).toBeUndefined();
    expect(grid.get(2, 1)).toBeUndefined();
    expect(grid.get(2, 2)).toBeUndefined();
  });
});
