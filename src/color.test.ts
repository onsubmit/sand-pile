import { describe, expect, it } from 'vitest';

import { blend, exportedForTesting, hexToRgb } from './color';

const { componentToHex, rgbToHex } = exportedForTesting;

describe('hexToRgb', () => {
  it('Should convert hex values to RGB', () => {
    expect(hexToRgb('#FFFFFF')).toStrictEqual({ red: 255, green: 255, blue: 255 });
    expect(hexToRgb('#C0C0C0')).toStrictEqual({ red: 192, green: 192, blue: 192 });
    expect(hexToRgb('#808080')).toStrictEqual({ red: 128, green: 128, blue: 128 });
    expect(hexToRgb('#000000')).toStrictEqual({ red: 0, green: 0, blue: 0 });
    expect(hexToRgb('#FF0000')).toStrictEqual({ red: 255, green: 0, blue: 0 });
    expect(hexToRgb('#800000')).toStrictEqual({ red: 128, green: 0, blue: 0 });
    expect(hexToRgb('#FFFF00')).toStrictEqual({ red: 255, green: 255, blue: 0 });
    expect(hexToRgb('#808000')).toStrictEqual({ red: 128, green: 128, blue: 0 });
    expect(hexToRgb('#00FF00')).toStrictEqual({ red: 0, green: 255, blue: 0 });
    expect(hexToRgb('#008000')).toStrictEqual({ red: 0, green: 128, blue: 0 });
    expect(hexToRgb('#00FFFF')).toStrictEqual({ red: 0, green: 255, blue: 255 });
    expect(hexToRgb('#008080')).toStrictEqual({ red: 0, green: 128, blue: 128 });
    expect(hexToRgb('#0000FF')).toStrictEqual({ red: 0, green: 0, blue: 255 });
    expect(hexToRgb('#000080')).toStrictEqual({ red: 0, green: 0, blue: 128 });
    expect(hexToRgb('#FF00FF')).toStrictEqual({ red: 255, green: 0, blue: 255 });
    expect(hexToRgb('#800080')).toStrictEqual({ red: 128, green: 0, blue: 128 });

    expect(hexToRgb('#C71585')).toStrictEqual({ red: 199, green: 21, blue: 133 });
    expect(hexToRgb('#4B0082')).toStrictEqual({ red: 75, green: 0, blue: 130 });
    expect(hexToRgb('#556B2F')).toStrictEqual({ red: 85, green: 107, blue: 47 });
    expect(hexToRgb('#DC143C')).toStrictEqual({ red: 220, green: 20, blue: 60 });
    expect(hexToRgb('#FF6347')).toStrictEqual({ red: 255, green: 99, blue: 71 });
    expect(hexToRgb('#191970')).toStrictEqual({ red: 25, green: 25, blue: 112 });
    expect(hexToRgb('#BDB76B')).toStrictEqual({ red: 189, green: 183, blue: 107 });
    expect(hexToRgb('#FAEBD7')).toStrictEqual({ red: 250, green: 235, blue: 215 });
    expect(hexToRgb('#8B4513')).toStrictEqual({ red: 139, green: 69, blue: 19 });
    expect(hexToRgb('#20B2AA')).toStrictEqual({ red: 32, green: 178, blue: 170 });
    expect(hexToRgb('#778899')).toStrictEqual({ red: 119, green: 136, blue: 153 });
  });

  it('Should throw for invalid input', () => {
    const message = 'Only 6-digit hex strings are supported';
    expect(() => hexToRgb('')).toThrowError(message);
    expect(() => hexToRgb('fff')).toThrowError(message);
    expect(() => hexToRgb('1234567')).toThrowError(message);
    expect(() => hexToRgb('#TTTTTT')).toThrowError(message);
    expect(() => hexToRgb('#00FF0099')).toThrowError(message);
  });
});

