import Canvas from './canvas';
import { blend, hexToRgb } from './color';
import { InputNumberTypeObserver, InputTextTypeObserver } from './elementObserver';
import { drawCheckerboard, drawCircle, drawRandomly, fill } from './examples';
import Grid from './grid';
import './style.css';

const start = document.querySelector<HTMLButtonElement>('#start')!;
const stop = document.querySelector<HTMLButtonElement>('#stop')!;
const stepOnce = document.querySelector<HTMLButtonElement>('#stepOnce')!;
const stepAll = document.querySelector<HTMLButtonElement>('#stepAll')!;
const download = document.querySelector<HTMLButtonElement>('#download')!;
const exampleCircle = document.querySelector<HTMLButtonElement>('#exampleCircle')!;
const exampleFill = document.querySelector<HTMLButtonElement>('#exampleFill')!;
const exampleCheckerboard = document.querySelector<HTMLButtonElement>('#exampleCheckerboard')!;
const exampleRandom = document.querySelector<HTMLButtonElement>('#exampleRandom')!;

const radius = new InputNumberTypeObserver('#radius', onRadiusChange).listen();
const toppleThreshold = new InputNumberTypeObserver('#toppleThreshold', onToppleThresholdChange).listen();
const maxCellGrains = new InputNumberTypeObserver('#maxCellGrains').listen();
const cellSize = new InputNumberTypeObserver('#cellSize', onCellSizeChange).listen();
const cellColor = new InputTextTypeObserver('#cellColor', onCellColorChange).listen();
const cellBackgroundColor = new InputTextTypeObserver('#cellBackgroundColor', onCellBackgroundColorChange).listen();

let startAnimation = false;
let numIterations = 0;
let cellColorRgb = hexToRgb(cellColor.value);
let cellBackgroundColorRgb = hexToRgb(cellBackgroundColor.value);
const initialGridWidthInNumCells = 1 + 2 * radius.value;

const canvas = new Canvas('#canvas');
canvas.size = cellSize.value * initialGridWidthInNumCells;
canvas.context.fillStyle = cellColor.value;

const mouseState = {
  isMouseDown: false,
  isMiddleClick: false,
  isRightClick: false,
};

const lastDrawnCell: { x: number | undefined; y: number | undefined } = { x: undefined, y: undefined };

canvas.element.addEventListener('mousedown', (e: MouseEvent) => {
  mouseState.isMouseDown = true;
  mouseState.isMiddleClick = e.button === 1;
  mouseState.isRightClick = e.button === 2;

  const { offsetX: x, offsetY: y } = e;
  if (mouseState.isRightClick) {
    clear(x, y);
  } else if (mouseState.isMiddleClick) {
    drawAtMouse(x, y, false, true);
  } else {
    drawAtMouse(x, y, true, true);
  }
});

canvas.element.onmouseup = () => {
  mouseState.isMouseDown = false;
};

canvas.element.onmousemove = (e: MouseEvent) => {
  if (mouseState.isMouseDown) {
    const { offsetX: x, offsetY: y } = e;

    if (mouseState.isRightClick) {
      clear(x, y);
    } else if (mouseState.isMiddleClick) {
      drawAtMouse(x, y, false);
    } else {
      drawAtMouse(x, y, true);
    }
  }
};

canvas.element.oncontextmenu = () => false;

const drawAtCoordinate = (row: number, column: number, value: number) => {
  const newCellColor = blend(
    cellBackgroundColorRgb,
    cellColorRgb,
    Math.min(value, toppleThreshold.value) / toppleThreshold.value
  );

  canvas.context.fillStyle = newCellColor.color;

  const { x, y } = mapGridCoordinatesToCanvasCoordinates(row, column);
  canvas.context.fillRect(x, y, cellSize.value, cellSize.value);
};

