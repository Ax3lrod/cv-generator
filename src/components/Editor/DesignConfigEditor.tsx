import React from 'react';
import { DesignConfig, TemplateId, FontFamily, PaperPreset } from '../../types/cv';
import { PAPER_PRESETS, getPaperDimensions } from '../../utils/paperDimensions';
import { Palette, Type, Sliders, Layout, SlidersHorizontal, Check, Lock, Unlock, Camera } from 'lucide-react';
import { Button } from '@heroui/react';
import { ToggleSwitch } from '../UI/ToggleSwitch';

interface Props {
  config: DesignConfig;
  onChange: (updated: DesignConfig) => void;
}

const TEMPLATE_OPTIONS: { id: TemplateId; name: string; desc: string }[] = [
  { id: 'ats-classic', name: 'ATS Classic', desc: 'Direct layout based on reference PDF with clean horizontal rules.' },
  { id: 'modern', name: 'Modern Minimal', desc: 'Structured header, contemporary tags, and clear spacing.' },
  { id: 'executive', name: 'Executive', desc: 'Formal typographic hierarchy with double horizontal dividers.' },
  { id: 'tech', name: 'Tech Compact', desc: 'Developer-oriented layout with technology badges and tags.' },
];

const FONT_OPTIONS: { id: FontFamily; name: string; preview: string; type: string }[] = [
  { id: 'inter', name: 'Inter', preview: 'Modern Clean Sans', type: 'Sans-Serif' },
  { id: 'eb-garamond', name: 'EB Garamond', preview: 'Classic Academic Serif', type: 'Serif' },
  { id: 'merriweather', name: 'Merriweather', preview: 'Editorial Elegant Serif', type: 'Serif' },
  { id: 'roboto', name: 'Roboto', preview: 'Geometric Standard Sans', type: 'Sans-Serif' },
  { id: 'jetbrains-mono', name: 'JetBrains Mono', preview: 'Engineering Monospace', type: 'Monospace' },
];

const COLOR_PRESETS = [
  { name: 'ATS Black', hex: '#000000' },
  { name: 'Dark Slate', hex: '#1e293b' },
  { name: 'Executive Navy', hex: '#1e3a8a' },
  { name: 'Forest Emerald', hex: '#065f46' },
  { name: 'Deep Burgundy', hex: '#881337' },
  { name: 'Modern Indigo', hex: '#4338ca' },
  { name: 'Teal Blue', hex: '#0e7490' },
];

