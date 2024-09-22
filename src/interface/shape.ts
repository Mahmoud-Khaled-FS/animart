export interface Drawable {
  update(canvas: HTMLCanvasElement, dt: number): void;
  draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void;
}

export type Vector2 = {
  x: number;
  y: number;
};
