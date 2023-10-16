import Config from './config';
import Grid from './grid';
import './style.css';

const searchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(searchParams);
const config = new Config(params);

const canvas = document.querySelector<HTMLCanvasElement>('#canvas');

if (!canvas) {
  throw new Error('Canvas not defined');
}

const context = canvas.getContext('2d');
if (!context) {
  throw 'Could not get rendering context';
}

canvas.width = config.canvasWidth;
canvas.height = config.canvasHeight;
context.fillStyle = config.cellColor;

const grid = new Grid(config.canvasHeight / config.cellHeight, config.canvasWidth / config.cellWidth);

const draw = (x: number, y: number) => {
  if (config.cellWidth > 1) {
    x = Math.floor(x / config.cellWidth) * config.cellWidth;
  }

  if (config.cellHeight > 1) {
    y = Math.floor(y / config.cellHeight) * config.cellHeight;
  }

  context.fillRect(x, y, config.cellWidth, config.cellHeight);
  grid.set(y / config.cellHeight, x / config.cellWidth, 1);
};

let isMouseDown = false;
canvas.onmousedown = (e: MouseEvent) => {
  isMouseDown = true;
  const { offsetX: x, offsetY: y } = e;
  draw(x, y);
};

canvas.onmouseup = () => {
  isMouseDown = false;
};

canvas.onmousemove = (e: MouseEvent) => {
  if (isMouseDown) {
    const { offsetX: x, offsetY: y } = e;
    draw(x, y);
  }
};
