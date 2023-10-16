import Config from './config';
import './style.css';

const searchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(searchParams);
const config = new Config(params);

const canvas = document.querySelector<HTMLCanvasElement>('#canvas');

if (!canvas) {
  throw new Error('Canvas not defined');
}

canvas.width = config.canvasWidth;
canvas.height = config.canvasHeight;
