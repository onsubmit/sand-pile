import { describe, expect, it, vi } from 'vitest';

import CanvasGrid from './canvasGrid';

describe('CanvasGrid', () => {
  it('Should create a grid of radius 1', () => {
    const drawCallback = vi.fn();
    const resizeCallback = vi.fn();

    const grid = new CanvasGrid({
      radius: 1,
      toppleThreshold: 4,
      drawCallback,
      resizeCallback,
    });

    expect(grid.radius).toBe(1);
    expect(grid.toppleThreshold).toBe(4);

    expect(grid.getValueOrThrow(-1, -1)).toBe(0);
    expect(grid.getValueOrThrow(-1, 0)).toBe(0);
    expect(grid.getValueOrThrow(-1, 1)).toBe(0);
    expect(grid.getValueOrThrow(0, -1)).toBe(0);
    expect(grid.getValueOrThrow(0, 0)).toBe(0);
    expect(grid.getValueOrThrow(0, 1)).toBe(0);
    expect(grid.getValueOrThrow(1, -1)).toBe(0);
    expect(grid.getValueOrThrow(1, 0)).toBe(0);
    expect(grid.getValueOrThrow(1, 0)).toBe(0);

    expect(drawCallback).not.toHaveBeenCalled();
    expect(resizeCallback).not.toHaveBeenCalled();
  });

  it('Should update the topple threshold', () => {
    const drawCallback = vi.fn();
    const resizeCallback = vi.fn();

    const grid = new CanvasGrid({
      radius: 1,
      toppleThreshold: 4,
      drawCallback,
      resizeCallback,
    });

    grid.toppleThreshold = 8;
    expect(grid.toppleThreshold).toBe(8);

    expect(drawCallback).not.toHaveBeenCalled();
    expect(resizeCallback).not.toHaveBeenCalled();
  });

  it('Should topple once when threshold is reached', () => {
    const drawCallback = vi.fn();
    const resizeCallback = vi.fn();

    const grid = new CanvasGrid({
      radius: 1,
      toppleThreshold: 4,
      drawCallback,
      resizeCallback,
    });

    grid.incrementOrThrow(0, 0);
    expect(grid.getValueOrThrow(0, 0)).toBe(1);
    expect(drawCallback).toHaveBeenLastCalledWith(0, 0, 1);

    grid.incrementOrThrow(0, 0);
    expect(grid.getValueOrThrow(0, 0)).toBe(2);
    expect(drawCallback).toHaveBeenLastCalledWith(0, 0, 2);

    grid.incrementOrThrow(0, 0);
    expect(grid.getValueOrThrow(0, 0)).toBe(3);
    expect(drawCallback).toHaveBeenLastCalledWith(0, 0, 3);

    grid.incrementOrThrow(0, 0);
    expect(grid.getValueOrThrow(0, 0)).toBe(4);
    expect(drawCallback).toHaveBeenLastCalledWith(0, 0, 4);

    expect(grid.getValueOrThrow(0, 1)).toBe(0);
    expect(grid.getValueOrThrow(0, -1)).toBe(0);
    expect(grid.getValueOrThrow(-1, 0)).toBe(0);
    expect(grid.getValueOrThrow(1, 0)).toBe(0);

    grid.toppleOnce();
    expect(drawCallback).toHaveBeenCalledTimes(12);
    expect(drawCallback).toHaveBeenNthCalledWith(5, -1, 0, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(6, 0, 0, 3);
    expect(drawCallback).toHaveBeenNthCalledWith(7, 0, 1, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(8, 0, 0, 2);
    expect(drawCallback).toHaveBeenNthCalledWith(9, 1, 0, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(10, 0, 0, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(11, 0, -1, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(12, 0, 0, 0);

    expect(grid.getValueOrThrow(0, 0)).toBe(0);
    expect(grid.getValueOrThrow(0, 1)).toBe(1);
    expect(grid.getValueOrThrow(0, -1)).toBe(1);
    expect(grid.getValueOrThrow(-1, 0)).toBe(1);
    expect(grid.getValueOrThrow(1, 0)).toBe(1);

    expect(resizeCallback).not.toHaveBeenCalled();
  });

  it('Should topple multiple cells with no overlap when threshold is reached', () => {
    const drawCallback = vi.fn();
    const resizeCallback = vi.fn();

    const grid = new CanvasGrid({
      radius: 2, // prevent expansion in this test
      toppleThreshold: 4,
      drawCallback,
      resizeCallback,
    });

    grid.incrementOrThrow(-1, -1, 4);
    expect(grid.getValueOrThrow(-1, -1)).toBe(4);
    expect(drawCallback).toHaveBeenLastCalledWith(-1, -1, 4);

    grid.incrementOrThrow(1, 1, 4);
    expect(grid.getValueOrThrow(1, 1)).toBe(4);
    expect(drawCallback).toHaveBeenLastCalledWith(1, 1, 4);

    const { didTopple } = grid.toppleOnceOverGrid();
    expect(didTopple).toBe(true);
    expect(drawCallback).toHaveBeenCalledTimes(18);
    expect(drawCallback).toHaveBeenNthCalledWith(3, -2, -1, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(4, -1, -1, 3);
    expect(drawCallback).toHaveBeenNthCalledWith(5, -1, 0, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(6, -1, -1, 2);
    expect(drawCallback).toHaveBeenNthCalledWith(7, 0, -1, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(8, -1, -1, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(9, -1, -2, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(10, -1, -1, 0);
    expect(drawCallback).toHaveBeenNthCalledWith(11, 0, 1, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(12, 1, 1, 3);
    expect(drawCallback).toHaveBeenNthCalledWith(13, 1, 2, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(14, 1, 1, 2);
    expect(drawCallback).toHaveBeenNthCalledWith(15, 2, 1, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(16, 1, 1, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(17, 1, 0, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(18, 1, 1, 0);

    expect(grid.getValueOrThrow(-1, -1)).toBe(0);
    expect(grid.getValueOrThrow(1, 1)).toBe(0);

    expect(grid.getValueOrThrow(-2, -1)).toBe(1);
    expect(grid.getValueOrThrow(0, -1)).toBe(1);
    expect(grid.getValueOrThrow(-1, -2)).toBe(1);
    expect(grid.getValueOrThrow(-1, 0)).toBe(1);

    expect(grid.getValueOrThrow(0, 1)).toBe(1);
    expect(grid.getValueOrThrow(2, 1)).toBe(1);
    expect(grid.getValueOrThrow(1, 0)).toBe(1);
    expect(grid.getValueOrThrow(1, 2)).toBe(1);

    expect(resizeCallback).not.toHaveBeenCalled();
  });

  it('Should topple multiple cells with overlap when threshold is reached', () => {
    const drawCallback = vi.fn();
    const resizeCallback = vi.fn();

    const grid = new CanvasGrid({
      radius: 1,
      toppleThreshold: 4,
      drawCallback,
      resizeCallback,
    });

    grid.incrementOrThrow(-1, 0, 4);
    expect(grid.getValueOrThrow(-1, 0)).toBe(4);
    expect(drawCallback).toHaveBeenLastCalledWith(-1, 0, 4);

    grid.incrementOrThrow(1, 0, 4);
    expect(grid.getValueOrThrow(1, 0)).toBe(4);
    expect(drawCallback).toHaveBeenLastCalledWith(1, 0, 4);

    const { didTopple } = grid.toppleOnceOverGrid();
    expect(didTopple).toBe(true);
    expect(drawCallback).toHaveBeenCalledTimes(18);
    expect(drawCallback).toHaveBeenNthCalledWith(3, -2, 0, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(4, -1, 0, 3);
    expect(drawCallback).toHaveBeenNthCalledWith(5, -1, 1, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(6, -1, 0, 2);
    expect(drawCallback).toHaveBeenNthCalledWith(7, 0, 0, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(8, -1, 0, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(9, -1, -1, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(10, -1, 0, 0);
    expect(drawCallback).toHaveBeenNthCalledWith(11, 0, 0, 2);
    expect(drawCallback).toHaveBeenNthCalledWith(12, 1, 0, 3);
    expect(drawCallback).toHaveBeenNthCalledWith(13, 1, 1, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(14, 1, 0, 2);
    expect(drawCallback).toHaveBeenNthCalledWith(15, 2, 0, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(16, 1, 0, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(17, 1, -1, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(18, 1, 0, 0);

    expect(grid.getValueOrThrow(-1, 0)).toBe(0);
    expect(grid.getValueOrThrow(1, 0)).toBe(0);
    expect(grid.getValueOrThrow(0, 0)).toBe(2);

    expect(grid.getValueOrThrow(-2, 0)).toBe(1);
    expect(grid.getValueOrThrow(-1, -1)).toBe(1);
    expect(grid.getValueOrThrow(-1, 1)).toBe(1);

    expect(grid.getValueOrThrow(2, 0)).toBe(1);
    expect(grid.getValueOrThrow(1, -1)).toBe(1);
    expect(grid.getValueOrThrow(1, 1)).toBe(1);
  });
});
