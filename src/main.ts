import './style.css';

import Canvas, { CartesianCoordinate } from './canvas';
import CanvasGrid, { GridCoordinates } from './canvasGrid';
import { blend, hexToRgb } from './color';
import { InputNumberTypeObserver, InputTextTypeObserver } from './elementObserver';
import {
  download,
  exampleCheckerboard,
  exampleCircle,
  exampleFill,
  exampleMandelbrot,
  examplePolygon,
  exampleRandom,
  start,
  stepAll,
  stepOnce,
  stop,
} from './elements';
import { drawCheckerboard, drawCircle, drawMandelbrot, drawPolygon, drawRandomly, fill } from './examples';

const radius = new InputNumberTypeObserver('#radius', onRadiusChange);
const toppleThreshold = new InputNumberTypeObserver('#toppleThreshold', onToppleThresholdChange);
const maxCellGrains = new InputNumberTypeObserver('#maxCellGrains', onMaxCellGrainsChange);
const cellSize = new InputNumberTypeObserver('#cellSize', onCellSizeChange);
const cellColor = new InputTextTypeObserver('#cellColor', onCellColorChange);
const cellBackgroundColor = new InputTextTypeObserver('#cellBackgroundColor', onCellBackgroundColorChange);
const penSize = new InputNumberTypeObserver('#penSize');
const penWeight = new InputNumberTypeObserver('#penWeight');
const examplePolygonSides = new InputNumberTypeObserver('#examplePolygonSides');

const lastDrawnCell: Partial<CartesianCoordinate> = {};
const mouseState = {
  isMouseDown: false,
  isMiddleClick: false,
  isRightClick: false,
};

let startAnimation = false;
let numIterations = 0;
let cellColorRgb = hexToRgb(cellColor.value);
let cellBackgroundColorRgb = hexToRgb(cellBackgroundColor.value);

const grid = new CanvasGrid({
  radius: radius.value,
  toppleThreshold: toppleThreshold.value,
  drawCallback: drawAtCoordinate,
  resizeCallback: redraw,
});
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
    grid.toppleOnce();
  };

  stepAll.onclick = () => {
    grid.toppleOnceOverGrid();
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

  exampleMandelbrot.onclick = () => {
    grid.drawExample(drawMandelbrot(maxCellGrains.value));
  };

  examplePolygon.onclick = () => {
    grid.drawExample(drawPolygon(examplePolygonSides.value, maxCellGrains.value));
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

function mapCanvasCoordinatesToGridCoordinates(canvasCoordinates: CartesianCoordinate): GridCoordinates {
  const row = -grid.radius + canvasCoordinates.y / cellSize.value;
  const column = -grid.radius + canvasCoordinates.x / cellSize.value;

  return { row, column };
}

function mapGridCoordinatesToCanvasCoordinates(gridCoordinates: GridCoordinates): CartesianCoordinate {
  const x = (grid.radius + gridCoordinates.column) * cellSize.value;
  const y = (grid.radius + gridCoordinates.row) * cellSize.value;

  return { x, y };
}

function constrainCanvasCoordinates(canvasCoordinates: CartesianCoordinate): CartesianCoordinate {
  let { x, y } = canvasCoordinates;

  x = Math.max(x, 0);
  y = Math.max(y, 0);

  x = Math.min(x, canvas.size - 1);
  y = Math.min(y, canvas.size - 1);

  x = Math.floor(x / cellSize.value) * cellSize.value;
  y = Math.floor(y / cellSize.value) * cellSize.value;

  return { x, y };
}

function getRangesForPenSize(gridCoordinates: GridCoordinates): { min: GridCoordinates; max: GridCoordinates } {
  const { row, column } = gridCoordinates;
  const penAdjustFloor = Math.floor((penSize.value - 1) / 2);
  const penAdjustCeil = Math.ceil((penSize.value - 1) / 2);
  const minRow = Math.max(-grid.radius, row - penAdjustFloor);
  const minColumn = Math.max(-grid.radius, column - penAdjustFloor);
  const maxRow = Math.min(row + penAdjustCeil, grid.radius);
  const maxColumn = Math.min(column + penAdjustCeil, grid.radius);

  return {
    min: { row: minRow, column: minColumn },
    max: { row: maxRow, column: maxColumn },
  };
}

function drawAtMouse(input: { canvasCoordinates: CartesianCoordinate; increment: boolean; force: boolean }) {
  const { canvasCoordinates, increment, force } = input;
  const { x, y } = constrainCanvasCoordinates(canvasCoordinates);

  if (!force && x === lastDrawnCell.x && y === lastDrawnCell.y) {
    return;
  }

  lastDrawnCell.x = x;
  lastDrawnCell.y = y;

  const { row, column } = mapCanvasCoordinatesToGridCoordinates({ x, y });
  const { min, max } = getRangesForPenSize({ row, column });

  for (let r = min.row; r <= max.row; r++) {
    for (let c = min.column; c <= max.column; c++) {
      if (increment) {
        const value = grid.getValueOrThrow(r, c);
        const amount = value + penWeight.value > maxCellGrains.value ? maxCellGrains.value - value : penWeight.value;

        if (amount === 0) {
          continue;
        }

        grid.incrementOrThrow(r, c, amount);
      } else {
        grid.decrementOrThrow(r, c, penWeight.value);
      }
    }
  }
}

function clearAtMouse(canvasCoordinates: CartesianCoordinate) {
  const { x, y } = constrainCanvasCoordinates(canvasCoordinates);
  const { row, column } = mapCanvasCoordinatesToGridCoordinates({ x, y });
  const { min, max } = getRangesForPenSize({ row, column });

  for (let r = min.row; r <= max.row; r++) {
    for (let c = min.column; c <= max.column; c++) {
      grid.reset(r, c);
    }
  }
}

function loop() {
  if (!startAnimation) {
    return;
  }

  ++numIterations;

  const { didTopple } = grid.toppleOnceOverGrid();
  if (!didTopple) {
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

function onMaxCellGrainsChange(newMaxCellGrains: number) {
  penWeight.max = newMaxCellGrains;
  if (penWeight.value > newMaxCellGrains) {
    penWeight.value = newMaxCellGrains;
  }
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
  const canvas = new Canvas('#canvas', cellSize.value * getGridSizeInNumCells());
  canvas.context.fillStyle = cellColor.value;

  canvas.element.addEventListener('mousedown', (e: MouseEvent) => {
    mouseState.isMouseDown = true;
    mouseState.isMiddleClick = e.button === 1;
    mouseState.isRightClick = e.button === 2;

    const { offsetX: x, offsetY: y } = e;
    if (mouseState.isRightClick) {
      clearAtMouse({ x, y });
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
        clearAtMouse({ x, y });
      } else {
        drawAtMouse({ canvasCoordinates: { x, y }, increment: !mouseState.isMiddleClick, force: false });
      }
    }
  };

  canvas.element.oncontextmenu = () => false;

  return canvas;
}
