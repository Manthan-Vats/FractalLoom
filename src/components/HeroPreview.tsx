import React, { useEffect, useRef, useState } from "react";

const VERTEX_SRC = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SRC = `
precision highp float;
varying vec2 v_uv;
uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_scale;
uniform int u_iterations;
uniform float u_time;
uniform float u_colorShift;

// palette from cosine waves
vec3 palette(float t) {
  float r = 0.5 + 0.5 * cos(6.2831853 * (t + 0.00 + u_colorShift));
  float g = 0.5 + 0.5 * cos(6.2831853 * (t + 0.33 + u_colorShift));
  float b = 0.5 + 0.5 * cos(6.2831853 * (t + 0.66 + u_colorShift));
  return vec3(r, g, b);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 c = vec2((uv.x - 0.5) * aspect, uv.y - 0.5) * u_scale + u_center;

  vec2 z = vec2(0.0, 0.0);
  float iter = 0.0;
  float maxIter = float(u_iterations);
  float escape = 4.0;

  for (int i = 0; i < 1000; ++i) {
    if (i >= u_iterations) break;
    // z = z^2 + c
    vec2 z2 = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
    z = z2;
    float mag2 = dot(z, z);
    if (mag2 > escape) {
      float mu = float(i) + 1.0 - log(log(sqrt(mag2))) / log(2.0);
      iter = mu;
      break;
    }
    if (i == u_iterations - 1) iter = maxIter;
  }

  float t = iter / maxIter;
  t = pow(t, 0.65);
  vec3 col = palette(t);
  if (t >= 0.999) col = vec3(0.02, 0.03, 0.04);

  // slight vignette
  float dx = (uv.x - 0.5);
  float dy = (uv.y - 0.5);
  float v = 1.0 - smoothstep(0.6, 0.95, sqrt(dx*dx + dy*dy));
  col *= 0.9 + 0.15 * v;

  gl_FragColor = vec4(col, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, source: string, type: number) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error("Shader compile error: " + info);
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string
) {
  const vs = createShader(gl, vsSource, gl.VERTEX_SHADER);
  const fs = createShader(gl, fsSource, gl.FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create program");
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error("Program link error: " + info);
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return program;
}

function clampDPR(dpr: number) {
  return Math.max(1, Math.min(1.5, dpr)); // cap at 1.5 for preview
}

type Props = {
  className?: string;
  minIter?: number; 
  defaultTarget?: number; // default target iterations for "Medium"
};

export default function HeroPreview({
  className = "",
  minIter = 20,
  defaultTarget = 120,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const [running, setRunning] = useState(true);
  const [targetIterations, setTargetIterations] =
    useState<number>(defaultTarget);
  const [currentIterations, setCurrentIterations] = useState<number>(minIter);
  const [isVisible, setIsVisible] = useState(true);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl", { antialias: true }) ??
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      console.warn("WebGL not supported in this browser.");
      return;
    }
    glRef.current = gl;

    let program: WebGLProgram;
    try {
      program = createProgram(gl, VERTEX_SRC, FRAGMENT_SRC);
    } catch (err) {
      console.error("Shader init failed:", err);
      return;
    }
    programRef.current = program;

    const posLoc = gl.getAttribLocation(program, "a_position");
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    gl.useProgram(program);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uCenter = gl.getUniformLocation(program, "u_center");
    const uScale = gl.getUniformLocation(program, "u_scale");
    const uIterations = gl.getUniformLocation(program, "u_iterations");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uColorShift = gl.getUniformLocation(program, "u_colorShift");

    let baseCenter = { x: -0.6, y: 0.0 };
    let baseScale = 3.0;
    let lastTime = performance.now();

    const resize = () => {
      const dpr = clampDPR(window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    resize();

    const ROClass = (window as any).ResizeObserver;
    let ro: any = null;
    if (typeof ROClass === "function") {
      try {
        ro = new ROClass(() => resize());
      } catch (e) {
        ro = null;
      }
    } else {
      window.addEventListener("resize", resize);
    }

    if (ro && typeof ro.observe === "function") ro.observe(canvas);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(canvas);

    function render(now: number) {
      if (!isVisible || !running) {
        rafRef.current = requestAnimationFrame(render);
        lastTime = now;
        return;
      }

      resize();

      const t = (now - (startRef.current || now)) / 1000.0;
      let centerX = baseCenter.x;
      let centerY = baseCenter.y;
      let scale = baseScale;

      if (!prefersReduced) {
        const panRadiusX = 0.006; // small pan radius
        const panRadiusY = 0.003;
        centerX += Math.cos(t * 0.12) * panRadiusX;
        centerY += Math.sin(t * 0.09) * panRadiusY;
        scale *= 0.98 + 0.02 * (0.5 + 0.5 * Math.sin(t * 0.06));
      }

      const current = currentIterations;
      let next = current;
      if (current < targetIterations) {
        next = Math.min(
          targetIterations,
          Math.round(current + Math.max(1, (targetIterations - current) * 0.22))
        );
      } else if (current > targetIterations) {
        next = targetIterations;
      }
      if (next !== current) {
        setCurrentIterations(next);
      }

      if (uTime) gl.uniform1f(uTime, t);
      if (uCenter) gl.uniform2f(uCenter, centerX, centerY);
      if (uScale) gl.uniform1f(uScale, scale);
      if (uIterations) gl.uniform1i(uIterations, next);
      if (uColorShift) gl.uniform1f(uColorShift, Math.sin(t * 0.07) * 0.2);

      gl.clearColor(0.02, 0.03, 0.05, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      rafRef.current = requestAnimationFrame(render);
      lastTime = now;
    }

    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (ro && typeof ro.disconnect === "function") ro.disconnect();
      if (typeof ROClass !== "function")
        window.removeEventListener("resize", resize);
      io.disconnect();
      try {
        if (programRef.current) gl.deleteProgram(programRef.current);
      } catch (e) {}
      glRef.current = null;
    };
  }, [running, targetIterations, isVisible]);

  useEffect(() => {
    setCurrentIterations((prev) => Math.min(prev, minIter));
  }, [targetIterations, minIter]);

  const toggleRunning = () => setRunning((r) => !r);

  const setPreset = (level: "low" | "med" | "high") => {
    if (level === "low") setTargetIterations(60);
    else if (level === "med") setTargetIterations(140);
    else setTargetIterations(300);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="rounded-lg overflow-hidden ring-1 ring-white/6 bg-[#071022]/50">
        <div style={{ aspectRatio: "16/10" }}>
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%", display: "block" }}
            aria-label="Fractal preview"
          />
        </div>

        {/* Overlay controls: bottom-left slider + bottom-right Play/Pause */}
        <div className="absolute left-3 bottom-3 right-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 bg-black/40 rounded-full px-3 py-2">
            <span className="text-xs text-white/80 mr-2">Detail</span>

            {/* Minimal 3-button preset UI to keep it clean */}
            <div className="flex items-center gap-2">
              <button
                aria-pressed={targetIterations === 60}
                onClick={() => setPreset("low")}
                className={`text-xs px-2 py-1 rounded-md ${
                  targetIterations === 60 ? "bg-white/10" : "bg-transparent"
                } text-white/90`}
              >
                Low
              </button>
              <button
                aria-pressed={targetIterations === 140}
                onClick={() => setPreset("med")}
                className={`text-xs px-2 py-1 rounded-md ${
                  targetIterations === 140 ? "bg-white/10" : "bg-transparent"
                } text-white/90`}
              >
                Medium
              </button>
              <button
                aria-pressed={targetIterations === 300}
                onClick={() => setPreset("high")}
                className={`text-xs px-2 py-1 rounded-md ${
                  targetIterations === 300 ? "bg-white/10" : "bg-transparent"
                } text-white/90`}
              >
                High
              </button>
            </div>

            <div className="text-xs text-white/60 ml-3">
              ({currentIterations} it)
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleRunning}
              aria-pressed={running}
              aria-label={running ? "Pause preview" : "Play preview"}
              className="rounded-full bg-white/8 px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
            >
              {running ? "Pause" : "Play"}
            </button>
          </div>
        </div>

        <div className="absolute top-3 right-3 bg-black/40 px-2 py-1 rounded-full text-xs text-white/80">
          live
        </div>
      </div>
    </div>
  );
}
