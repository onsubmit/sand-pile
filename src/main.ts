import { blend, hexToRgb } from './color';
import Config from './config';
import Grid from './grid';
import './style.css';

const searchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(searchParams);
const config = new Config(params);

const cellColor = hexToRgb(config.cellColor);
const cellBackgroundColor = hexToRgb(config.cellBackgroundColor);

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const start = document.querySelector<HTMLButtonElement>('#start')!;

const context = canvas.getContext('2d');
if (!context) {
  throw 'Could not get rendering context';
}

canvas.width = config.canvasWidth;
canvas.height = config.canvasHeight;
context.fillStyle = config.cellColor;
context.font = `${config.cellWidth / 4}px arial`;

const grid = new Grid(
  config.canvasHeight / config.cellHeight,
  config.canvasWidth / config.cellWidth,
  config.maxStackSize
);

const draw = (x: number, y: number, increment: boolean, force = false) => {
  if (config.cellWidth > 1) {
    x = Math.floor(x / config.cellWidth) * config.cellWidth;
  }

  if (config.cellHeight > 1) {
    y = Math.floor(y / config.cellHeight) * config.cellHeight;
  }

  if (!force && x === lastDrawnCell.x && y === lastDrawnCell.y) {
    return;
  }

  lastDrawnCell.x = x;
  lastDrawnCell.y = y;

  const row = y / config.cellHeight;
  const column = x / config.cellWidth;

  const newValue = increment ? grid.incrementOrThrow(row, column) : grid.decrementOrThrow(row, column);
  const newCellColor = blend(cellBackgroundColor, cellColor, newValue / config.maxStackSize);
  context.fillStyle = newCellColor.color;
  context.fillRect(x, y, config.cellWidth, config.cellHeight);
  context.fillStyle = newCellColor.accessibleColor;
  context.fillText(`${newValue}`, x + 4, y + config.cellHeight / 4);
};

const clear = (x: number, y: number) => {
  if (config.cellWidth > 1) {
    x = Math.floor(x / config.cellWidth) * config.cellWidth;
  }

  if (config.cellHeight > 1) {
    y = Math.floor(y / config.cellHeight) * config.cellHeight;
  }

  grid.reset(y / config.cellHeight, x / config.cellWidth);
  context.fillStyle = config.cellBackgroundColor;
  context.fillRect(x, y, config.cellWidth, config.cellHeight);
};

let isMouseDown = false;
let isMiddleClick = false;
let isRightClick = false;

const lastDrawnCell: { x: number | undefined; y: number | undefined } = { x: undefined, y: undefined };

canvas.onmousedown = (e: MouseEvent) => {
  isMouseDown = true;
  isMiddleClick = e.button === 1;
  isRightClick = e.button === 2;

  const { offsetX: x, offsetY: y } = e;
  if (isRightClick) {
    clear(x, y);
  } else if (isMiddleClick) {
    draw(x, y, false, true);
  } else {
    draw(x, y, true, true);
  }
};

canvas.onmouseup = () => {
  isMouseDown = false;
};

canvas.onmousemove = (e: MouseEvent) => {
  if (isMouseDown) {
    const { offsetX: x, offsetY: y } = e;

    if (isRightClick) {
      clear(x, y);
    } else if (isMiddleClick) {
      draw(x, y, false);
    } else {
      draw(x, y, true);
    }
  }
};

canvas.oncontextmenu = () => {
  return false;
};

start.onclick = () => {
  grid.startAvalanche();
};
