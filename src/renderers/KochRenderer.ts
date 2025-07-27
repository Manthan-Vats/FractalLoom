import { FractalType, FractalParams } from '../types/fractal';
import { getColorScheme } from '../utils/colors';

interface Point {
  x: number;
  y: number;
}

export class KochRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('2D context not supported');
    }
    this.ctx = ctx;
  }

  render(fractalType: FractalType, params: FractalParams, time: number) {
    if (fractalType !== 'koch') return;

    this.ctx.fillStyle = params.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // color scheme
    const colors = getColorScheme(params.colorScheme);
    const primaryColor = colors[0];
    
    // drawing style
    this.ctx.strokeStyle = params.primaryColor;
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    //  initial triangle for snowflake
    const centerX = this.canvas.width / 2 + params.panX * 100;
    const centerY = this.canvas.height / 2 + params.panY * 100;
    const size = (params.baseSegmentLength || 200) * params.zoom;
    
    const height = size * Math.sqrt(3) / 2;
    
    const triangle: Point[] = [
      { x: centerX, y: centerY - height / 2 },
      { x: centerX - size / 2, y: centerY + height / 2 },
      { x: centerX + size / 2, y: centerY + height / 2 }
    ];

    // drawing each side of the triangle with Koch curve
    for (let i = 0; i < 3; i++) {
      const start = triangle[i];
      const end = triangle[(i + 1) % 3];
      
      const points = this.generateKochCurve(start, end, params.generations || 4, params.rotationAngle || 60);
      
      this.ctx.beginPath();
      this.ctx.moveTo(points[0].x, points[0].y);
      
      for (let j = 1; j < points.length; j++) {
        //  color if effects are enabled
        if (params.animationEffects) {
          const colorIndex = Math.floor((j + time * 50) % colors.length);
          const color = colors[colorIndex];
          this.ctx.strokeStyle = `rgb(${Math.floor(color[0] * 255)}, ${Math.floor(color[1] * 255)}, ${Math.floor(color[2] * 255)})`;
        }
        
        this.ctx.lineTo(points[j].x, points[j].y);
      }
      
      this.ctx.stroke();
    }

    if (params.gridDisplay) {
      this.drawGrid();
    }
  }

  private generateKochCurve(start: Point, end: Point, iterations: number, angle: number): Point[] {
    if (iterations === 0) {
      return [start, end];
    }

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    
    // Dividing the line into three equal parts
    const p1 = start;
    const p2 = { x: start.x + dx / 3, y: start.y + dy / 3 };
    const p4 = { x: start.x + 2 * dx / 3, y: start.y + 2 * dy / 3 };
    const p5 = end;
    
    // Calculating the peak of the triangle
    const midX = (p2.x + p4.x) / 2;
    const midY = (p2.y + p4.y) / 2;
    
    const length = Math.sqrt(dx * dx + dy * dy) / 3;
    const height = length * Math.sin(angle * Math.PI / 180);
    
    // Perpendicular vector
    const perpX = -dy / Math.sqrt(dx * dx + dy * dy);
    const perpY = dx / Math.sqrt(dx * dx + dy * dy);
    
    const p3 = {
      x: midX + perpX * height,
      y: midY + perpY * height
    };

    // Recursively generating Koch curves for each segment
    const segment1 = this.generateKochCurve(p1, p2, iterations - 1, angle);
    const segment2 = this.generateKochCurve(p2, p3, iterations - 1, angle);
    const segment3 = this.generateKochCurve(p3, p4, iterations - 1, angle);
    const segment4 = this.generateKochCurve(p4, p5, iterations - 1, angle);

    // Combining segments (remove duplicate points)
    return [
      ...segment1.slice(0, -1),
      ...segment2.slice(0, -1),
      ...segment3.slice(0, -1),
      ...segment4
    ];
  }

  private drawGrid() {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.lineWidth = 1;
    
    const gridSize = 50;
    
    // Vertical lines
    for (let x = 0; x < this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    
    // Horizontal lines
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