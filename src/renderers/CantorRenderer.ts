import { FractalType, FractalParams } from '../types/fractal';
import { getColorScheme } from '../utils/colors';

interface Segment {
  x: number;
  y: number;
  width: number;
  generation: number;
}

export class CantorRenderer {
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
    if (fractalType !== 'cantor') return;

    this.ctx.fillStyle = params.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    //color scheme
    const colors = getColorScheme(params.colorScheme);
    
    const generations = params.generations || 6;
    const spacingRatio = params.spacingRatio || 0.33;
    const lineThickness = params.lineThickness || 10;
    
    // initialial segment
    const initialWidth = this.canvas.width * 0.8 * params.zoom;
    const startX = (this.canvas.width - initialWidth) / 2 + params.panX * 100;
    const startY = 50;
    
    let segments: Segment[] = [{
      x: startX,
      y: startY,
      width: initialWidth,
      generation: 0
    }];

    // Generating all segments for all generations
    for (let gen = 0; gen < generations; gen++) {
      const newSegments: Segment[] = [];
      
      for (const segment of segments) {
        if (segment.generation === gen) {
          // Split the segment into two parts, removing the middle third
          const newWidth = segment.width * (1 - spacingRatio) / 2;
          const gap = segment.width * spacingRatio;
          
          // Left segment
          newSegments.push({
            x: segment.x,
            y: segment.y + (gen + 1) * (lineThickness + 20),
            width: newWidth,
            generation: gen + 1
          });
          
          // Right segment
          newSegments.push({
            x: segment.x + newWidth + gap,
            y: segment.y + (gen + 1) * (lineThickness + 20),
            width: newWidth,
            generation: gen + 1
          });
        }
      }
      
      segments = segments.concat(newSegments);
    }

    // all segments
    segments.forEach((segment, index) => {
      let colorIndex = segment.generation % colors.length;
      if (params.animationEffects) {
        colorIndex = Math.floor((segment.generation + time * 2) % colors.length);
      }
      
      const color = colors[colorIndex];
      this.ctx.fillStyle = `rgb(${Math.floor(color[0] * 255)}, ${Math.floor(color[1] * 255)}, ${Math.floor(color[2] * 255)})`;
      
      // drawing as rectangle
      this.ctx.fillRect(
        segment.x,
        segment.y,
        segment.width,
        lineThickness
      );
      
      // generational label
      if (params.gridDisplay) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(
          `Gen ${segment.generation}`,
          segment.x,
          segment.y - 5
        );
      }
    });

    if (params.gridDisplay) {
      this.drawGrid();
    }
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
    //was handled by the parent component
  }

  destroy() {
  }
}