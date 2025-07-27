import { FractalType, FractalParams } from '../types/fractal';
import { getColorScheme } from '../utils/colors';

interface Square {
  x: number;
  y: number;
  size: number;
  generation: number;
}

export class VicsekRenderer {
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
    if (fractalType !== 'vicsek') return;

    this.ctx.fillStyle = params.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // color scheme
    const colors = getColorScheme(params.colorScheme);
    
    const recursionLevel = params.recursionLevel || 5;
    const scaleFactor = params.scaleFactor || 0.33;
    const rotation = (params.rotationOptions || 0) * Math.PI / 180;
    
    // initialsquare
    const initialSize = Math.min(this.canvas.width, this.canvas.height) * 0.6 * params.zoom;
    const centerX = this.canvas.width / 2 + params.panX * 100;
    const centerY = this.canvas.height / 2 + params.panY * 100;
    
    let squares: Square[] = [{
      x: centerX - initialSize / 2,
      y: centerY - initialSize / 2,
      size: initialSize,
      generation: 0
    }];

    // all squares for all generations
    for (let gen = 0; gen < recursionLevel; gen++) {
      const newSquares: Square[] = [];
      
      for (const square of squares) {
        if (square.generation === gen) {
          const newSize = square.size * scaleFactor;
          const offset = square.size / 3;
          
          //  5 squares in a plus pattern (Vicsek fractal)
          const positions = [
            { x: square.x + offset, y: square.y + offset }, // center
            { x: square.x, y: square.y + offset }, // left
            { x: square.x + 2 * offset, y: square.y + offset }, // right
            { x: square.x + offset, y: square.y }, // top
            { x: square.x + offset, y: square.y + 2 * offset } // bottom
          ];
          
          positions.forEach((pos, index) => {
            let x = pos.x;
            let y = pos.y;
            
            // rotation if specified
            if (rotation !== 0) {
              const centerX = square.x + square.size / 2;
              const centerY = square.y + square.size / 2;
              const dx = x - centerX;
              const dy = y - centerY;
              
              x = centerX + dx * Math.cos(rotation) - dy * Math.sin(rotation);
              y = centerY + dx * Math.sin(rotation) + dy * Math.cos(rotation);
            }
            
            newSquares.push({
              x: x,
              y: y,
              size: newSize,
              generation: gen + 1
            });
          });
        }
      }
      
      squares = squares.concat(newSquares);
    }

    // drawing all squares
    squares.forEach((square, index) => {
      let colorIndex = square.generation % colors.length;
      if (params.animationEffects) {
        colorIndex = Math.floor((square.generation + time * 3 + index * 0.1) % colors.length);
      }
      
      const color = colors[colorIndex];
      this.ctx.fillStyle = `rgb(${Math.floor(color[0] * 255)}, ${Math.floor(color[1] * 255)}, ${Math.floor(color[2] * 255)})`;
      
      this.ctx.fillRect(
        square.x,
        square.y,
        square.size,
        square.size
      );
      
      // border for better visibility
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(
        square.x,
        square.y,
        square.size,
        square.size
      );
      
      // generation label
      if (params.gridDisplay && square.size > 20) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.font = '10px monospace';
        this.ctx.fillText(
          `${square.generation}`,
          square.x + 2,
          square.y + 12
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
    // was handled by the parent component
  }

  destroy() {
  
  }
}