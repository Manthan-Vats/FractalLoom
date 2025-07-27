import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Save, X, Lightbulb } from "lucide-react";
import {
  GeneratorParams,
  defaultGeneratorParams,
  generatorPresets,
} from "../types/generator";
import { GeneratorCanvas } from "./GeneratorCanvas";
import { GeneratorControls } from "./GeneratorControls";

export const GeneratorPage: React.FC = () => {
  const [params, setParams] = useState<GeneratorParams>(defaultGeneratorParams);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleParamChange = useCallback(
    (key: keyof GeneratorParams, value: number) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // png export
  const handleExport = useCallback(() => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = `fractal-pattern-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL("image/png");
      link.click();
    }
  }, []);

  // save as preset json
  const handleSavePreset = useCallback(() => {
    const preset = {
      name: `Custom Preset ${new Date().toLocaleString()}`,
      params: params,
      timestamp: Date.now(),
    };

    const dataStr = JSON.stringify(preset, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
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
    <div className="h-screen bg-gradient-to-br from-[#1a2238] via-[#1a2238] to-[#1a2238] flex flex-col">
      {/* Tutorial Notification */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2238]/95 backdrop-blur-md border border-[#9daaf2]/30 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#f4db7d]/20 rounded-lg">
                  <Lightbulb size={20} className="text-[#f4db7d]" />
                </div>
                <h3 className="text-lg font-semibold text-[#f4db7d]">
                  Welcome to Pattern Generator!
                </h3>
              </div>
              <button
                onClick={() => setShowTutorial(false)}
                className="p-1 hover:bg-[#9daaf2]/20 rounded-lg transition-colors duration-200"
              >
                <X
                  size={18}
                  className="text-[#9daaf2]/70 hover:text-[#9daaf2]"
                />
              </button>
            </div>

            <div className="space-y-3 text-[#9daaf2]/90 text-sm leading-relaxed">
              <p>
                <strong className="text-[#f4db7d]">Get started:</strong> Use the
                control panel on the left to adjust 8 different variables and
                create stunning fractal patterns.
              </p>
              <ul className="space-y-1 ml-4">
                <li>
                  • <strong>Angle controls</strong> change the branching
                  direction
                </li>
                <li>
                  • <strong>Iterations & Branches</strong> control complexity
                </li>
                <li>
                  • <strong>Length & Width</strong> adjust segment properties
                </li>
                <li>
                  • Explore the <strong>curated presets</strong> for creative
                  inspiration
                </li>
              </ul>
              <p className="text-xs text-[#9daaf2]/70 mt-4">
                💡 Tip: Small adjustments can create dramatically different
                patterns
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowTutorial(false)}
                className="px-4 py-2 bg-gradient-to-r from-[#9daaf2] to-[#f4db7d] text-[#1a2238] rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              >
                Got it, let's create!
              </button>
            </div>
          </div>
        </div>
      )}

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
                  Pattern Generator
                </h1>
                <p className="text-[#9daaf2]/70 text-xs">
                  Create beautiful fractal patterns with real-time controls
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSavePreset}
                className="flex items-center space-x-2 px-3 py-1.5 bg-[#9daaf2]/20 hover:bg-[#9daaf2]/30 text-[#f4db7d] rounded-lg transition-all duration-200 backdrop-blur-sm border border-[#9daaf2]/30"
              >
                <Save size={18} />
                <span className="text-sm">Save Preset</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-3 py-1.5 bg-[#f4db7d]/90 hover:bg-[#f4db7d] text-[#1a2238] rounded-lg transition-all duration-200 backdrop-blur-sm border border-[#f4db7d]/50 font-medium"
              >
                <Download size={18} />
                <span className="text-sm">Export PNG</span>
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
            <GeneratorControls
              params={params}
              onParamChange={handleParamChange}
              onLoadPreset={handleLoadPreset}
            />
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative bg-[#1a2238]/40 overflow-hidden">
          <GeneratorCanvas ref={canvasRef} params={params} />

          {/* Status Bar */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
            <div className="bg-[#1a2238]/60 backdrop-blur-sm text-[#f4db7d] px-4 py-2 rounded-lg border border-[#9daaf2]/30">
              <p className="text-sm">
                <strong>Iterations:</strong> {params.iterations}
                <span className="ml-4">
                  <strong>Branches:</strong> {params.branches}
                </span>
              </p>
            </div>

            <div className="bg-[#1a2238]/60 backdrop-blur-sm text-[#f4db7d] px-4 py-2 rounded-lg border border-[#9daaf2]/30">
              <p className="text-sm">;
                <strong>Segments:</strong>{" "}
                {Math.pow(params.branches, params.iterations).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
