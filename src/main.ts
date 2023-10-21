import { blend, hexToRgb } from './color';
import Config from './config';
import { drawCircle, drawRandomly, fill } from './examples';
import Grid from './grid';
import './style.css';

const searchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(searchParams);
const config = new Config(params);

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const controls = document.querySelector<HTMLButtonElement>('.controls')!;
const start = document.querySelector<HTMLButtonElement>('#start')!;
const stop = document.querySelector<HTMLButtonElement>('#stop')!;
const stepOnce = document.querySelector<HTMLButtonElement>('#stepOnce')!;
const stepAll = document.querySelector<HTMLButtonElement>('#stepAll')!;
const download = document.querySelector<HTMLButtonElement>('#download')!;
const examples = document.querySelector<HTMLButtonElement>('.examples')!;
const exampleCircle = document.querySelector<HTMLButtonElement>('#exampleCircle')!;
const exampleFill = document.querySelector<HTMLButtonElement>('#exampleFill')!;
const exampleRandom = document.querySelector<HTMLButtonElement>('#exampleRandom')!;
const radius = document.querySelector<HTMLInputElement>('#radius')!;
const cellSizeEl = document.querySelector<HTMLInputElement>('#cellSize')!;
const cellColorEl = document.querySelector<HTMLInputElement>('#cellColor')!;
const cellBackgroundColorEl = document.querySelector<HTMLInputElement>('#cellBackgroundColor')!;

const context = canvas.getContext('2d');
if (!context) {
  throw 'Could not get rendering context';
}

let startAnimation = false;
let numIterations = 0;
let cellSize = cellSizeEl.valueAsNumber;
let cellColor = cellColorEl.value;
let cellColorRgb = hexToRgb(cellColor);
let cellBackgroundColor = cellBackgroundColorEl.value;
let cellBackgroundColorRgb = hexToRgb(cellBackgroundColor);
const initialGridWidthInNumCells = 1 + 2 * radius.valueAsNumber;

canvas.width = cellSize * initialGridWidthInNumCells;
canvas.height = cellSize * initialGridWidthInNumCells;
context.fillStyle = cellColor;
context.font = `${cellSize / 4}px arial`;

const drawAtCoordinate = (row: number, column: number, value: number) => {
  const newCellColor = blend(
    cellBackgroundColorRgb,
    cellColorRgb,
    Math.min(value, config.maxStackSize) / config.maxStackSize
  );

  context.fillStyle = newCellColor.color;

  const { x, y } = mapGridCoordinatesToCanvasCoordinates(row, column);
  context.fillRect(x, y, cellSize, cellSize);

  if (config.drawNumbers && value) {
    context.fillStyle = newCellColor.accessibleColor;
    context.fillText(`${value}`, x + 4, y + cellSize - 4);
  }
};

const redraw = (newRadius: number): void => {
  canvas.width = cellSize * (1 + 2 * newRadius);
  canvas.height = cellSize * (1 + 2 * newRadius);

  context.clearRect(0, 0, canvas.width, canvas.height);

  radius.valueAsNumber = newRadius;

  for (let r = -newRadius; r <= newRadius; r++) {
    for (let c = -newRadius; c <= newRadius; c++) {
      drawAtCoordinate(r, c, grid.getValueOrThrow(r, c));
    }
  }
};

const grid = new Grid(radius.valueAsNumber, config.maxStackSize, drawAtCoordinate, redraw);

const mapCanvasCoordinatesToGridCoordinates = (x: number, y: number): { row: number; column: number } => {
  const { radius } = grid;
  const row = -radius + y / cellSize;
  const column = -radius + x / cellSize;

  return { row, column };
};

const mapGridCoordinatesToCanvasCoordinates = (row: number, column: number): { x: number; y: number } => {
  const { radius } = grid;
  const x = (radius + column) * cellSize;
  const y = (radius + row) * cellSize;

  return { x, y };
};

