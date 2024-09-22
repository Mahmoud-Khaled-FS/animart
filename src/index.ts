import { geometricNetwork } from './art/geometric_network.js';
import { initCanvas } from './canvas.js';
import { windowErrorHandler } from './error.js';

function main() {
  window.onerror = windowErrorHandler;
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('Canvas element not found');
  }
  initCanvas(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Can not get 2d canvas context');
  }
  geometricNetwork(canvas, ctx);
}

main();
