import { FractalType, FractalParams, Transform } from '../types/fractal';
import { getColorScheme } from '../utils/colors';

export class BarnsleyRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private transforms: Transform[];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('2D context not supported');
    }
    this.ctx = ctx;
    
    // Barnsley Fern transforms
    this.transforms = [
      { a: 0, b: 0, c: 0, d: 0.16, e: 0, f: 0, probability: 0.01 },
      { a: 0.85, b: 0.04, c: -0.04, d: 0.85, e: 0, f: 1.6, probability: 0.85 },
      { a: 0.2, b: -0.26, c: 0.23, d: 0.22, e: 0, f: 1.6, probability: 0.07 },
      { a: -0.15, b: 0.28, c: 0.26, d: 0.24, e: 0, f: 0.44, probability: 0.07 }
    ];
  }

  render(fractalType: FractalType, params: FractalParams, time: number) {
    if (fractalType !== 'barnsley') return;

    this.ctx.fillStyle = params.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    //  color scheme
    const colors = getColorScheme(params.colorScheme);
    
    let x = 0;
    let y = 0;
    
    const iterations = params.iterationDepth || 50000;
    const scale = Math.min(this.canvas.width, this.canvas.height) * 0.1;
    const offsetX = this.canvas.width / 2;
    const offsetY = this.canvas.height - 50;

    // zoom and pan
    const zoomScale = scale * params.zoom;
    const panOffsetX = offsetX + params.panX * 100;
    const panOffsetY = offsetY + params.panY * 100;

    this.ctx.fillStyle = params.primaryColor;

    for (let i = 0; i < iterations; i++) {
      // choosing transform based on probability
      const rand = Math.random();
      let cumulativeProb = 0;
      let selectedTransform = this.transforms[0];

      for (const transform of this.transforms) {
        cumulativeProb += transform.probability;
        if (rand <= cumulativeProb) {
          selectedTransform = transform;
          break;
        }
      }

      // transformation
      const newX = selectedTransform.a * x + selectedTransform.b * y + selectedTransform.e;
      const newY = selectedTransform.c * x + selectedTransform.d * y + selectedTransform.f;
      
      x = newX;
      y = newY;

      //  screen coordinates
      const screenX = panOffsetX + x * zoomScale;
      const screenY = panOffsetY - y * zoomScale;

      // Skip first few iterations to let the system settle
      if (i > 10 && screenX >= 0 && screenX < this.canvas.width && screenY >= 0 && screenY < this.canvas.height) {
        if (params.animationEffects) {
          const colorIndex = Math.floor((i + time * 100) % colors.length);
          const color = colors[colorIndex];
          this.ctx.fillStyle = `rgb(${Math.floor(color[0] * 255)}, ${Math.floor(color[1] * 255)}, ${Math.floor(color[2] * 255)})`;
        }
        
        this.ctx.fillRect(Math.floor(screenX), Math.floor(screenY), 1, 1);
      }
    }

    if (params.gridDisplay) {
      this.drawGrid();
    }
  }

  private drawGrid() {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.lineWidth = 1;
    
    const gridSize = 50;
    
    for (let x = 0; x < this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    
    for (let y = 0; y < this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  handleResize() {
    // was handled by the parent component
  }

  destroy() {
  }
}