describe('blend', () => {
  it('Should blend colors', () => {
    expect(blend({ red: 0, blue: 0, green: 0 }, { red: 255, green: 255, blue: 255 }, 0.5)).toStrictEqual('#7f7f7f');
    expect(blend({ red: 255, green: 255, blue: 255 }, { red: 0, blue: 0, green: 0 }, 0.5)).toStrictEqual('#7f7f7f');

    expect(blend({ red: 0, blue: 0, green: 0 }, { red: 255, green: 255, blue: 255 }, 0)).toStrictEqual('#000000');
    expect(blend({ red: 0, blue: 0, green: 0 }, { red: 255, green: 255, blue: 255 }, 1)).toStrictEqual('#ffffff');
    expect(blend({ red: 255, green: 255, blue: 255 }, { red: 0, blue: 0, green: 0 }, 0)).toStrictEqual('#ffffff');
    expect(blend({ red: 255, green: 255, blue: 255 }, { red: 0, blue: 0, green: 0 }, 1)).toStrictEqual('#000000');

    expect(blend({ red: 12, green: 187, blue: 209 }, { red: 188, blue: 14, green: 117 }, 0.5)).toStrictEqual('#64986f');
    expect(blend({ red: 188, blue: 14, green: 117 }, { red: 12, green: 187, blue: 209 }, 0.5)).toStrictEqual('#64986f');

    expect(blend({ red: 12, green: 187, blue: 209 }, { red: 188, blue: 14, green: 117 }, 0.2)).toStrictEqual('#2fadaa');
    expect(blend({ red: 188, blue: 14, green: 117 }, { red: 12, green: 187, blue: 209 }, 0.2)).toStrictEqual('#988335');
  });
});

describe('private', () => {
  describe('componentToHex', () => {
    it('Should convert RGB values to hex', () => {
      expect(componentToHex(255)).toBe('ff');
      expect(componentToHex(192)).toBe('c0');
      expect(componentToHex(128)).toBe('80');
      expect(componentToHex(0)).toBe('00');
      expect(componentToHex(199)).toBe('c7');
      expect(componentToHex(75)).toBe('4b');
      expect(componentToHex(85)).toBe('55');
      expect(componentToHex(220)).toBe('dc');
      expect(componentToHex(25)).toBe('19');
      expect(componentToHex(189)).toBe('bd');
      expect(componentToHex(250)).toBe('fa');
      expect(componentToHex(139)).toBe('8b');
      expect(componentToHex(32)).toBe('20');
      expect(componentToHex(119)).toBe('77');
      expect(componentToHex(9)).toBe('09');
    });
  });

  describe('rgbToHex', () => {
    it('Should convert RGB to hex', () => {
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
      expect(rgbToHex(192, 192, 192)).toBe('#c0c0c0');
      expect(rgbToHex(128, 128, 128)).toBe('#808080');
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(128, 0, 0)).toBe('#800000');
      expect(rgbToHex(255, 255, 0)).toBe('#ffff00');
      expect(rgbToHex(128, 128, 0)).toBe('#808000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 128, 0)).toBe('#008000');
      expect(rgbToHex(0, 255, 255)).toBe('#00ffff');
      expect(rgbToHex(0, 128, 128)).toBe('#008080');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
      expect(rgbToHex(0, 0, 128)).toBe('#000080');
      expect(rgbToHex(255, 0, 255)).toBe('#ff00ff');
      expect(rgbToHex(128, 0, 128)).toBe('#800080');
      expect(rgbToHex(199, 21, 133)).toBe('#c71585');
      expect(rgbToHex(75, 0, 130)).toBe('#4b0082');
      expect(rgbToHex(85, 107, 47)).toBe('#556b2f');
      expect(rgbToHex(220, 20, 60)).toBe('#dc143c');
      expect(rgbToHex(255, 99, 71)).toBe('#ff6347');
      expect(rgbToHex(25, 25, 112)).toBe('#191970');
      expect(rgbToHex(189, 183, 107)).toBe('#bdb76b');
      expect(rgbToHex(250, 235, 215)).toBe('#faebd7');
      expect(rgbToHex(139, 69, 19)).toBe('#8b4513');
      expect(rgbToHex(32, 178, 170)).toBe('#20b2aa');
      expect(rgbToHex(119, 136, 153)).toBe('#778899');
    });
  });
});