const drawAtMouse = (x: number, y: number, increment: boolean, force = false) => {
  if (cellSize > 1) {
    x = Math.floor(x / cellSize) * cellSize;
  }

  if (cellSize > 1) {
    y = Math.floor(y / cellSize) * cellSize;
  }

  if (!force && x === lastDrawnCell.x && y === lastDrawnCell.y) {
    return;
  }

  lastDrawnCell.x = x;
  lastDrawnCell.y = y;

  const { row, column } = mapCanvasCoordinatesToGridCoordinates(x, y);

  // TODO: Make this configurable.
  if (increment && grid.getValueOrThrow(row, column) >= config.maxStackSize) {
    return;
  }

  if (increment) {
    grid.incrementOrThrow(row, column);
  } else {
    grid.decrementOrThrow(row, column);
  }
};

const clear = (x: number, y: number) => {
  if (cellSize > 1) {
    x = Math.floor(x / cellSize) * cellSize;
  }

  if (cellSize > 1) {
    y = Math.floor(y / cellSize) * cellSize;
  }

  const { row, column } = mapCanvasCoordinatesToGridCoordinates(x, y);

  grid.reset(row, column);
  context.fillStyle = cellBackgroundColor;
  context.fillRect(x, y, cellSize, cellSize);
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
    drawAtMouse(x, y, false, true);
  } else {
    drawAtMouse(x, y, true, true);
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
      drawAtMouse(x, y, false);
    } else {
      drawAtMouse(x, y, true);
    }
  }
};

canvas.oncontextmenu = () => {
  return false;
};

start.onclick = () => {
  if (config.hideControlsWhenRunning) {
    controls.style.visibility = 'hidden';
    examples.style.visibility = 'hidden';
  }

  numIterations = 0;
  startAnimation = true;
  start.disabled = true;
  stop.disabled = false;
  stepAll.disabled = true;
  stepOnce.disabled = true;
  radius.disabled = true;
  requestLoop();
};

stop.onclick = () => {
  startAnimation = false;
  start.disabled = false;
  stop.disabled = true;
  stepAll.disabled = false;
  stepOnce.disabled = false;
  radius.disabled = false;
};

stepOnce.onclick = () => {
  grid.avalancheOnce();
};

stepAll.onclick = () => {
  grid.avalancheOnceOverGrid();
};

download.onclick = () => {
  const link = document.createElement('a');
  link.download = `filename-${numIterations}.png`;
  link.href = canvas.toDataURL();
  link.click();
};

exampleCircle.onclick = () => {
  // TODO: Make the maxValue configurable.
  grid.drawExample(drawCircle(grid.radius, grid.maxValue));
};

exampleFill.onclick = () => {
  grid.drawExample(fill(grid.maxValue));
};

exampleRandom.onclick = () => {
  grid.drawExample(drawRandomly(grid.maxValue));
};

radius.onchange = () => {
  grid.maybeResize(radius.valueAsNumber);
  redraw(radius.valueAsNumber);
};

cellSizeEl.onchange = () => {
  cellSize = cellSizeEl.valueAsNumber;
  const initialGridWidthInNumCells = 1 + 2 * radius.valueAsNumber;

  canvas.width = cellSize * initialGridWidthInNumCells;
  canvas.height = cellSize * initialGridWidthInNumCells;
  context.font = `${cellSize / 4}px arial`;
  grid.redraw();
};

cellColorEl.onchange = () => {
  cellColor = cellColorEl.value;
  cellColorRgb = hexToRgb(cellColor);
  redraw(radius.valueAsNumber);
};

cellBackgroundColorEl.onchange = () => {
  cellBackgroundColor = cellBackgroundColorEl.value;
  cellBackgroundColorRgb = hexToRgb(cellBackgroundColor);
  redraw(radius.valueAsNumber);
};

const loop = () => {
  if (!startAnimation) {
    return;
  }

  ++numIterations;

  const didAvalanche = grid.avalancheOnceOverGrid();
  if (!didAvalanche) {
    if (config.hideControlsWhenRunning) {
      controls.style.visibility = 'visible';
      examples.style.visibility = 'visible';
    }
    stop.click();
    console.log(`Num iterations: ${numIterations}`);
    return;
  }

  if (config.frameDelay > 0) {
    setTimeout(() => {
      requestLoop();
    }, config.frameDelay);
  } else {
    requestLoop();
  }
};

const requestLoop = () => {
  window.requestAnimationFrame(() => loop());
};
