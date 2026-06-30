import React, { useState, useRef } from 'react';
import { AsciiLabSettings, AsciiRampPreset } from '../types';
import AsciiRenderer from './AsciiRenderer';
import { Upload, RotateCcw, Sliders, Layers, Eye, RefreshCw, FileCode, CheckCircle2 } from 'lucide-react';

interface AsciiLabProps {
  settings: AsciiLabSettings;
  onChangeSettings: (settings: AsciiLabSettings) => void;
}

export default function AsciiLab({ settings, onChangeSettings }: AsciiLabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stlBuffer, setStlBuffer] = useState<ArrayBuffer | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const updateSetting = <K extends keyof AsciiLabSettings>(key: K, value: AsciiLabSettings[K]) => {
    onChangeSettings({
      ...settings,
      [key]: value
    });
  };

  const processStlFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.stl')) {
      setFileError('INVALID FILE: Only .STL files (STereoLithography) are supported.');
      return;
    }

    setFileError(null);
    updateSetting('customFileName', file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      setStlBuffer(buffer);
      updateSetting('modelType', 'custom');
    };
    reader.onerror = () => {
      setFileError('CRITICAL: File loading failed.');
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processStlFile(e.target.files[0]);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processStlFile(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    setStlBuffer(null);
    onChangeSettings({
      modelType: 'torus',
      resolution: 130,
      ramp: 'standard',
      invert: false,
      colorized: false,
      autoRotate: true,
      rotSpeedX: 0.1,
      rotSpeedY: 0.2,
      rotSpeedZ: 0,
      wireframe: true,
      lightIntensity: 1.2
    });
    setFileError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
      {/* Interactive 3D ASCII rendering stage */}
      <div className="lg:col-span-7 flex flex-col h-full space-y-3">
        <div className="flex-1 min-h-[420px] border border-current/25 bg-black/60 overflow-hidden">
          <AsciiRenderer settings={settings} customStlBuffer={stlBuffer} />
        </div>

        {/* Diagnostic readings at bottom of sandbox view */}
        <div className="grid grid-cols-3 gap-3 text-[10px] text-current/60 bg-black/30 border border-current/15 p-2">
          <div>
            <span className="font-bold uppercase block opacity-60">RESOLUTION</span>
            <span className="font-bold text-current">{settings.resolution} × {Math.round(settings.resolution * 0.5)} GLYPHS</span>
          </div>
          <div>
            <span className="font-bold uppercase block opacity-60">RAMP TYPE</span>
            <span className="font-bold text-current">{settings.ramp.toUpperCase()} Preset</span>
          </div>
          <div>
            <span className="font-bold uppercase block opacity-60">MODEL MATRIX</span>
            <span className="font-bold text-current">{settings.modelType.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Controller inputs */}
      <div className="lg:col-span-5 space-y-4">
        {/* Model select & file upload */}
        <div className="border border-current/20 bg-black/45 p-4 space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-current/15 pb-1.5">
            <Layers size={13} /> 3D GEOMETRY SELECT
          </h4>

          <div className="grid grid-cols-3 gap-2">
            {(['torus', 'gear', 'rocket', 'satellite', 'teapot', 'mobius'] as const).map(mType => {
              const isSelected = settings.modelType === mType;
              return (
                <button
                  key={mType}
                  onClick={() => updateSetting('modelType', mType)}
                  className={`py-1.5 border text-xs font-bold uppercase transition-all duration-150 ${
                    isSelected
                      ? 'bg-current/15 border-current text-current'
                      : 'border-current/20 bg-black/30 text-current/70 hover:border-current/45 hover:text-current hover:bg-current/5'
                  }`}
                >
                  {mType}
                </button>
              );
            })}
          </div>

          {/* Local Drag and drop file uploader */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed p-4 text-center cursor-pointer transition-all duration-150 relative flex flex-col items-center justify-center gap-2 ${
              dragActive 
                ? 'border-current bg-current/10' 
                : settings.modelType === 'custom'
                ? 'border-current/60 bg-current/5 text-current'
                : 'border-current/25 bg-black/20 text-current/60 hover:border-current/45 hover:text-current'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".stl"
              onChange={handleFileChange}
              className="hidden"
            />
            {settings.modelType === 'custom' && stlBuffer ? (
              <>
                <CheckCircle2 size={22} className="text-green-500 animate-pulse" />
                <div className="text-xs font-bold uppercase tracking-wide">
                  CUSTOM STL FILE RUNNING
                </div>
                <div className="text-[10px] opacity-70 max-w-xs truncate">
                  {settings.customFileName || 'custom_model.stl'}
                </div>
              </>
            ) : (
              <>
                <Upload size={22} />
                <div className="text-xs font-bold uppercase">
                  DRAG & DROP LOCAL .STL
                </div>
                <div className="text-[9px] opacity-65 leading-tight">
                  Supports Binary STereoLithography meshes<br />Maximum recommended: 3MB for smooth parsing
                </div>
              </>
            )}
          </div>

          {fileError && (
            <div className="text-[10px] font-bold text-red-500 bg-red-500/10 border border-red-500/30 p-2 uppercase animate-pulse">
              [FILE ERROR] {fileError}
            </div>
          )}
        </div>

        {/* Parametric slider sliders */}
        <div className="border border-current/20 bg-black/45 p-4 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-current/15 pb-1.5">
            <Sliders size={13} /> RENDER MATRIX CONFIG
          </h4>

          {/* Resolution slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>GLYPH DENSITY (COLS)</span>
              <span>{settings.resolution} CHARS</span>
            </div>
            <input
              type="range"
              min="30"
              max="220"
              step="5"
              value={settings.resolution}
              onChange={e => updateSetting('resolution', parseInt(e.target.value))}
              className="w-full h-1 bg-current/25 accent-current cursor-pointer"
            />
          </div>

          {/* Character preset selector */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold">LUMINANCE GLYPH RAMP</div>
            <div className="grid grid-cols-3 gap-1.5">
              {(['standard', 'detailed', 'binary', 'matrix', 'minimal', 'blocks', 'dots'] as AsciiRampPreset[]).map(rampPreset => {
                const isSelected = settings.ramp === rampPreset;
                return (
                  <button
                    key={rampPreset}
                    onClick={() => {
                      updateSetting('ramp', rampPreset);
                      updateSetting('customRamp', undefined); // Clear custom ramp
                    }}
                    className={`py-1 border text-[10px] font-bold uppercase transition-all duration-150 ${
                      isSelected
                        ? 'bg-current/15 border-current text-current'
                        : 'border-current/15 bg-black/20 text-current/60 hover:border-current/35 hover:text-current'
                    }`}
                  >
                    {rampPreset}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom ramp manual input */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase opacity-85">
              [CUSTOM_GLYPH_RAMP_STRING] (Darkest-to-Lightest)
            </label>
            <input
              type="text"
              value={settings.customRamp || ''}
              onChange={e => updateSetting('customRamp', e.target.value || undefined)}
              className="w-full bg-black/40 border border-current/25 focus:border-current focus:ring-1 focus:ring-current text-xs text-current font-mono px-2.5 py-1.5 outline-none"
              placeholder="e.g. .:-=+*#%@"
            />
          </div>

          {/* Toggle Switches */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                checked={settings.wireframe}
                onChange={e => updateSetting('wireframe', e.target.checked)}
                className="w-3.5 h-3.5 border-current text-current bg-transparent focus:ring-0 rounded-none cursor-pointer"
              />
              <span className="font-bold">WIREFRAME</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                checked={settings.colorized}
                onChange={e => updateSetting('colorized', e.target.checked)}
                className="w-3.5 h-3.5 border-current text-current bg-transparent focus:ring-0 rounded-none cursor-pointer"
              />
              <span className="font-bold">COLORIZED</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                checked={settings.autoRotate}
                onChange={e => updateSetting('autoRotate', e.target.checked)}
                className="w-3.5 h-3.5 border-current text-current bg-transparent focus:ring-0 rounded-none cursor-pointer"
              />
              <span className="font-bold">AUTO-ROTATE</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                checked={settings.invert}
                onChange={e => updateSetting('invert', e.target.checked)}
                className="w-3.5 h-3.5 border-current text-current bg-transparent focus:ring-0 rounded-none cursor-pointer"
              />
              <span className="font-bold">INVERT RAMP</span>
            </label>
          </div>

          {/* Reset button action */}
          <button
            onClick={handleReset}
            className="w-full text-center py-2 text-xs font-bold border border-dashed border-current/40 hover:border-current hover:bg-current/5 transition-colors flex items-center justify-center gap-1.5 mt-2"
          >
            <RotateCcw size={13} /> RESET LAB PARAMETERS
          </button>
        </div>
      </div>
    </div>
  );
}
