// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { InputNumberTypeObserver, InputTextTypeObserver } from './elementObserver';

describe('InputNumberTypeObserver', () => {
  let input: HTMLInputElement;

  beforeEach(() => {
    input = document.createElement('input');
    input.type = 'number';
    input.id = 'input';
    input.valueAsNumber = 1;
    input.max = '42';
    document.body.appendChild(input);
  });

  afterEach(() => {
    document.body.removeChild(input);
  });

  it('Should create a basic observer with no change handler', () => {
    const observer = new InputNumberTypeObserver('#input');
    expect(observer.value).toBe(1);

    input.valueAsNumber = 2;
    input.dispatchEvent(new UIEvent('change'));
    expect(observer.value).toBe(2);

    observer.value = 3;
    expect(input.valueAsNumber).toBe(3);
  });

  it('Should create a basic observer with a change handler', () => {
    const onChange = vi.fn((_newValue: number) => 0);
    const observer = new InputNumberTypeObserver('#input', onChange);

    input.valueAsNumber = 2;
    input.dispatchEvent(new UIEvent('change'));
    expect(observer.value).toBe(2);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('Should support read and writing the input max attribute', () => {
    const observer = new InputNumberTypeObserver('#input');
    expect(observer.max).toBe(42);

    observer.max = 84;
    expect(input.max).toBe('84');
  });
});

describe('InputTextTypeObserver', () => {
  let input: HTMLInputElement;

  beforeEach(() => {
    input = document.createElement('input');
    input.type = 'text';
    input.id = 'input';
    input.value = '1st value';
    document.body.appendChild(input);
  });

  afterEach(() => {
    document.body.removeChild(input);
  });

  it('Should create a basic observer with no change handler', () => {
    const observer = new InputTextTypeObserver('#input');
    expect(observer.value).toBe('1st value');

    input.value = '2nd value';
    input.dispatchEvent(new UIEvent('change'));
    expect(observer.value).toBe('2nd value');

    observer.value = '3rd value';
    expect(input.value).toBe('3rd value');
  });

  it('Should create a basic observer with a change handler', () => {
    const onChange = vi.fn((_newValue: string) => 0);
    const observer = new InputTextTypeObserver('#input', onChange);

    input.value = '2nd value';
    input.dispatchEvent(new UIEvent('change'));
    expect(observer.value).toBe('2nd value');
    expect(onChange).toHaveBeenCalledWith('2nd value');
  });
});
