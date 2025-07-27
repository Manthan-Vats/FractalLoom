export type FractalType = 'mandelbrot' | 'julia' | 'lsystem' | 'barnsley' | 'koch' | 'cantor' | 'vicsek';

export interface FractalParams {
  maxIterations: number;
  escapeRadius: number;

  cReal: number;
  cImag: number;
  zReal: number;
  zImag: number;
  
  power: number;

  zoom: number;
  panX: number;
  panY: number;

  colorScheme: string;
  colorIntensity: number;
  primaryColor: string;
  backgroundColor: string;
  gradientStops: string[];
  colorMode: 'RGB' | 'HSL';
  
  // L-system specific parameters
  axiom?: string;
  rules?: Record<string, string>;
  angle?: number;
  generations?: number;
  length?: number;
  
  // Barnsley Fern parameters
  transformProbabilities?: number[];
  iterationDepth?: number;
  
  // Koch Snowflake parameters
  baseSegmentLength?: number;
  rotationAngle?: number;
  
  // Cantor Set parameters
  spacingRatio?: number;
  lineThickness?: number;
  
  // Vicsek fractal parameters
  recursionLevel?: number;
  scaleFactor?: number;
  rotationOptions?: number;

  smoothColoring: boolean;
  juliaAnimation: boolean;
  animationEffects: boolean;
  renderQuality: 'low' | 'medium' | 'high';
  gridDisplay: boolean;
  
  branchingAngle: number;
  branches: number;
  lengthMultiplier: number;
  widthMultiplier: number;
}

export interface Preset {
  [key: string]: FractalParams;
}

export interface PresetCollection {
  [fractalType: string]: Preset;
}

export interface Transform {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  probability: number;
}