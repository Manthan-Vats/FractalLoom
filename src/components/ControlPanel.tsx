import React from 'react';
import { FractalType, FractalParams } from '../types/fractal';
import { presets } from '../data/presets';
import { Settings, Palette, TreePine, Flower, Snowflake, Minus, Grid3X3, Zap, Eye, Sliders } from 'lucide-react';

interface ControlPanelProps {
  fractalType: FractalType;
  params: FractalParams;
  onFractalTypeChange: (type: FractalType) => void;
  onParamChange: (key: string, value: any) => void;
  onPresetChange: (preset: string) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  fractalType,
  params,
  onFractalTypeChange,
  onParamChange,
  onPresetChange
}) => {
  const fractalTypes = [
    { value: 'mandelbrot', label: 'Mandelbrot', icon: <Settings size={16} /> },
    { value: 'julia', label: 'Julia', icon: <Palette size={16} /> },
    { value: 'lsystem', label: 'L-System', icon: <TreePine size={16} /> },
    { value: 'barnsley', label: 'Barnsley Fern', icon: <Flower size={16} /> },
    { value: 'koch', label: 'Koch Snowflake', icon: <Snowflake size={16} /> },
    { value: 'cantor', label: 'Cantor Set', icon: <Minus size={16} /> },
    { value: 'vicsek', label: 'Vicsek Fractal', icon: <Grid3X3 size={16} /> }
  ];

  const colorSchemes = [
    'rainbow', 'fire', 'ocean', 'purple', 'dragon', 'spiral', 'tree', 'ice'
  ];

  const renderQualityOptions = [
    { value: 'low', label: 'Low (Fast)' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High (Detailed)' }
  ];

  const renderCommonParameters = () => (
    <>
      {(fractalType === 'mandelbrot' || fractalType === 'julia') && (
        <>
          <div>
            <label className="block text-sm font-medium text-[#9daaf2] mb-1">
              Max Iterations: {params.maxIterations}
            </label>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={params.maxIterations}
              onChange={(e) => onParamChange('maxIterations', parseInt(e.target.value))}
              className="w-full accent-[#ff6a3d]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9daaf2] mb-1">
              Escape Radius: {params.escapeRadius.toFixed(1)}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={params.escapeRadius}
              onChange={(e) => onParamChange('escapeRadius', parseFloat(e.target.value))}
              className="w-full accent-[#ff6a3d]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Power: {params.power.toFixed(1)}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={params.power}
              onChange={(e) => onParamChange('power', parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              C Real: {params.cReal.toFixed(3)}
            </label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.001"
              value={params.cReal}
              onChange={(e) => onParamChange('cReal', parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              C Imaginary: {params.cImag.toFixed(3)}
            </label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.001"
              value={params.cImag}
              onChange={(e) => onParamChange('cImag', parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Zoom: {params.zoom.toFixed(1)}x
        </label>
        <input
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={params.zoom}
          onChange={(e) => onParamChange('zoom', parseFloat(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>
    </>
  );

  const renderLSystemParameters = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Generations: {params.generations}
        </label>
        <input
          type="range"
          min="1"
          max="8"
          step="1"
          value={params.generations || 5}
          onChange={(e) => onParamChange('generations', parseInt(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Branching Angle: {params.branchingAngle}°
        </label>
        <input
          type="range"
          min="0"
          max="360"
          step="1"
          value={params.branchingAngle}
          onChange={(e) => onParamChange('branchingAngle', parseInt(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Length: {params.length}
        </label>
        <input
          type="range"
          min="1"
          max="20"
          step="0.5"
          value={params.length || 10}
          onChange={(e) => onParamChange('length', parseFloat(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Length Multiplier: {params.lengthMultiplier.toFixed(2)}
        </label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.01"
          value={params.lengthMultiplier}
          onChange={(e) => onParamChange('lengthMultiplier', parseFloat(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>
    </>
  );

  const renderBarnsleyParameters = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Iteration Depth: {params.iterationDepth}
        </label>
        <input
          type="range"
          min="1000"
          max="100000"
          step="1000"
          value={params.iterationDepth || 50000}
          onChange={(e) => onParamChange('iterationDepth', parseInt(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>
    </>
  );

  const renderKochParameters = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Iterations: {params.generations}
        </label>
        <input
          type="range"
          min="1"
          max="6"
          step="1"
          value={params.generations || 4}
          onChange={(e) => onParamChange('generations', parseInt(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Base Segment Length: {params.baseSegmentLength}
        </label>
        <input
          type="range"
          min="50"
          max="400"
          step="10"
          value={params.baseSegmentLength || 200}
          onChange={(e) => onParamChange('baseSegmentLength', parseInt(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Rotation Angle: {params.rotationAngle}°
        </label>
        <input
          type="range"
          min="30"
          max="120"
          step="1"
          value={params.rotationAngle || 60}
          onChange={(e) => onParamChange('rotationAngle', parseInt(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>
    </>
  );

  const renderCantorParameters = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Iteration Depth: {params.generations}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={params.generations || 6}
          onChange={(e) => onParamChange('generations', parseInt(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Spacing Ratio: {params.spacingRatio?.toFixed(2)}
        </label>
        <input
          type="range"
          min="0.1"
          max="0.5"
          step="0.01"
          value={params.spacingRatio || 0.33}
          onChange={(e) => onParamChange('spacingRatio', parseFloat(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Line Thickness: {params.lineThickness}
        </label>
        <input
          type="range"
          min="1"
          max="20"
          step="1"
          value={params.lineThickness || 10}
          onChange={(e) => onParamChange('lineThickness', parseInt(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>
    </>
  );

  const renderVicsekParameters = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Recursion Level: {params.recursionLevel}
        </label>
        <input
          type="range"
          min="1"
          max="7"
          step="1"
          value={params.recursionLevel || 5}
          onChange={(e) => onParamChange('recursionLevel', parseInt(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Scale Factor: {params.scaleFactor?.toFixed(2)}
        </label>
        <input
          type="range"
          min="0.1"
          max="0.5"
          step="0.01"
          value={params.scaleFactor || 0.33}
          onChange={(e) => onParamChange('scaleFactor', parseFloat(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Rotation: {params.rotationOptions}°
        </label>
        <input
          type="range"
          min="0"
          max="360"
          step="15"
          value={params.rotationOptions || 0}
          onChange={(e) => onParamChange('rotationOptions', parseInt(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Fractal Type Selection */}
      <div>
        <h3 className="text-lg font-semibold text-[#f4db7d] mb-3 flex items-center">
          <Sliders size={18} className="mr-2" />
          Fractal Type
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {fractalTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onFractalTypeChange(type.value as FractalType)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 border ${
                fractalType === type.value
                  ? 'bg-gradient-to-r from-[#9daaf2] to-[#ff6a3d] text-[#1a2238] shadow-lg border-[#f4db7d]'
                  : 'bg-[#1a2238]/50 hover:bg-[#9daaf2]/20 text-[#9daaf2] hover:text-[#f4db7d] border-[#9daaf2]/30'
              }`}
            >
              {type.icon}
              <span className="font-medium">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preset Selection */}
      <div>
        <h3 className="text-lg font-semibold text-[#f4db7d] mb-3">Presets</h3>
        <select
          onChange={(e) => onPresetChange(e.target.value)}
          className="w-full px-3 py-2 bg-[#1a2238]/70 text-[#f4db7d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9daaf2] border border-[#9daaf2]/30"
        >
          {Object.keys(presets[fractalType] || {}).map((preset) => (
            <option key={preset} value={preset}>
              {preset.charAt(0).toUpperCase() + preset.slice(1).replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Parameters */}
      <div>
        <h3 className="text-lg font-semibold text-[#f4db7d] mb-3">Parameters</h3>
        <div className="space-y-4">
          {renderCommonParameters()}
          
          {fractalType === 'lsystem' && renderLSystemParameters()}
          {fractalType === 'barnsley' && renderBarnsleyParameters()}
          {fractalType === 'koch' && renderKochParameters()}
          {fractalType === 'cantor' && renderCantorParameters()}
          {fractalType === 'vicsek' && renderVicsekParameters()}
        </div>
      </div>

      {/* Color Controls */}
      <div>
        <h3 className="text-lg font-semibold text-[#f4db7d] mb-3 flex items-center">
          <Palette size={18} className="mr-2" />
          Color Controls
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#9daaf2] mb-1">
              Color Mode
            </label>
            <select
              value={params.colorMode}
              onChange={(e) => onParamChange('colorMode', e.target.value)}
              className="w-full px-3 py-2 bg-[#1a2238]/70 text-[#f4db7d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9daaf2] border border-[#9daaf2]/30"
            >
              <option value="RGB">RGB</option>
              <option value="HSL">HSL</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Primary Color
            </label>
            <input
              type="color"
              value={params.primaryColor}
              onChange={(e) => onParamChange('primaryColor', e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-600 bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Background Color
            </label>
            <input
              type="color"
              value={params.backgroundColor}
              onChange={(e) => onParamChange('backgroundColor', e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-600 bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Color Scheme
            </label>
            <select
              value={params.colorScheme}
              onChange={(e) => onParamChange('colorScheme', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
            >
              {colorSchemes.map((scheme) => (
                <option key={scheme} value={scheme}>
                  {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Color Intensity: {params.colorIntensity.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={params.colorIntensity}
              onChange={(e) => onParamChange('colorIntensity', parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Visual Effects */}
      <div>
        <h3 className="text-lg font-semibold text-[#f4db7d] mb-3 flex items-center">
          <Eye size={18} className="mr-2" />
          Visual Effects
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Render Quality
            </label>
            <select
              value={params.renderQuality}
              onChange={(e) => onParamChange('renderQuality', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
            >
              {renderQualityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={params.smoothColoring}
              onChange={(e) => onParamChange('smoothColoring', e.target.checked)}
              className="rounded focus:ring-purple-500 accent-purple-500"
            />
            <label className="text-sm text-gray-300">Smooth Coloring</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={params.animationEffects}
              onChange={(e) => onParamChange('animationEffects', e.target.checked)}
              className="rounded focus:ring-purple-500 accent-purple-500"
            />
            <label className="text-sm text-gray-300">Animation Effects</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={params.gridDisplay}
              onChange={(e) => onParamChange('gridDisplay', e.target.checked)}
              className="rounded focus:ring-purple-500 accent-purple-500"
            />
            <label className="text-sm text-gray-300">Grid Display</label>
          </div>

          {fractalType === 'julia' && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={params.juliaAnimation}
                onChange={(e) => onParamChange('juliaAnimation', e.target.checked)}
                className="rounded focus:ring-purple-500 accent-purple-500"
              />
              <label className="text-sm text-gray-300">Julia Animation</label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};