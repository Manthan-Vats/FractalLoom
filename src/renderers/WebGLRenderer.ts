import { FractalType, FractalParams } from '../types/fractal';
import { createShader, createProgram } from '../utils/webgl';
import { getColorScheme } from '../utils/colors';

export class WebGLRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram | null = null;
  private vertexBuffer: WebGLBuffer | null = null;
  private uniforms: { [key: string]: WebGLUniformLocation | null } = {};

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      throw new Error('WebGL2 not supported');
    }
    this.gl = gl;
    this.initialize();
  }

  private initialize() {
    const vertexShaderSource = `#version 300 es
      in vec2 a_position;
      out vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_position * 0.5 + 0.5;
      }
    `;

    const fragmentShaderSource = `#version 300 es
      precision highp float;
      
      in vec2 v_texCoord;
      out vec4 fragColor;
      
      uniform vec2 u_resolution;
      uniform vec2 u_c;
      uniform vec2 u_z;
      uniform float u_power;
      uniform int u_maxIterations;
      uniform float u_escapeRadius;
      uniform float u_zoom;
      uniform vec2 u_pan;
      uniform float u_time;
      uniform int u_fractalType;
      uniform vec3 u_colorScheme[8];
      uniform float u_colorIntensity;
      uniform bool u_smoothColoring;
      uniform bool u_juliaAnimation;
      
      vec2 complexMul(vec2 a, vec2 b) {
        return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
      }
      
      vec2 complexPow(vec2 z, float p) {
        float r = length(z);
        float theta = atan(z.y, z.x);
        float newR = pow(r, p);
        float newTheta = theta * p;
        return vec2(newR * cos(newTheta), newR * sin(newTheta));
      }
      
      vec3 getColor(float t, float intensity) {
        t = mod(t * intensity, 1.0);
        
        if (t < 0.125) return mix(u_colorScheme[0], u_colorScheme[1], t * 8.0);
        if (t < 0.25) return mix(u_colorScheme[1], u_colorScheme[2], (t - 0.125) * 8.0);
        if (t < 0.375) return mix(u_colorScheme[2], u_colorScheme[3], (t - 0.25) * 8.0);
        if (t < 0.5) return mix(u_colorScheme[3], u_colorScheme[4], (t - 0.375) * 8.0);
        if (t < 0.625) return mix(u_colorScheme[4], u_colorScheme[5], (t - 0.5) * 8.0);
        if (t < 0.75) return mix(u_colorScheme[5], u_colorScheme[6], (t - 0.625) * 8.0);
        if (t < 0.875) return mix(u_colorScheme[6], u_colorScheme[7], (t - 0.75) * 8.0);
        return mix(u_colorScheme[7], u_colorScheme[0], (t - 0.875) * 8.0);
      }
      
      void main() {
        vec2 coord = (v_texCoord - 0.5) * 4.0 / u_zoom + u_pan;
        coord.x *= u_resolution.x / u_resolution.y;
        
        vec2 z, c;
        
        if (u_fractalType == 0) { // Mandelbrot
          z = vec2(0.0);
          c = coord;
        } else { // Julia
          z = coord;
          c = u_c;
          if (u_juliaAnimation) {
            c.x += sin(u_time * 0.5) * 0.1;
            c.y += cos(u_time * 0.3) * 0.1;
          }
        }
        
        float iterations = 0.0;
        
        for (int i = 0; i < u_maxIterations; i++) {
          if (length(z) > u_escapeRadius) break;
          
          if (u_power == 2.0) {
            z = complexMul(z, z) + c;
          } else {
            z = complexPow(z, u_power) + c;
          }
          
          iterations += 1.0;
        }
        
        if (iterations >= float(u_maxIterations)) {
          fragColor = vec4(0.0, 0.0, 0.0, 1.0);
        } else {
          float t = iterations / float(u_maxIterations);
          
          if (u_smoothColoring) {
            float smoothed = iterations + 1.0 - log(log(length(z))) / log(2.0);
            t = smoothed / float(u_maxIterations);
          }
          
          vec3 color = getColor(t, u_colorIntensity);
          fragColor = vec4(color, 1.0);
        }
      }
    `;

    const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      throw new Error('Failed to create shaders');
    }

    this.program = createProgram(this.gl, vertexShader, fragmentShader);
    if (!this.program) {
      throw new Error('Failed to create program');
    }

    // Create vertex buffer
    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    
    const vertices = new Float32Array([
      -1, -1,
      1, -1,
      -1,  1,
      1,  1
    ]);
    
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    // Get uniform locations
    this.uniforms = {
      u_resolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
      u_c: this.gl.getUniformLocation(this.program, 'u_c'),
      u_z: this.gl.getUniformLocation(this.program, 'u_z'),
      u_power: this.gl.getUniformLocation(this.program, 'u_power'),
      u_maxIterations: this.gl.getUniformLocation(this.program, 'u_maxIterations'),
      u_escapeRadius: this.gl.getUniformLocation(this.program, 'u_escapeRadius'),
      u_zoom: this.gl.getUniformLocation(this.program, 'u_zoom'),
      u_pan: this.gl.getUniformLocation(this.program, 'u_pan'),
      u_time: this.gl.getUniformLocation(this.program, 'u_time'),
      u_fractalType: this.gl.getUniformLocation(this.program, 'u_fractalType'),
      u_colorScheme: this.gl.getUniformLocation(this.program, 'u_colorScheme'),
      u_colorIntensity: this.gl.getUniformLocation(this.program, 'u_colorIntensity'),
      u_smoothColoring: this.gl.getUniformLocation(this.program, 'u_smoothColoring'),
      u_juliaAnimation: this.gl.getUniformLocation(this.program, 'u_juliaAnimation')
    };

    // vertix attributes 
    const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
  }

  render(fractalType: FractalType, params: FractalParams, time: number) {
    if (!this.program) return;

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.useProgram(this.program);

    // uniforms
    this.gl.uniform2f(this.uniforms.u_resolution, this.canvas.width, this.canvas.height);
    this.gl.uniform2f(this.uniforms.u_c, params.cReal, params.cImag);
    this.gl.uniform2f(this.uniforms.u_z, params.zReal, params.zImag);
    this.gl.uniform1f(this.uniforms.u_power, params.power);
    this.gl.uniform1i(this.uniforms.u_maxIterations, params.maxIterations);
    this.gl.uniform1f(this.uniforms.u_escapeRadius, params.escapeRadius);
    this.gl.uniform1f(this.uniforms.u_zoom, params.zoom);
    this.gl.uniform2f(this.uniforms.u_pan, params.panX, params.panY);
    this.gl.uniform1f(this.uniforms.u_time, time);
    this.gl.uniform1i(this.uniforms.u_fractalType, fractalType === 'mandelbrot' ? 0 : 1);
    this.gl.uniform1f(this.uniforms.u_colorIntensity, params.colorIntensity);
    this.gl.uniform1i(this.uniforms.u_smoothColoring, params.smoothColoring ? 1 : 0);
    this.gl.uniform1i(this.uniforms.u_juliaAnimation, params.juliaAnimation ? 1 : 0);

    // color scheme
    const colors = getColorScheme(params.colorScheme);
    const colorArray = new Float32Array(colors.flat());
    this.gl.uniform3fv(this.uniforms.u_colorScheme, colorArray);
    
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  handleResize() {
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  destroy() {
    if (this.program) {
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
    if (this.vertexBuffer) {
      this.gl.deleteBuffer(this.vertexBuffer);
      this.vertexBuffer = null;
    }
  }
}