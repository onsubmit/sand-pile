import Canvas, { CanvasCoordinates } from './canvas';
import { blend, hexToRgb } from './color';
import { InputNumberTypeObserver, InputTextTypeObserver } from './elementObserver';
import {
  download,
  exampleCheckerboard,
  exampleCircle,
  exampleFill,
  exampleRandom,
  start,
  stepAll,
  stepOnce,
  stop,
} from './elements';
import { drawCheckerboard, drawCircle, drawRandomly, fill } from './examples';
import Grid, { GridCoordinates } from './grid';
import './style.css';

const radius = new InputNumberTypeObserver('#radius', onRadiusChange).listen();
const toppleThreshold = new InputNumberTypeObserver('#toppleThreshold', onToppleThresholdChange).listen();
const maxCellGrains = new InputNumberTypeObserver('#maxCellGrains').listen();
const cellSize = new InputNumberTypeObserver('#cellSize', onCellSizeChange).listen();
const cellColor = new InputTextTypeObserver('#cellColor', onCellColorChange).listen();
const cellBackgroundColor = new InputTextTypeObserver('#cellBackgroundColor', onCellBackgroundColorChange).listen();

const lastDrawnCell: { x: number | undefined; y: number | undefined } = { x: undefined, y: undefined };
const mouseState = {
  isMouseDown: false,
  isMiddleClick: false,
  isRightClick: false,
};

let startAnimation = false;
let numIterations = 0;
let cellColorRgb = hexToRgb(cellColor.value);
let cellBackgroundColorRgb = hexToRgb(cellBackgroundColor.value);

const grid = new Grid(radius.value, toppleThreshold.value, drawAtCoordinate, redraw);
const canvas = getCanvas();

setupControlEvents();
setupExampleEvents();

function setupControlEvents() {
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
}

function setupExampleEvents() {
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
}

function drawAtCoordinate(row: number, column: number, value: number) {
  const newCellColor = blend(
    cellBackgroundColorRgb,
    cellColorRgb,
    Math.min(value, toppleThreshold.value) / toppleThreshold.value
  );

  canvas.context.fillStyle = newCellColor;

  const { x, y } = mapGridCoordinatesToCanvasCoordinates({ row, column });
  canvas.context.fillRect(x, y, cellSize.value, cellSize.value);
}

function redraw(newRadius: number) {
  canvas.size = cellSize.value * (1 + 2 * newRadius);
  canvas.context.clearRect(0, 0, canvas.size, canvas.size);

  radius.value = newRadius;

  for (let r = -newRadius; r <= newRadius; r++) {
    for (let c = -newRadius; c <= newRadius; c++) {
      drawAtCoordinate(r, c, grid.getValueOrThrow(r, c));
    }
  }
}

function mapCanvasCoordinatesToGridCoordinates(canvasCoordinates: CanvasCoordinates): GridCoordinates {
  const row = -grid.radius + canvasCoordinates.y / cellSize.value;
  const column = -grid.radius + canvasCoordinates.x / cellSize.value;

  return { row, column };
}

function mapGridCoordinatesToCanvasCoordinates(gridCoordinates: GridCoordinates): CanvasCoordinates {
  const x = (grid.radius + gridCoordinates.column) * cellSize.value;
  const y = (grid.radius + gridCoordinates.row) * cellSize.value;

  return { x, y };
}

function drawAtMouse(input: { canvasCoordinates: CanvasCoordinates; increment: boolean; force: boolean }) {
  const { canvasCoordinates, increment, force } = input;
  let { x, y } = canvasCoordinates;

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

  const { row, column } = mapCanvasCoordinatesToGridCoordinates({ x, y });

  if (increment && grid.getValueOrThrow(row, column) >= maxCellGrains.value) {
    return;
  }

  if (increment) {
    grid.incrementOrThrow(row, column);
  } else {
    grid.decrementOrThrow(row, column);
  }
}

function clear(canvasCoordinates: CanvasCoordinates) {
  let { x, y } = canvasCoordinates;

  if (cellSize.value > 1) {
    x = Math.floor(x / cellSize.value) * cellSize.value;
  }

  if (cellSize.value > 1) {
    y = Math.floor(y / cellSize.value) * cellSize.value;
  }

  const { row, column } = mapCanvasCoordinatesToGridCoordinates({ x, y });

  grid.reset(row, column);
  canvas.context.fillStyle = cellBackgroundColor.value;
  canvas.context.fillRect(x, y, cellSize.value, cellSize.value);
}

function loop() {
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
}

function requestLoop() {
  window.requestAnimationFrame(loop);
}

function onRadiusChange(newRadius: number) {
  grid.maybeResize(newRadius);
  redraw(newRadius);
}

function onToppleThresholdChange(newToppleThreshold: number) {
  grid.toppleThreshold = newToppleThreshold;
}

function onCellSizeChange(newCellSize: number) {
  canvas.size = newCellSize * getGridSizeInNumCells();
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

function getGridSizeInNumCells(): number {
  return 1 + 2 * radius.value;
}

function getCanvas() {
  const canvas = new Canvas('#canvas');
  canvas.size = cellSize.value * getGridSizeInNumCells();
  canvas.context.fillStyle = cellColor.value;

  canvas.element.addEventListener('mousedown', (e: MouseEvent) => {
    mouseState.isMouseDown = true;
    mouseState.isMiddleClick = e.button === 1;
    mouseState.isRightClick = e.button === 2;

    const { offsetX: x, offsetY: y } = e;
    if (mouseState.isRightClick) {
      clear({ x, y });
    } else {
      drawAtMouse({ canvasCoordinates: { x, y }, increment: !mouseState.isMiddleClick, force: true });
    }
  });

  canvas.element.onmouseup = () => {
    mouseState.isMouseDown = false;
  };

  canvas.element.onmousemove = (e: MouseEvent) => {
    if (mouseState.isMouseDown) {
      const { offsetX: x, offsetY: y } = e;

      if (mouseState.isRightClick) {
        clear({ x, y });
      } else {
        drawAtMouse({ canvasCoordinates: { x, y }, increment: !mouseState.isMiddleClick, force: false });
      }
    }
  };

  canvas.element.oncontextmenu = () => false;

  return canvas;
}
