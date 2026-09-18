import React from 'react';
import { DesignConfig, TemplateId, FontFamily, PaperPreset } from '../../types/cv';
import { PAPER_PRESETS, getPaperDimensions } from '../../utils/paperDimensions';
import { Palette, Type, Sliders, Layout, SlidersHorizontal, Check, Lock, Unlock } from 'lucide-react';

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
    <div className="space-y-6">
      {/* 1-Page Lock & Optimization Control */}
      <div className="p-3.5 bg-slate-900 border border-slate-700 rounded-lg space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded ${config.forceOnePage ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'}`}>
              {config.forceOnePage ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">
                Force 1-Page Layout
              </div>
              <p className="text-[11px] text-slate-400">
                {config.forceOnePage 
                  ? 'Active: All content is strictly locked to 1 single page without spilling.' 
                  : 'Disabled: Content will span across multiple pages if long.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => updateConfig('forceOnePage', !config.forceOnePage)}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none ${
              config.forceOnePage 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {config.forceOnePage ? '1-Page Locked' : 'Enable 1-Page Lock'}
          </button>
        </div>

        <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Need fine-tuning? Auto-optimize margins and font sizes for a single page:
          </span>
          <button
            type="button"
            onClick={handleAutoFitOnePage}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded border border-slate-700 transition focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none shrink-0 ml-2"
          >
            <SlidersHorizontal className="w-3 h-3 text-blue-400" />
            Auto-Tune Spacing
          </button>
        </div>
      </div>

      {/* 1. Paper Size & Custom Dimensions */}
      <div>
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Paper Size & Custom Dimensions
          </h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Paper Format Preset</label>
            <select
              value={config.paperSize}
              onChange={(e) => handlePaperPresetChange(e.target.value as PaperPreset)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            >
              <option value="a4">A4 (210 × 297 mm) - Global & Indonesia Standard</option>
              <option value="letter">US Letter (215.9 × 279.4 mm) - North America</option>
              <option value="f4">F4 / Folio (215 × 330 mm) - Indonesia Standard</option>
              <option value="legal">US Legal (215.9 × 355.6 mm) - Extended</option>
              <option value="custom">Custom Dimensions (Freely specify Width & Height)</option>
            </select>
          </div>

          {/* Custom Dimension Inputs */}
          <div className="p-3 bg-slate-900/70 border border-slate-800 rounded space-y-3">
            <div className="text-[11px] font-medium text-slate-300 flex justify-between">
              <span>Current Dimensions:</span>
              <span className="font-mono text-emerald-400">{currentDims.widthMm} mm × {currentDims.heightMm} mm</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Width (mm)</label>
                <input
                  type="number"
                  min={120}
                  max={350}
                  step={1}
                  value={currentDims.widthMm}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 210;
                    onChange({
                      ...config,
                      paperSize: 'custom',
                      customPaperWidth: val,
                      customPaperHeight: currentDims.heightMm,
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Height (mm)</label>
                <input
                  type="number"
                  min={180}
                  max={500}
                  step={1}
                  value={currentDims.heightMm}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 297;
                    onChange({
                      ...config,
                      paperSize: 'custom',
                      customPaperWidth: currentDims.widthMm,
                      customPaperHeight: val,
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Template Choice */}
      <div>
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
          <Layout className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Resume Template Style
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATE_OPTIONS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => updateConfig('template', t.id)}
              className={`text-left p-2.5 rounded border transition focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none ${
                config.template === t.id
                  ? 'bg-slate-800 border-blue-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-200">{t.name}</span>
                {config.template === t.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Header Alignment & Text Toggles */}
      <div>
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
          <Sliders className="w-4 h-4 text-slate-300" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Header Layout & Letter Case
          </h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Header Alignment</label>
            <select
              value={config.headerAlign}
              onChange={(e) => updateConfig('headerAlign', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            >
              <option value="center">Centered (ATS Standard)</option>
              <option value="left">Left Aligned</option>
              <option value="split">Split (Name Left, Details Right)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 cursor-pointer bg-slate-900 p-2 rounded border border-slate-800 text-xs text-slate-300 hover:border-slate-700">
              <input
                type="checkbox"
                checked={config.uppercaseName}
                onChange={(e) => updateConfig('uppercaseName', e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
              />
              <span>UPPERCASE Name</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-slate-900 p-2 rounded border border-slate-800 text-xs text-slate-300 hover:border-slate-700">
              <input
                type="checkbox"
                checked={config.uppercaseHeadings}
                onChange={(e) => updateConfig('uppercaseHeadings', e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
              />
              <span>UPPERCASE Headings</span>
            </label>
          </div>
        </div>
      </div>

      {/* 4. Typography */}
      <div>
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
          <Type className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Typography & Font Sizing
          </h3>
        </div>

        {/* Font Family selector */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Font Family</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {FONT_OPTIONS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => updateConfig('fontFamily', f.id)}
                className={`text-left p-2 rounded border transition focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none ${
                  config.fontFamily === f.id
                    ? 'bg-slate-800 border-purple-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-xs text-slate-200">{f.name}</div>
                <div className="text-[10px] text-slate-400">{f.type}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders for font sizes */}
        <div className="space-y-3 bg-slate-900/60 p-3 rounded border border-slate-800">
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Base Font Size</span>
              <span className="font-mono text-blue-400">{config.baseFontSize} pt</span>
            </div>
            <input
              type="range"
              min={8.0}
              max={12.0}
              step={0.1}
              value={config.baseFontSize}
              onChange={(e) => updateConfig('baseFontSize', parseFloat(e.target.value))}
              className="w-full accent-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none rounded"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Name Title Font Size</span>
              <span className="font-mono text-blue-400">{config.nameFontSize} pt</span>
            </div>
            <input
              type="range"
              min={16}
              max={28}
              step={1}
              value={config.nameFontSize}
              onChange={(e) => updateConfig('nameFontSize', parseFloat(e.target.value))}
              className="w-full accent-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none rounded"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Section Heading Font Size</span>
              <span className="font-mono text-blue-400">{config.sectionHeadingFontSize} pt</span>
            </div>
            <input
              type="range"
              min={10}
              max={15}
              step={0.5}
              value={config.sectionHeadingFontSize}
              onChange={(e) => updateConfig('sectionHeadingFontSize', parseFloat(e.target.value))}
              className="w-full accent-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none rounded"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Line Height (Leading)</span>
              <span className="font-mono text-blue-400">{config.lineHeight}</span>
            </div>
            <input
              type="range"
              min={1.15}
              max={1.65}
              step={0.02}
              value={config.lineHeight}
              onChange={(e) => updateConfig('lineHeight', parseFloat(e.target.value))}
              className="w-full accent-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none rounded"
            />
          </div>
        </div>
      </div>

      {/* 5. Page Margins & Section Gaps */}
      <div>
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
          <Sliders className="w-4 h-4 text-slate-300" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Page Margins & Spacing (mm)
          </h3>
        </div>

        <div className="space-y-3 bg-slate-900/60 p-3 rounded border border-slate-800">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Top / Bottom</span>
                <span className="font-mono text-slate-200">{config.pageMarginTop} mm</span>
              </div>
              <input
                type="range"
                min={6}
                max={24}
                step={1}
                value={config.pageMarginTop}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  updateConfig('pageMarginTop', val);
                  updateConfig('pageMarginBottom', val);
                }}
                className="w-full accent-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Left / Right</span>
                <span className="font-mono text-slate-200">{config.pageMarginLeft} mm</span>
              </div>
              <input
                type="range"
                min={6}
                max={24}
                step={1}
                value={config.pageMarginLeft}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  updateConfig('pageMarginLeft', val);
                  updateConfig('pageMarginRight', val);
                }}
                className="w-full accent-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none rounded"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Section Gap</span>
              <span className="font-mono text-slate-200">{config.sectionGap} mm</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={8.0}
              step={0.2}
              value={config.sectionGap}
              onChange={(e) => updateConfig('sectionGap', parseFloat(e.target.value))}
              className="w-full accent-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none rounded"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Item Gap</span>
              <span className="font-mono text-slate-200">{config.itemGap} mm</span>
            </div>
            <input
              type="range"
              min={0.8}
              max={6.0}
              step={0.2}
              value={config.itemGap}
              onChange={(e) => updateConfig('itemGap', parseFloat(e.target.value))}
              className="w-full accent-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none rounded"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Bullet Gap</span>
              <span className="font-mono text-slate-200">{config.bulletGap} mm</span>
            </div>
            <input
              type="range"
              min={0.4}
              max={4.0}
              step={0.2}
              value={config.bulletGap}
              onChange={(e) => updateConfig('bulletGap', parseFloat(e.target.value))}
              className="w-full accent-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none rounded"
            />
          </div>
        </div>
      </div>

      {/* 6. Section Heading Line & Bullet Styles */}
      <div>
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Section Divider & Bullet Style
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Section Divider Style</label>
            <select
              value={config.sectionHeadingStyle}
              onChange={(e) => updateConfig('sectionHeadingStyle', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            >
              <option value="line-under">Underline Full-Width (Classic ATS)</option>
              <option value="left-bar">Left Accent Bar</option>
              <option value="pill">Pill Badge</option>
              <option value="double-line">Double Line</option>
              <option value="minimal">Minimal (No Line)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Bullet Point Style</label>
            <select
              value={config.bulletStyle}
              onChange={(e) => updateConfig('bulletStyle', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            >
              <option value="disc">• Solid Disc</option>
              <option value="dash">- Hyphen</option>
              <option value="square">▪ Square</option>
              <option value="circle">○ Circle</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-300 mb-1">
            <span>Divider Line Thickness</span>
            <span className="font-mono text-cyan-400">{config.sectionLineWidth} px</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.5}
            value={config.sectionLineWidth}
            onChange={(e) => updateConfig('sectionLineWidth', parseFloat(e.target.value))}
            className="w-full accent-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded"
          />
        </div>
      </div>

      {/* 7. Accent Color Customization */}
      <div>
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
          <Palette className="w-4 h-4 text-pink-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Accent & Text Colors
          </h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Accent Color Presets</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => updateConfig('accentColor', color.hex)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs transition focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none ${
                    config.accentColor === color.hex
                      ? 'bg-slate-800 border-white text-white font-semibold'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full border border-slate-600" style={{ backgroundColor: color.hex }} />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5">
              <input
                type="color"
                value={config.accentColor}
                onChange={(e) => updateConfig('accentColor', e.target.value)}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="font-mono text-xs text-slate-300 uppercase">{config.accentColor}</span>
            </div>
            <span className="text-xs text-slate-300">Custom Accent Hex</span>
          </div>
        </div>
      </div>
    </div>
  );
};
