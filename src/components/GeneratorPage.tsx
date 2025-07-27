import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Shuffle, Save, Sliders } from 'lucide-react';
import { GeneratorParams, defaultGeneratorParams, generatorPresets } from '../types/generator';
import { GeneratorCanvas } from './GeneratorCanvas';
import { GeneratorControls } from './GeneratorControls';

export const GeneratorPage: React.FC = () => {
  const [params, setParams] = useState<GeneratorParams>(defaultGeneratorParams);
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleParamChange = useCallback((key: keyof GeneratorParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);

  // randomiziing the paramaters within the range
  const handleRandomize = useCallback(() => {
    const randomParams: GeneratorParams = {
      angle1: Math.floor(Math.random() * 361), // 0-360
      angle2: Math.floor(Math.random() * 361), // 0-360
      iterations: Math.floor(Math.random() * 12) + 1, // 1-12
      branches: Math.floor(Math.random() * 10) + 1, // 1-10
      startLength: Math.floor(Math.random() * 11), // 0-10
      lengthMultiplier: Math.round((Math.random() * 5) * 100) / 100, // 0-5, 2 decimals
      startWidth: Math.floor(Math.random() * 6), // 0-5
      widthMultiplier: Math.round((Math.random() * 5) * 100) / 100 // 0-5, 2 decimals
    };
    setParams(randomParams);
  }, []);

  // png export
  const handleExport = useCallback(() => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `fractal-pattern-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  }, []);

  // save as preset json
  const handleSavePreset = useCallback(() => {
    const preset = {
      name: `Custom Preset ${new Date().toLocaleString()}`,
      params: params,
      timestamp: Date.now()
    };
    
    const dataStr = JSON.stringify(preset, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.download = `fractal-preset-${Date.now()}.json`;
    link.href = URL.createObjectURL(dataBlob);
    link.click();
    
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  }, [params]);

  // Load a preset
  const handleLoadPreset = useCallback((presetIndex: number) => {
    if (presetIndex >= 0 && presetIndex < generatorPresets.length) {
      setParams(generatorPresets[presetIndex].params);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2238] via-[#1a2238] to-[#1a2238]">
      {/* Header */}
      <header className="relative z-10 bg-[#1a2238]/90 backdrop-blur-md border-b border-[#9daaf2]/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 px-3 py-2 bg-[#9daaf2]/20 hover:bg-[#9daaf2]/30 text-[#f4db7d] rounded-lg transition-all duration-200 backdrop-blur-sm border border-[#9daaf2]/30"
              >
                <ArrowLeft size={20} />
                <span>Home</span>
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#9daaf2] to-[#f4db7d] bg-clip-text text-transparent">
                  Pattern Generator
                </h1>
                <p className="text-[#9daaf2]/70 text-sm mt-1">
                  Create beautiful fractal patterns with real-time controls
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRandomize}
                className="flex items-center space-x-2 px-4 py-2 bg-[#ff6a3d]/20 hover:bg-[#ff6a3d]/30 text-[#f4db7d] rounded-lg transition-all duration-200 backdrop-blur-sm border border-[#ff6a3d]/30"
              >
                <Shuffle size={20} />
                <span>Randomize</span>
              </button>
              <button
                onClick={handleSavePreset}
                className="flex items-center space-x-2 px-4 py-2 bg-[#9daaf2]/20 hover:bg-[#9daaf2]/30 text-[#f4db7d] rounded-lg transition-all duration-200 backdrop-blur-sm border border-[#9daaf2]/30"
              >
                <Save size={20} />
                <span>Save Preset</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-[#f4db7d]/20 hover:bg-[#f4db7d]/30 text-[#1a2238] rounded-lg transition-all duration-200 backdrop-blur-sm border border-[#f4db7d]/30"
              >
                <Download size={20} />
                <span>Export PNG</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Control Panel */}
        <div className="lg:w-80 bg-[#1a2238]/80 backdrop-blur-md border-r border-[#9daaf2]/20 p-6 overflow-y-auto">
          <GeneratorControls
            params={params}
            onParamChange={handleParamChange}
            onLoadPreset={handleLoadPreset}
          />
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative bg-[#1a2238]/40">
          <GeneratorCanvas
            ref={canvasRef}
            params={params}
          />
          
          {/* Status Bar */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <div className="bg-[#1a2238]/60 backdrop-blur-sm text-[#f4db7d] px-4 py-2 rounded-lg border border-[#9daaf2]/30">
              <p className="text-sm">
                <strong>Iterations:</strong> {params.iterations}
                <span className="ml-4">
                  <strong>Branches:</strong> {params.branches}
                </span>
              </p>
            </div>
            
            <div className="bg-[#1a2238]/60 backdrop-blur-sm text-[#f4db7d] px-4 py-2 rounded-lg border border-[#9daaf2]/30">
              <p className="text-sm">
                <strong>Segments:</strong> {Math.pow(params.branches, params.iterations).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};