import { describe, expect, it } from 'vitest';

import Config from './config';

describe('Config', () => {
  it('Should parse query params', () => {
    const params: Record<string, string> = {
      radius: '5',
      toppleThreshold: '7',
      maxCellGrains: '9',
      cellSize: '3',
      penSize: '1',
      penWeight: '2',
      polygonSides: '6',
      cellColor: '336699',
      cellBackgroundColor: 'ffccaa',
      example: 'circle',
    };

    const config = new Config(params);
    expect(config.radius).toStrictEqual({ value: 5, min: 4, max: 1000 });
    expect(config.toppleThreshold).toStrictEqual({ value: 7, min: 2, max: 256 });
    expect(config.maxCellGrains).toStrictEqual({ value: 9, min: 4, max: 256 });
    expect(config.cellSize).toStrictEqual({ value: 3, min: 3, max: 500 });
    expect(config.penSize).toStrictEqual({ value: 1, min: 1, max: 128 });
    expect(config.penWeight).toStrictEqual({ value: 2, min: 1, max: 9 });
    expect(config.polygonSides).toStrictEqual({ value: 6, min: 3, max: 128 });
    expect(config.cellColor).toBe('#336699');
    expect(config.cellBackgroundColor).toBe('#ffccaa');
    expect(config.defaultExample).toStrictEqual('circle');
  });

  it('Should not let a numeric value be less than its minimum', () => {
    const config = new Config({ radius: '1' });
    expect(config.radius).toStrictEqual({ value: 4, min: 4, max: 1000 });
  });

  it('Should not let a numeric value be more than its maximum', () => {
    const config = new Config({ radius: '1500' });
    expect(config.radius).toStrictEqual({ value: 1000, min: 4, max: 1000 });
  });

  it('Should not let pen weight exceed maxCellGrains', () => {
    const params: Record<string, string> = {
      maxCellGrains: '9',
      penWeight: '10',
    };

    const config = new Config(params);
    expect(config.maxCellGrains).toStrictEqual({ value: 9, min: 4, max: 256 });
    expect(config.penWeight).toStrictEqual({ value: 9, min: 1, max: 9 });
  });

  it('Should support colors with # prefix', () => {
    const params: Record<string, string> = {
      cellColor: '#336699',
      cellBackgroundColor: '#ffccaa',
    };

    const config = new Config(params);
    expect(config.cellColor).toBe('#336699');
    expect(config.cellBackgroundColor).toBe('#ffccaa');
  });

  it('Should ignore invalid numeric values', () => {
    const config = new Config({ radius: 'one' });
    expect(config.radius).toStrictEqual({ value: 20, min: 4, max: 1000 });
  });

  it('Should ignore unknown example values', () => {
    const config = new Config({ example: 'hypersphere' });
    expect(config.defaultExample).toBeUndefined();
  });
});
