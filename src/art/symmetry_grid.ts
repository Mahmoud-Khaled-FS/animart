import { Drawable, Vector2 } from '../interface/shape.js';

let GRID_COLUMN = 30;
let GRID_ROW = 20;

export function symmetryGrid(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const c = new MouseCircle();
  c.update();

  const grid: Circle[][] = Array(GRID_COLUMN);
  const cellWidth = canvas.width / GRID_COLUMN;
  const cellHeight = canvas.height / GRID_ROW;
  for (let i = 0; i < GRID_COLUMN; i++) {
    const row: Circle[] = Array(GRID_ROW);
    for (let ii = 0; ii < GRID_ROW; ii++) {
      row[ii] = new Circle(i * cellWidth + cellWidth / 2, ii * cellHeight + cellHeight / 2);
      row[ii].mouseCircle = c;
    }
    grid[i] = row;
  }

  const frameFunc = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    c.draw(canvas, ctx);
    for (let col = 0; col < GRID_COLUMN; col++) {
      for (let row = 0; row < GRID_ROW; row++) {
        grid[col][row].update(canvas);
      }
    }
    for (let col = 0; col < GRID_COLUMN; col++) {
      for (let row = 0; row < GRID_ROW; row++) {
        grid[col][row].draw(canvas, ctx);
      }
    }
    requestAnimationFrame(frameFunc);
  };
  window.requestAnimationFrame(frameFunc);
}

class Circle implements Drawable {
  public color: string = '#FFBF00';
  public radius: number = 3;
  public originRadius: number = this.radius;
  public paddingY = 50;
  public paddingX = 50;
  public mouseCircle: MouseCircle | null = null;
  public originX = 0;
  public originY = 0;
  constructor(public x: number, public y: number) {
    this.originX = x;
    this.originY = y;
  }
  draw(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.originX, this.originY);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
  }

  isInsideMouseCircle(): boolean {
    return this.mouseDist() <= this.mouseCircle!.radius;
  }

  mouseDist(): number {
    return Math.sqrt(Math.abs(this.x - this.mouseCircle!.x) ** 2 + Math.abs(this.y - this.mouseCircle!.y) ** 2);
  }

  getMouseDirection(): Vector2 {
    return { x: this.x - this.mouseCircle!.x, y: this.y - this.mouseCircle!.y };
  }

  update(canvas: HTMLCanvasElement): void {
    if (this.isInsideMouseCircle()) {
      const newRadius = 20;
      this.radius = newRadius - (this.mouseDist() / this.mouseCircle!.radius) * newRadius;
      this.x = this.originX;
      this.y = this.originY;
    } else {
      this.radius = this.originRadius;
      const mPos = this.getMouseDirection();
      const cellWidth = canvas.width / GRID_COLUMN;
      const cellHeight = canvas.height / GRID_ROW;
      this.x = this.originX - ((mPos.x / canvas.width) * cellWidth) / 3;
      this.y = this.originY - ((mPos.y / canvas.height) * cellHeight) / 3;
    }
  }
}

class MouseCircle implements Drawable {
  public x: number = 0;
  public y: number = 0;
  public radius: number = 300;
  private isEventAdded = false;
  draw(_: HTMLCanvasElement, __: CanvasRenderingContext2D): void {}

  update(): void {
    if (!this.isEventAdded) {
      window.onmousemove = (e) => {
        this.x = e.clientX;
        this.y = e.clientY;
      };
      this.isEventAdded = true;
    }
  }
}