const redraw = (newRadius: number): void => {
  canvas.size = cellSize.value * (1 + 2 * newRadius);
  canvas.context.clearRect(0, 0, canvas.size, canvas.size);

  radius.value = newRadius;

  for (let r = -newRadius; r <= newRadius; r++) {
    for (let c = -newRadius; c <= newRadius; c++) {
      drawAtCoordinate(r, c, grid.getValueOrThrow(r, c));
    }
  }
};

const grid = new Grid(radius.value, toppleThreshold.value, drawAtCoordinate, redraw);

const mapCanvasCoordinatesToGridCoordinates = (x: number, y: number): { row: number; column: number } => {
  const { radius } = grid;
  const row = -radius + y / cellSize.value;
  const column = -radius + x / cellSize.value;

  return { row, column };
};

const mapGridCoordinatesToCanvasCoordinates = (row: number, column: number): { x: number; y: number } => {
  const { radius } = grid;
  const x = (radius + column) * cellSize.value;
  const y = (radius + row) * cellSize.value;

  return { x, y };
};

const drawAtMouse = (x: number, y: number, increment: boolean, force = false) => {
  if (cellSize.value > 1) {
    x = Math.floor(x / cellSize.value) * cellSize.value;
  }

  if (cellSize.value > 1) {
    y = Math.floor(y / cellSize.value) * cellSize.value;
  }

  if (!force && x === lastDrawnCell.x && y === lastDrawnCell.y) {
    return;
  }

  lastDrawnCell.x = x;
  lastDrawnCell.y = y;

  const { row, column } = mapCanvasCoordinatesToGridCoordinates(x, y);

  // TODO: Make this configurable.
  if (increment && grid.getValueOrThrow(row, column) >= maxCellGrains.value) {
    return;
  }

  if (increment) {
    grid.incrementOrThrow(row, column);
  } else {
    grid.decrementOrThrow(row, column);
  }
};

const clear = (x: number, y: number) => {
  if (cellSize.value > 1) {
    x = Math.floor(x / cellSize.value) * cellSize.value;
  }

  if (cellSize.value > 1) {
    y = Math.floor(y / cellSize.value) * cellSize.value;
  }

  const { row, column } = mapCanvasCoordinatesToGridCoordinates(x, y);

  grid.reset(row, column);
  canvas.context.fillStyle = cellBackgroundColor.value;
  canvas.context.fillRect(x, y, cellSize.value, cellSize.value);
};

start.onclick = () => {
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
  link.href = canvas.element.toDataURL();
  link.click();
};

exampleCircle.onclick = () => {
  grid.drawExample(drawCircle(grid.radius, maxCellGrains.value));
};

exampleFill.onclick = () => {
  grid.drawExample(fill(maxCellGrains.value));
};

exampleCheckerboard.onclick = () => {
  grid.drawExample(drawCheckerboard(maxCellGrains.value));
};

exampleRandom.onclick = () => {
  grid.drawExample(drawRandomly(maxCellGrains.value));
};

const loop = () => {
  if (!startAnimation) {
    return;
  }

  ++numIterations;

  const didAvalanche = grid.avalancheOnceOverGrid();
  if (!didAvalanche) {
    stop.click();
    console.log(`Num iterations: ${numIterations}`);
    return;
  }

  requestLoop();
};

const requestLoop = () => {
  window.requestAnimationFrame(() => loop());
};

function onRadiusChange(newRadius: number) {
  grid.maybeResize(newRadius);
  redraw(newRadius);
}

function onToppleThresholdChange(newToppleThreshold: number) {
  grid.toppleThreshold = newToppleThreshold;
}

function onCellSizeChange(newCellSize: number) {
  const initialGridWidthInNumCells = 1 + 2 * radius.value;
  canvas.size = newCellSize * initialGridWidthInNumCells;
  grid.redraw();
}

function onCellColorChange() {
  cellColorRgb = hexToRgb(cellColor.value);
  redraw(radius.value);
}

function onCellBackgroundColorChange() {
  cellBackgroundColorRgb = hexToRgb(cellBackgroundColor.value);
  redraw(radius.value);
}
