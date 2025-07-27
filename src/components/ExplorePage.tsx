import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Download, Zap } from 'lucide-react';
import { FractalCanvas } from './FractalCanvas';
import { ControlPanel } from './ControlPanel';
import { FractalType, FractalParams } from '../types/fractal';
import { presets } from '../data/presets';

export const ExplorePage: React.FC = () => {
  const [fractalType, setFractalType] = useState<FractalType>('mandelbrot');
  const [params, setParams] = useState<FractalParams>(presets.mandelbrot.classic);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // handling parameter changes with smooth interpolation
  const handleParamChange = (key: string, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // handling fractal type change
  const handleFractalTypeChange = (type: FractalType) => {
    setFractalType(type);
    // load the default preset for the new fractal type
    const defaultPreset = presets[type]?.classic || presets[type]?.[Object.keys(presets[type])[0]] || presets.mandelbrot.classic;
    setParams(defaultPreset);
  };

  // preset selection handling
  const handlePresetChange = (presetKey: string) => {
    const preset = presets[fractalType]?.[presetKey] || presets.mandelbrot.classic;
    setParams(preset);
  };

  // reset to default parameters
  const handleReset = () => {
    const defaultPreset = presets[fractalType]?.classic || presets[fractalType]?.[Object.keys(presets[fractalType])[0]] || presets.mandelbrot.classic;
    setParams(defaultPreset);
  };

  // option export fractal as image
  const handleExport = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `fractal-${fractalType}-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#1a2238] via-[#1a2238] to-[#1a2238] flex flex-col">
      {/* Header */}
      <header className="relative z-10 bg-[#1a2238]/90 backdrop-blur-md border-b border-[#9daaf2]/20 flex-shrink-0">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 px-3 py-1.5 bg-[#9daaf2]/20 hover:bg-[#9daaf2]/30 text-[#f4db7d] rounded-lg transition-all duration-200 backdrop-blur-sm border border-[#9daaf2]/30"
              >
                <ArrowLeft size={18} />
                <span className="text-sm">Home</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#9daaf2] to-[#f4db7d] bg-clip-text text-transparent">
                  Explore Fractals
                </h1>
                <p className="text-[#9daaf2]/70 text-xs">
                  Discover the infinite beauty of mathematical fractals
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-3 py-1.5 bg-[#9daaf2]/20 hover:bg-[#9daaf2]/30 text-[#f4db7d] rounded-lg transition-all duration-200 backdrop-blur-sm border border-[#9daaf2]/30"
              >
                <RotateCcw size={18} />
                <span className="text-sm">Reset</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-3 py-1.5 bg-[#f4db7d]/90 hover:bg-[#f4db7d] text-[#1a2238] rounded-lg transition-all duration-200 backdrop-blur-sm border border-[#f4db7d]/50 font-medium"
              >
                <Download size={18} />
                <span className="text-sm">Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Control Panel */}
        <div className="lg:w-80 bg-[#1a2238]/80 backdrop-blur-md border-r border-[#9daaf2]/20 flex-shrink-0">
          <div className="h-full overflow-y-auto p-6">
            <ControlPanel
              fractalType={fractalType}
              params={params}
              onFractalTypeChange={handleFractalTypeChange}
              onParamChange={handleParamChange}
              onPresetChange={handlePresetChange}
            />
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          <FractalCanvas
            ref={canvasRef}
            fractalType={fractalType}
            params={params}
          />
          
          {/* Status Bar */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
            <div className="bg-[#1a2238]/60 backdrop-blur-sm text-[#f4db7d] px-4 py-2 rounded-lg border border-[#9daaf2]/30">
              <p className="text-sm">
                <strong>Type:</strong> {fractalType.charAt(0).toUpperCase() + fractalType.slice(1)}
                {params.animationEffects && (
                  <span className="ml-2 inline-flex items-center">
                    <Zap size={14} className="mr-1" />
                    Animated
                  </span>
                )}
              </p>
            </div>
            
            <div className="bg-[#1a2238]/60 backdrop-blur-sm text-[#f4db7d] px-4 py-2 rounded-lg border border-[#9daaf2]/30">
              <p className="text-sm">
                <strong>Quality:</strong> {params.renderQuality.charAt(0).toUpperCase() + params.renderQuality.slice(1)}
                <span className="ml-2">
                  <strong>Zoom:</strong> {params.zoom.toFixed(1)}x
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};