export const DesignConfigEditor: React.FC<Props> = ({ config, onChange }) => {
  const updateConfig = (field: keyof DesignConfig, value: any) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  const handlePaperPresetChange = (preset: PaperPreset) => {
    if (preset === 'custom') {
      onChange({
        ...config,
        paperSize: 'custom',
        customPaperWidth: config.customPaperWidth || 210,
        customPaperHeight: config.customPaperHeight || 297,
      });
    } else {
      const p = PAPER_PRESETS[preset];
      onChange({
        ...config,
        paperSize: preset,
        customPaperWidth: p.widthMm,
        customPaperHeight: p.heightMm,
      });
    }
  };

  // 1-Page Layout Optimizer (Adjusts typography & margins so content fits naturally)
  const handleAutoFitOnePage = () => {
    onChange({
      ...config,
      forceOnePage: true,
      baseFontSize: 9.2,
      nameFontSize: 19,
      sectionHeadingFontSize: 11,
      itemTitleFontSize: 9.8,
      lineHeight: 1.3,
      pageMarginTop: 10,
      pageMarginBottom: 10,
      pageMarginLeft: 12,
      pageMarginRight: 12,
      sectionGap: 2.8,
      itemGap: 1.8,
      bulletGap: 0.8,
    });
  };

  const currentDims = getPaperDimensions(config);

  return (
    <div className="space-y-4">
      {/* 1-Page Lock & Optimization Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
        <div className="p-4 space-y-3.5">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl border transition ${
                config.forceOnePage 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/50'
              }`}>
                {config.forceOnePage ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                  <span>Force 1-Page Layout</span>
                  {config.forceOnePage && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {config.forceOnePage 
                    ? 'All content is mathematically locked to 1 single page without spilling.' 
                    : 'Content will naturally flow to page 2 if entries exceed page height.'}
                </p>
              </div>
            </div>

            <ToggleSwitch
              checked={config.forceOnePage}
              onChange={(checked) => updateConfig('forceOnePage', checked)}
              ariaLabel="Toggle force 1-page layout"
            />
          </div>

          <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Auto-calculate ideal margins & font sizing for 1-page:
            </span>
            <Button
              size="sm"
              variant="secondary"
              onPress={handleAutoFitOnePage}
              className="text-xs font-medium h-7.5 px-3 rounded-lg text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 shrink-0 ml-2"
            >
              <SlidersHorizontal className="w-3 h-3 mr-1" />
              <span>Auto-Fit 1 Page</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 1. Paper Size & Custom Dimensions Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-800/80 bg-slate-950/70 px-4 py-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sliders className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Paper Size & Format
          </span>
        </div>

        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['a4', 'letter', 'legal', 'f4'] as PaperPreset[]).map((preset) => {
              const p = PAPER_PRESETS[preset];
              const isSelected = config.paperSize === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePaperPresetChange(preset)}
                  className={`p-2.5 flex flex-col items-start rounded-xl text-left border transition-all ${
                    isSelected 
                      ? 'bg-blue-600/15 border-blue-500 text-blue-200 shadow-sm' 
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-xs">{p.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {p.widthMm} × {p.heightMm} mm
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => handlePaperPresetChange('custom')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition ${
                config.paperSize === 'custom'
                  ? 'bg-blue-600/15 border-blue-500 text-blue-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span>Custom Dimensions (Free Size)</span>
              <span className="font-mono text-[11px] text-slate-400">
                {currentDims.widthMm} × {currentDims.heightMm} mm
              </span>
            </button>

            {config.paperSize === 'custom' && (
              <div className="grid grid-cols-2 gap-3 mt-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-semibold uppercase tracking-wider">
                    Width (mm)
                  </label>
                  <input
                    type="number"
                    value={String(currentDims.widthMm)}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 210;
                      onChange({
                        ...config,
                        paperSize: 'custom',
                        customPaperWidth: val,
                        customPaperHeight: currentDims.heightMm,
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-semibold uppercase tracking-wider">
                    Height (mm)
                  </label>
                  <input
                    type="number"
                    value={String(currentDims.heightMm)}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 297;
                      onChange({
                        ...config,
                        paperSize: 'custom',
                        customPaperWidth: currentDims.widthMm,
                        customPaperHeight: val,
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs transition"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Resume Template Style Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-800/80 bg-slate-950/70 px-4 py-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Layout className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Resume Template Style
          </span>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {TEMPLATE_OPTIONS.map((t) => {
              const isSelected = config.template === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => updateConfig('template', t.id)}
                  className={`p-3 flex flex-col items-start rounded-xl text-left border transition-all ${
                    isSelected 
                      ? 'bg-blue-600/15 border-blue-500 text-blue-200 shadow-sm' 
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-xs">{t.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug font-normal">
                    {t.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Header Layout & Letter Case Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-800/80 bg-slate-950/70 px-4 py-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sliders className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Header Layout & Case
          </span>
        </div>

        <div className="p-4 space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Header Alignment
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {[
                { id: 'center', label: 'Centered (ATS)' },
                { id: 'left', label: 'Left Aligned' },
                { id: 'split', label: 'Split Header' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => updateConfig('headerAlign', item.id)}
                  className={`py-1 text-xs font-semibold rounded-lg transition ${
                    config.headerAlign === item.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">UPPERCASE Name</span>
                <span className="text-[10px] text-slate-400">Capitalize full name</span>
              </div>
              <ToggleSwitch
                checked={config.uppercaseName}
                onChange={(checked) => updateConfig('uppercaseName', checked)}
                ariaLabel="Toggle uppercase name"
              />
            </div>

            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">UPPERCASE Headings</span>
                <span className="text-[10px] text-slate-400">Capitalize section titles</span>
              </div>
              <ToggleSwitch
                checked={config.uppercaseHeadings}
                onChange={(checked) => updateConfig('uppercaseHeadings', checked)}
                ariaLabel="Toggle uppercase headings"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Profile Photo Layout & Shape Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-800/80 bg-slate-950/70 px-4 py-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Camera className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Profile Photo Layout & Shape
          </span>
        </div>

        <div className="p-4 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Avatar Shape
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['circle', 'rounded', 'square'] as const).map((shape) => (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => updateConfig('photoShape', shape)}
                    className={`py-1 text-xs font-semibold rounded-lg transition ${
                      (config.photoShape || 'circle') === shape
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    {shape === 'circle' ? 'Circle' : shape === 'rounded' ? 'Round' : 'Square'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['1:1', '3:4'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => {
                      if (ratio === '3:4' && config.photoShape === 'circle') {
                        onChange({ ...config, photoAspectRatio: ratio, photoShape: 'rounded' });
                      } else {
                        updateConfig('photoAspectRatio', ratio);
                      }
                    }}
                    className={`py-1 text-xs font-semibold rounded-lg transition ${
                      (config.photoAspectRatio || '1:1') === ratio
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    {ratio === '1:1' ? '1:1 Sq' : '3:4 Pas'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Header Placement
              </label>
              <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['right', 'left'] as const).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => updateConfig('photoPosition', pos)}
                    className={`py-1 text-xs font-semibold rounded-lg transition ${
                      (config.photoPosition || 'right') === pos
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    {pos === 'right' ? 'Right' : 'Left'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-semibold uppercase tracking-wider">
              <span>Photo Size (Width)</span>
              <span className="font-mono text-blue-400 font-bold">
                {config.photoSize || 26} mm
                {config.photoAspectRatio === '3:4'
                  ? ` × ${Math.round(((config.photoSize || 26) * 4) / 3)} mm`
                  : ` × ${config.photoSize || 26} mm`}
              </span>
            </div>
            <input
              type="range"
              min={18}
              max={38}
              step={1}
              value={config.photoSize || 26}
              onChange={(e) => updateConfig('photoSize', parseInt(e.target.value, 10))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-200">Subtle outline border around photo</span>
            <ToggleSwitch
              checked={config.photoBorder !== false}
              onChange={(checked) => updateConfig('photoBorder', checked)}
              ariaLabel="Toggle photo outline border"
            />
          </div>
        </div>
      </div>

      {/* 5. Typography Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-800/80 bg-slate-950/70 px-4 py-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Type className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Typography & Font Sizing
          </span>
        </div>

        <div className="p-4 space-y-3.5">
          {/* Font family selection */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {FONT_OPTIONS.map((f) => {
              const isSelected = config.fontFamily === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => updateConfig('fontFamily', f.id)}
                  className={`p-2.5 flex flex-col items-start rounded-xl text-left border transition-all ${
                    isSelected 
                      ? 'bg-blue-600/15 border-blue-500 text-blue-200 shadow-sm' 
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-xs">{f.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5">{f.type}</span>
                </button>
              );
            })}
          </div>

          {/* Sliders for font sizes */}
          <div className="space-y-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">
                <span>Base Font Size</span>
                <span className="font-mono text-blue-400 font-bold">{config.baseFontSize} pt</span>
              </div>
              <input
                type="range"
                min={8.0}
                max={12.0}
                step={0.1}
                value={config.baseFontSize}
                onChange={(e) => updateConfig('baseFontSize', parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">
                <span>Name Title Font Size</span>
                <span className="font-mono text-blue-400 font-bold">{config.nameFontSize} pt</span>
              </div>
              <input
                type="range"
                min={16}
                max={28}
                step={1}
                value={config.nameFontSize}
                onChange={(e) => updateConfig('nameFontSize', parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">
                <span>Section Heading Font Size</span>
                <span className="font-mono text-blue-400 font-bold">{config.sectionHeadingFontSize} pt</span>
              </div>
              <input
                type="range"
                min={10}
                max={15}
                step={0.5}
                value={config.sectionHeadingFontSize}
                onChange={(e) => updateConfig('sectionHeadingFontSize', parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">
                <span>Line Height (Leading)</span>
                <span className="font-mono text-blue-400 font-bold">{config.lineHeight}</span>
              </div>
              <input
                type="range"
                min={1.15}
                max={1.65}
                step={0.02}
                value={config.lineHeight}
                onChange={(e) => updateConfig('lineHeight', parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 6. Page Margins & Section Gaps Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-800/80 bg-slate-950/70 px-4 py-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sliders className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Page Margins & Spacing (mm)
          </span>
        </div>

        <div className="p-4 space-y-3.5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold uppercase tracking-wider">Top Margin</label>
              <input
                type="number"
                value={String(config.pageMarginTop)}
                onChange={(e) => updateConfig('pageMarginTop', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs transition"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold uppercase tracking-wider">Bottom Margin</label>
              <input
                type="number"
                value={String(config.pageMarginBottom)}
                onChange={(e) => updateConfig('pageMarginBottom', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs transition"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold uppercase tracking-wider">Left Margin</label>
              <input
                type="number"
                value={String(config.pageMarginLeft)}
                onChange={(e) => updateConfig('pageMarginLeft', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs transition"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold uppercase tracking-wider">Right Margin</label>
              <input
                type="number"
                value={String(config.pageMarginRight)}
                onChange={(e) => updateConfig('pageMarginRight', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs transition"
              />
            </div>
          </div>

          <div className="space-y-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">
                <span>Section Gap</span>
                <span className="font-mono text-blue-400 font-bold">{config.sectionGap} mm</span>
              </div>
              <input
                type="range"
                min={1.5}
                max={9.0}
                step={0.5}
                value={config.sectionGap}
                onChange={(e) => updateConfig('sectionGap', parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">
                <span>Entry Item Gap</span>
                <span className="font-mono text-blue-400 font-bold">{config.itemGap} mm</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={7.0}
                step={0.5}
                value={config.itemGap}
                onChange={(e) => updateConfig('itemGap', parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">
                <span>Bullet Point Gap</span>
                <span className="font-mono text-blue-400 font-bold">{config.bulletGap} mm</span>
              </div>
              <input
                type="range"
                min={0.4}
                max={4.0}
                step={0.2}
                value={config.bulletGap}
                onChange={(e) => updateConfig('bulletGap', parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7. Section Heading Line & Bullet Styles Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-800/80 bg-slate-950/70 px-4 py-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sliders className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Divider & Bullet Style
          </span>
        </div>

        <div className="p-4 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Section Divider Style
              </label>
              <select
                value={config.sectionHeadingStyle}
                onChange={(e) => updateConfig('sectionHeadingStyle', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition"
              >
                <option value="line-under">Underline Full-Width (Classic ATS)</option>
                <option value="left-bar">Left Accent Bar</option>
                <option value="pill">Pill Badge</option>
                <option value="double-line">Double Line</option>
                <option value="minimal">Minimal (No Line)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Bullet Point Style
              </label>
              <select
                value={config.bulletStyle}
                onChange={(e) => updateConfig('bulletStyle', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition"
              >
                <option value="disc">• Solid Disc</option>
                <option value="dash">- Hyphen</option>
                <option value="square">▪ Square</option>
                <option value="circle">○ Circle</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">
              <span>Divider Line Thickness</span>
              <span className="font-mono text-blue-400 font-bold">{config.sectionLineWidth} px</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.5}
              value={config.sectionLineWidth}
              onChange={(e) => updateConfig('sectionLineWidth', parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 8. Accent Color Customization Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-800/80 bg-slate-950/70 px-4 py-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Palette className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Accent & Palette Colors
          </span>
        </div>

        <div className="p-4 space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Accent Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((color) => {
                const isSelected = config.accentColor === color.hex;
                return (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => updateConfig('accentColor', color.hex)}
                    className={`h-8 px-2.5 text-xs rounded-xl flex items-center gap-1.5 border transition ${
                      isSelected 
                        ? 'bg-blue-600/15 border-blue-500 text-blue-200 shadow-sm font-semibold' 
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0 shadow-xs"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-2.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <input
                type="color"
                value={config.accentColor}
                onChange={(e) => updateConfig('accentColor', e.target.value)}
                className="w-6 h-6 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <span className="font-mono text-xs text-slate-100 uppercase font-semibold tracking-wider">
                {config.accentColor}
              </span>
            </div>
            <span className="text-xs text-slate-400">Custom Hex Picker</span>
          </div>
        </div>
      </div>
    </div>
  );
};
