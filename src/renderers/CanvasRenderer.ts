import { FractalType, FractalParams } from '../types/fractal';
import { LSystemGenerator } from '../utils/lsystem';
import { getColorScheme } from '../utils/colors';

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lsystem: LSystemGenerator;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('2D context not supported');
    }
    this.ctx = ctx;
    this.lsystem = new LSystemGenerator();
  }

  render(fractalType: FractalType, params: FractalParams, time: number) {
    if (fractalType !== 'lsystem') return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //color scheme
    const colors = getColorScheme(params.colorScheme);
    const primaryColor = `rgb(${colors[0].map(c => Math.floor(c * 255)).join(',')})`;
    const secondaryColor = `rgb(${colors[2].map(c => Math.floor(c * 255)).join(',')})`;

    //  L-system string
    const lsystemString = this.lsystem.generate(
      params.axiom || 'F',
      params.rules || { 'F': 'F+F-F-F+F' },
      params.generations || 4
    );

    // the L-system
    this.ctx.save();
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.scale(params.zoom, params.zoom);
    this.ctx.translate(params.panX, params.panY);

    this.drawLSystem(lsystemString, params, primaryColor, secondaryColor, time);

    this.ctx.restore();
  }

  private drawLSystem(
    lsystemString: string,
    params: FractalParams,
    primaryColor: string,
    secondaryColor: string,
    time: number
  ) {
    const stack: Array<{ x: number; y: number; angle: number; depth: number }> = [];
    let x = 0;
    let y = 0;
    let angle = -Math.PI / 2; // start :- point up
    let depth = 0;

    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    for (let i = 0; i < lsystemString.length; i++) {
      const char = lsystemString[i];
      
      switch (char) {
        case 'F':
        case 'f':
          const newX = x + Math.cos(angle) * (params.length || 10);
          const newY = y + Math.sin(angle) * (params.length || 10);
          
          if (char === 'F') {
            // color based on depth and time
            const colorMix = (depth * 0.1 + time * 0.5) % 1;
            const r = Math.floor(255 * (1 - colorMix));
            const g = Math.floor(255 * colorMix);
            const b = Math.floor(255 * Math.sin(time + depth * 0.3));
            
            this.ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(newX, newY);
            this.ctx.stroke();
          }
          
          x = newX;
          y = newY;
          break;
          
        case '+':
          angle += (params.branchingAngle || 20) * Math.PI / 180;
          break;
          
        case '-':
          angle -= (params.branchingAngle || 20) * Math.PI / 180;
          break;
          
        case '[':
          stack.push({ x, y, angle, depth });
          depth++;
          break;
          
        case ']':
          const state = stack.pop();
          if (state) {
            x = state.x;
            y = state.y;
            angle = state.angle;
            depth = state.depth;
          }
          break;
          
        case 'X':
        case 'Y':
          // non-drawing symbols, just leave
          break;
      }
    }
  }

  handleResize() {
    // was handled by the parent component
  }

  destroy() {
    
  }
}