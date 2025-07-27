
import React from 'react';
import { Sliders, Palette, Settings, Zap } from 'lucide-react';
import { GeneratorParams, generatorPresets } from '../types/generator';

interface GeneratorControlsProps {
  params: GeneratorParams;
  onParamChange: (key: keyof GeneratorParams, value: number) => void;
  onLoadPreset: (presetIndex: number) => void;
}

export const GeneratorControls: React.FC<GeneratorControlsProps> = ({
  params,
  onParamChange,
  onLoadPreset
}) => {
  return (
    <div className="space-y-6">
      {/* Presets */}
      <div>
        <h3 className="text-lg font-semibold text-[#f4db7d] mb-3 flex items-center">
          <Palette size={18} className="mr-2" />
          Presets
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {generatorPresets.map((preset, index) => (
            <button
              key={index}
              onClick={() => onLoadPreset(index)}
              className="px-4 py-3 bg-[#1a2238]/50 hover:bg-[#9daaf2]/20 text-[#9daaf2] hover:text-[#f4db7d] rounded-lg transition-all duration-200 border border-[#9daaf2]/30 text-left"
            >
              <span className="font-medium">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Structure Controls */}
      <div>
        <h3 className="text-lg font-semibold text-[#f4db7d] mb-3 flex items-center">
          <Settings size={18} className="mr-2" />
          Structure
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#9daaf2] mb-1">
              Angle 1: {params.angle1}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={params.angle1}
              onChange={(e) => onParamChange('angle1', parseInt(e.target.value))}
              className="w-full accent-[#ff6a3d]"
            />
            <p className="text-xs text-[#9daaf2]/60 mt-1">Spreads branches apart</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9daaf2] mb-1">
              Angle 2: {params.angle2}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={params.angle2}
              onChange={(e) => onParamChange('angle2', parseInt(e.target.value))}
              className="w-full accent-[#ff6a3d]"
            />
            <p className="text-xs text-[#9daaf2]/60 mt-1">Twists the structure</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9daaf2] mb-1">
              Iterations: {params.iterations}
            </label>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={params.iterations}
              onChange={(e) => onParamChange('iterations', parseInt(e.target.value))}
              className="w-full accent-[#ff6a3d]"
            />
            <p className="text-xs text-[#9daaf2]/60 mt-1">Number of generations</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9daaf2] mb-1">
              Branches: {params.branches}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={params.branches}
              onChange={(e) => onParamChange('branches', parseInt(e.target.value))}
              className="w-full accent-[#ff6a3d]"
            />
            <p className="text-xs text-[#9daaf2]/60 mt-1">Children per segment</p>
          </div>
        </div>
      </div>

      {/* Size Controls */}
      <div>
        <h3 className="text-lg font-semibold text-[#f4db7d] mb-3 flex items-center">
          <Sliders size={18} className="mr-2" />
          Size & Scale
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#9daaf2] mb-1">
              Start Length: {params.startLength}
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={params.startLength}
              onChange={(e) => onParamChange('startLength', parseFloat(e.target.value))}
              className="w-full accent-[#ff6a3d]"
            />
            <p className="text-xs text-[#9daaf2]/60 mt-1">Initial segment length</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9daaf2] mb-1">
              Length Multiplier: {params.lengthMultiplier.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.01"
              value={params.lengthMultiplier}
              onChange={(e) => onParamChange('lengthMultiplier', parseFloat(e.target.value))}
              className="w-full accent-[#ff6a3d]"
            />
            <p className="text-xs text-[#9daaf2]/60 mt-1">Scale factor for length</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9daaf2] mb-1">
              Start Width: {params.startWidth}
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.01"
              value={params.startWidth}
              onChange={(e) => onParamChange('startWidth', parseFloat(e.target.value))}
              className="w-full accent-[#ff6a3d]"
            />
            <p className="text-xs text-[#9daaf2]/60 mt-1">Initial segment thickness</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9daaf2] mb-1">
              Width Multiplier: {params.widthMultiplier.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.01"
              value={params.widthMultiplier}
              onChange={(e) => onParamChange('widthMultiplier', parseFloat(e.target.value))}
              className="w-full accent-[#ff6a3d]"
            />
            <p className="text-xs text-[#9daaf2]/60 mt-1">Scale factor for thickness</p>
          </div>
        </div>
      </div>

      {/* Performance Info */}
      <div className="p-4 bg-[#1a2238]/40 rounded-lg border border-[#9daaf2]/20">
        <h4 className="text-sm font-semibold text-[#f4db7d] mb-2 flex items-center">
          <Zap size={16} className="mr-2" />
          Performance
        </h4>
        <div className="text-xs text-[#9daaf2]/70 space-y-1">
          <p>Total Segments: {Math.pow(params.branches, params.iterations).toLocaleString()}</p>
          <p className={`${Math.pow(params.branches, params.iterations) > 10000 ? 'text-[#ff6a3d]' : 'text-[#9daaf2]/70'}`}>
            {Math.pow(params.branches, params.iterations) > 10000 ? 'High complexity - may be slow' : 'Good performance'}
          </p>
        </div>
      </div>
    </div>
  );
};