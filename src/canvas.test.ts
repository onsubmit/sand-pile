// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Canvas from './canvas';

describe('Canvas', () => {
  let canvasEl: HTMLCanvasElement;

  beforeEach(() => {
    // @ts-expect-error: need getContext to return _something_ in jsdom.
    vi.spyOn(window.HTMLCanvasElement.prototype, 'getContext').mockReturnValue({});

    canvasEl = document.createElement('canvas');
    canvasEl.id = 'canvas';
    document.body.appendChild(canvasEl);
  });

  afterEach(() => {
    document.body.removeChild(canvasEl);
  });

  it('Should initialize a basic Canvas object', () => {
    const canvas = new Canvas('#canvas', 800);

    expect(canvas.context).toBeDefined();

    expect(canvas.element).toBe(canvasEl);
    expect(canvas.size).toBe(800);
    expect(canvas.element.width).toBe(800);
    expect(canvas.element.height).toBe(800);
    expect(canvas.element.style.width).toBe('800px');
    expect(canvas.element.style.height).toBe('800px');
  });

  it('Should support updating canvas size', () => {
    const canvas = new Canvas('#canvas', 800);
    canvas.size = 1000;
    expect(canvas.size).toBe(1000);
    expect(canvas.element.width).toBe(1000);
    expect(canvas.element.height).toBe(1000);
    expect(canvas.element.style.width).toBe('1000px');
    expect(canvas.element.style.height).toBe('1000px');
  });

  it('Should throw when canvas selector is invalid', () => {
    expect(() => new Canvas('#invalid', 800)).toThrow('Canvas with selector <#invalid> not found.');
  });

  it('Should throw if rendering context cannot be found', () => {
    vi.spyOn(canvasEl, 'getContext').mockImplementationOnce(() => null);
    expect(() => new Canvas('#canvas', 800)).toThrow('Could not get rendering context');
  });
});
