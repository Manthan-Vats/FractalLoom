import React, { useEffect, useRef, forwardRef, useCallback } from 'react';
import { GeneratorParams } from '../types/generator';

interface GeneratorCanvasProps {
  params: GeneratorParams;
}

interface Point {
  x: number;
  y: number;
}

interface Segment {
  start: Point;
  end: Point;
  width: number;
  generation: number;
}

export const GeneratorCanvas = forwardRef<HTMLCanvasElement, GeneratorCanvasProps>(
  ({ params }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);

    // combining
    const setCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
      canvasRef.current = canvas;
      if (typeof ref === 'function') {
        ref(canvas);
      } else if (ref) {
        ref.current = canvas;
      }
    }, [ref]);

    // recursively  gnerating fractal segments 
    const generateSegments = useCallback((
      start: Point,
      angle: number,
      length: number,
      width: number,
      generation: number,
      maxGenerations: number,
      branches: number,
      angle1: number,
      angle2: number,
      lengthMult: number,
      widthMult: number
    ): Segment[] => {
      if (generation >= maxGenerations || length < 0.01) {
        return [];
      }

      const segments: Segment[] = [];
      
      // First have to apply angle2 twist to parent direction
      const twistedAngle = angle + (angle2 * Math.PI / 180);
      
      // branches generation logic
      for (let i = 0; i < branches; i++) {
        let branchAngle;
        
        if (i === 0) {
          // using first branch is the anchor
          branchAngle = twistedAngle;
        } else {
          // alternating pattern: +angle1, -angle1, +2×angle1, -2×angle1, ...
          const multiplier = Math.ceil(i / 2);
          const sign = (i % 2 === 1) ? 1 : -1;
          const angle1Radians = (angle1 * Math.PI / 180);
          branchAngle = twistedAngle + (sign * multiplier * angle1Radians);
        }
        
        // calculating end point for this branch
        const end: Point = {
          x: start.x + Math.cos(branchAngle) * length,
          y: start.y + Math.sin(branchAngle) * length
        };

        // added current segment
        segments.push({
          start,
          end,
          width: Math.max(0.1, width),
          generation
        });

        // geenerate children only if not on final generation
        if (generation < maxGenerations - 1) {
          const newLength = length * lengthMult;
          const newWidth = Math.max(0.1, width * widthMult);
          
          // recursively generate child segments
          const childSegments = generateSegments(
            end,
            branchAngle,
            newLength,
            newWidth,
            generation + 1,
            maxGenerations,
            branches,
            angle1,
            angle2,
            lengthMult,
            widthMult
          );
          
          segments.push(...childSegments);
        }
      }

      return segments;
    }, []);

    // calculating bounding box of all segments
    const calculateBoundingBox = useCallback((segments: Segment[]) => {
      if (segments.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
      
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      
      segments.forEach(segment => {
        minX = Math.min(minX, segment.start.x, segment.end.x);
        minY = Math.min(minY, segment.start.y, segment.end.y);
        maxX = Math.max(maxX, segment.start.x, segment.end.x);
        maxY = Math.max(maxY, segment.start.y, segment.end.y);
      });
      
      return { minX, minY, maxX, maxY };
    }, []);

    // color schema for generation
    const getGenerationColor = useCallback((generation: number): string => {
      // Visnos warm-to-cool color sequence
      const colors = [
        '#FFFF00', // Gen 0: Yellow (root)
        '#FF0000', // Gen 1: Red
        '#00FF00', // Gen 2: Green
        '#0000FF', // Gen 3: Blue
        '#FF00FF', // Gen 4: Magenta
        '#00FFFF', // Gen 5: Cyan
        '#FFA500', // Gen 6: Orange
        '#800080', // Gen 7: Purple
        '#FFB366', // Gen 8: Light Orange
        '#FF6666', // Gen 9: Light Red
        '#B366FF', // Gen 10: Light Purple
        '#66B3FF'  // Gen 11: Light Blue
      ];
      
      return colors[generation % colors.length];
    }, []);

    // drawing the fractal
    const drawFractal = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // canvas clear
      ctx.fillStyle = '#1a2238';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // drawing style
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // center point
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // all segments at natural scale
      const segments = generateSegments(
        { x: 0, y: 0 }, // Start at origin
        -Math.PI / 2, // Start pointing up
        params.startLength,
        params.startWidth,
        0,
        params.iterations,
        params.branches,
        params.angle1,
        params.angle2,
        params.lengthMultiplier,
        params.widthMultiplier
      );

      if (segments.length === 0) return;

      const bbox = calculateBoundingBox(segments);
      const fractalWidth = bbox.maxX - bbox.minX;
      const fractalHeight = bbox.maxY - bbox.minY;
      
      // scale to fit canvas with padding
      const padding = 50;
      const availableWidth = canvas.width - 2 * padding;
      const availableHeight = canvas.height - 2 * padding;
      // const scale = Math.min(
      //   availableWidth / Math.max(fractalWidth, 1),
      //   availableHeight / Math.max(fractalHeight, 1)
      // ) * 0.8; // 80% of available space

      // base scale that respects Start Length 
const baseScale = 17; // change it to control overall size
const startLengthFactor = params.startLength / 1.0; 
const scale = baseScale * startLengthFactor;
      
      // offset to center the fractal
      const offsetX = centerX - (bbox.minX + fractalWidth / 2) * scale;
      const offsetY = centerY - (bbox.minY + fractalHeight / 2) * scale;

      // segments with scaling and centering
      segments.forEach(segment => {
        ctx.strokeStyle = getGenerationColor(segment.generation);
        ctx.lineWidth = Math.max(0.5, segment.width*12);
        
        ctx.beginPath();
        ctx.moveTo(
          segment.start.x * scale + offsetX,
          segment.start.y * scale + offsetY
        );
        ctx.lineTo(
          segment.end.x * scale + offsetX,
          segment.end.y * scale + offsetY
        );
        ctx.stroke();
      });
    }, [params, generateSegments, calculateBoundingBox, getGenerationColor]);

    // canvas resize
    const handleResize = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const container = canvas.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        drawFractal();
      }
    }, [drawFractal]);

    // initializing canvas and setting up resize listener
    useEffect(() => {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    // redraw when parameters change
    useEffect(() => {
    
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

   
      animationRef.current = requestAnimationFrame(() => {
        drawFractal();
      });

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [params, drawFractal]);

    return (
      <canvas
        ref={setCanvasRef}
        className="w-full h-full bg-[#1a2238]"
        style={{ display: 'block' }}
      />
    );
  }
);