import { randomElement, randomNumber } from '../utils/random.js';
import { Drawable, Vector2 } from '../interface/shape.js';

const NumberOfCircles = 100;
const MinDistRelation = 200;
export function geometricNetwork(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  let frames_per_second = 60;
  let interval = Math.floor(1000 / frames_per_second);
  let currentTime = 0;
  let deltaTime = 0;
  let previousTime = 0;

  const c = new MouseCircle();
  const circles: Circle[] = new Array(NumberOfCircles);
  for (let i = 0; i < circles.length; i++) {
    const x = randomNumber(0, canvas.width);
    const y = randomNumber(0, canvas.height);
    circles[i] = new Circle(x, y, randomElement(1, -1), randomElement(1, -1));
    circles[i].mouseCircle = c;
  }
  c.update();
  const frameFunc = (timestamp: number) => {
    currentTime = timestamp;
    deltaTime = currentTime - previousTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const lines: Line[] = [];
    if (deltaTime > interval) {
      for (let i = 0; i < circles.length; i++) {
        circles[i].update(canvas);
        for (let ii = i + 1; ii < circles.length; ii++) {
          const d = Math.sqrt(
            Math.abs(circles[i].x - circles[ii].x) ** 2 + Math.abs(circles[i].y - circles[ii].y) ** 2,
          );
          // console.log();
          if (d <= MinDistRelation) {
            lines.push(new Line({ x: circles[i].x, y: circles[i].y }, { x: circles[ii].x, y: circles[ii].y }, d));
          }
        }
      }
      for (const line of lines) {
        line.draw(canvas, ctx);
      }
      for (let i = 0; i < circles.length; i++) {
        circles[i].draw(canvas, ctx);
      }
    }
    c.draw(canvas, ctx);
    requestAnimationFrame(frameFunc);
  };
  window.requestAnimationFrame(frameFunc);
}

class Line implements Drawable {
  public color: string = '#FFFFFF';
  constructor(public start: Vector2, public end: Vector2, public dist: number) {}
  draw(_: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    // console.log(this.start, this.end);
    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.strokeStyle =
      this.color +
      Math.ceil((1 - this.dist / MinDistRelation) * 255)
        .toString(16)
        .padStart(2, '0');
    // ctx.strokeStyle = this.color;
    ctx.lineWidth = Math.ceil((1 - this.dist / MinDistRelation) * 2);
    ctx.stroke();
  }

  update(): void {}
}

class Circle implements Drawable {
  public color: string = '#FFFFFF';
  public radius: number = 3;
  public originRadius: number = this.radius;
  public paddingY = 50;
  public paddingX = 50;
  public transparent = randomNumber(0, 0xff);
  public transparentDir = 2;
  public mouseCircle: MouseCircle | null = null;
  constructor(public x: number, public y: number, public dx: number, public dy: number) {}
  draw(_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.fillStyle = this.color + this.transparent.toString(16).padStart(2, '0');
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  isInsideMouseCircle(): boolean {
    const d = Math.sqrt(Math.abs(this.x - this.mouseCircle!.x) ** 2 + Math.abs(this.y - this.mouseCircle!.y) ** 2);
    return d <= this.mouseCircle!.radius;
  }

  update(canvas: HTMLCanvasElement): void {
    if (this.isInsideMouseCircle()) {
      this.radius = 10;
      this.color = '#FFBF00';
    } else {
      this.radius = this.originRadius;
      this.color = '#FFFFFF';
    }
    if (this.y + this.radius + this.paddingY < 0 || this.y - this.radius - this.paddingY > canvas.height) {
      this.dy *= -1;
    }
    if (this.x + this.radius + this.paddingX < 0 || this.x - this.radius - this.paddingX > canvas.width) {
      this.dx *= -1;
    }
    this.y += this.dy;
    this.x += this.dx;
    if (this.transparent + this.transparentDir >= 0xff || this.transparent + this.transparentDir < 0) {
      this.transparentDir *= -1;
    }
    this.transparent += this.transparentDir;
  }
}

class MouseCircle implements Drawable {
  public x: number = 0;
  public y: number = 0;
  public radius: number = 100;
  private isEventAdded = false;
  draw(_: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#8B8000';
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
  }

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
