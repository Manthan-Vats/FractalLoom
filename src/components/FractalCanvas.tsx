import React, { useEffect, useRef, forwardRef } from 'react';
import { FractalType, FractalParams } from '../types/fractal';
import { WebGLRenderer } from '../renderers/WebGLRenderer';
import { CanvasRenderer } from '../renderers/CanvasRenderer';
import { BarnsleyRenderer } from '../renderers/BarnsleyRenderer';
import { KochRenderer } from '../renderers/KochRenderer';
import { CantorRenderer } from '../renderers/CantorRenderer';
import { VicsekRenderer } from '../renderers/VicsekRenderer';

interface FractalCanvasProps {
  fractalType: FractalType;
  params: FractalParams;
}

export const FractalCanvas = forwardRef<HTMLCanvasElement, FractalCanvasProps>(
  ({ fractalType, params }, ref) => {
    const webglCanvasRef = useRef<HTMLCanvasElement>(null);
    const canvas2dRef = useRef<HTMLCanvasElement>(null);
    const webglRenderer = useRef<WebGLRenderer | null>(null);
    const canvasRenderer = useRef<CanvasRenderer | null>(null);
    const barnsleyRenderer = useRef<BarnsleyRenderer | null>(null);
    const kochRenderer = useRef<KochRenderer | null>(null);
    const cantorRenderer = useRef<CantorRenderer | null>(null);
    const vicsekRenderer = useRef<VicsekRenderer | null>(null);
    const animationRef = useRef<number | null>(null);

    // determine which canvas to use based on fractal type
    const isWebGLFractal = fractalType === 'mandelbrot' || fractalType === 'julia';
    const currentCanvasRef = isWebGLFractal ? webglCanvasRef : canvas2dRef;

    // initialize renderers
    useEffect(() => {
      const canvas = currentCanvasRef.current;
      if (!canvas) return;

      // clean up existing renderers
      if (webglRenderer.current) {
        webglRenderer.current.destroy();
        webglRenderer.current = null;
      }
      if (canvasRenderer.current) {
        canvasRenderer.current.destroy();
        canvasRenderer.current = null;
      }
      if (barnsleyRenderer.current) {
        barnsleyRenderer.current.destroy();
        barnsleyRenderer.current = null;
      }
      if (kochRenderer.current) {
        kochRenderer.current.destroy();
        kochRenderer.current = null;
      }
      if (cantorRenderer.current) {
        cantorRenderer.current.destroy();
        cantorRenderer.current = null;
      }
      if (vicsekRenderer.current) {
        vicsekRenderer.current.destroy();
        vicsekRenderer.current = null;
      }

      try {
        // ensuring canvas has valid dimensions
        const container = canvas.parentElement;
        if (container) {
          const rect = container.getBoundingClientRect();
          canvas.width = rect.width || 800;
          canvas.height = rect.height || 600;
        } else {
          canvas.width = 800;
          canvas.height = 600;
        }

        // initialize=ing appropriate renderer
        if (isWebGLFractal) {
          webglRenderer.current = new WebGLRenderer(canvas);
        } else if (fractalType === 'lsystem') {
          canvasRenderer.current = new CanvasRenderer(canvas);
        } else if (fractalType === 'barnsley') {
          barnsleyRenderer.current = new BarnsleyRenderer(canvas);
        } else if (fractalType === 'koch') {
          kochRenderer.current = new KochRenderer(canvas);
        } else if (fractalType === 'cantor') {
          cantorRenderer.current = new CantorRenderer(canvas);
        } else if (fractalType === 'vicsek') {
          vicsekRenderer.current = new VicsekRenderer(canvas);
        }
      } catch (error) {
        console.error('Failed to initialize renderer:', error);
      }
    }, [fractalType, isWebGLFractal]);

    // handling resize
    useEffect(() => {
      const handleResize = () => {
        const canvas = currentCanvasRef.current;
        if (canvas) {
          const container = canvas.parentElement;
          if (container) {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            
            // Notify renderers about resize
            if (webglRenderer.current) {
              webglRenderer.current.handleResize();
            }
            if (canvasRenderer.current) {
              canvasRenderer.current.handleResize();
            }
            if (barnsleyRenderer.current) {
              barnsleyRenderer.current.handleResize();
            }
            if (kochRenderer.current) {
              kochRenderer.current.handleResize();
            }
            if (cantorRenderer.current) {
              cantorRenderer.current.handleResize();
            }
            if (vicsekRenderer.current) {
              vicsekRenderer.current.handleResize();
            }
          }
        }
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [currentCanvasRef]);

    // animation loop
    useEffect(() => {
      let startTime = Date.now();

      const animate = () => {
        const currentTime = Date.now();
        const elapsed = (currentTime - startTime) * 0.001;

        // Render with animation if enabled
        if (params.animationEffects) {
          if (webglRenderer.current && (fractalType === 'mandelbrot' || fractalType === 'julia')) {
            webglRenderer.current.render(fractalType, params, elapsed);
          } else if (canvasRenderer.current && fractalType === 'lsystem') {
            canvasRenderer.current.render(fractalType, params, elapsed);
          } else if (barnsleyRenderer.current && fractalType === 'barnsley') {
            barnsleyRenderer.current.render(fractalType, params, elapsed);
          } else if (kochRenderer.current && fractalType === 'koch') {
            kochRenderer.current.render(fractalType, params, elapsed);
          } else if (cantorRenderer.current && fractalType === 'cantor') {
            cantorRenderer.current.render(fractalType, params, elapsed);
          } else if (vicsekRenderer.current && fractalType === 'vicsek') {
            vicsekRenderer.current.render(fractalType, params, elapsed);
          }
        }

        if (params.animationEffects) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      if (params.animationEffects) {
        startTime = Date.now();
        animate();
      }

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [params.animationEffects, fractalType, params]);

    // render static frame when not animating or when parameters change
    useEffect(() => {
      if (webglRenderer.current && (fractalType === 'mandelbrot' || fractalType === 'julia')) {
        webglRenderer.current.render(fractalType, params, 0);
      } else if (canvasRenderer.current && fractalType === 'lsystem') {
        canvasRenderer.current.render(fractalType, params, 0);
      } else if (barnsleyRenderer.current && fractalType === 'barnsley') {
        barnsleyRenderer.current.render(fractalType, params, 0);
      } else if (kochRenderer.current && fractalType === 'koch') {
        kochRenderer.current.render(fractalType, params, 0);
      } else if (cantorRenderer.current && fractalType === 'cantor') {
        cantorRenderer.current.render(fractalType, params, 0);
      } else if (vicsekRenderer.current && fractalType === 'vicsek') {
        vicsekRenderer.current.render(fractalType, params, 0);
      }
    }, [fractalType, params]);

    // zoom and pan related mouse interaction
    useEffect(() => {
      const canvas = currentCanvasRef.current;
      if (!canvas) return;

      let isDragging = false;
      let lastMouseX = 0;
      let lastMouseY = 0;

      const handleMouseDown = (e: MouseEvent) => {
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        canvas.style.cursor = 'grabbing';
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;

        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        
        // have to connect and update this later on 
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      };

      const handleMouseUp = () => {
        isDragging = false;
        canvas.style.cursor = 'grab';
      };

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        // have to be connected to zoom parameter later on
      };

      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('mouseleave', handleMouseUp);
      canvas.addEventListener('wheel', handleWheel);
      canvas.style.cursor = 'grab';

      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mouseleave', handleMouseUp);
        canvas.removeEventListener('wheel', handleWheel);
      };
    }, [currentCanvasRef]);

    return (
      <div className="relative w-full h-full">
        <canvas
          ref={(el) => {
            webglCanvasRef.current = el;
            if (isWebGLFractal) {
              if (typeof ref === 'function') ref(el);
              else if (ref) ref.current = el;
            }
          }}
          className="w-full h-full bg-gray-900 absolute inset-0"
          style={{ display: isWebGLFractal ? 'block' : 'none' }}
        />
        <canvas
          ref={(el) => {
            canvas2dRef.current = el;
            if (!isWebGLFractal) {
              if (typeof ref === 'function') ref(el);
              else if (ref) ref.current = el;
            }
          }}
          className="w-full h-full bg-gray-900 absolute inset-0"
          style={{ display: !isWebGLFractal ? 'block' : 'none' }}
        />
      </div>
    );
  }
);