import React from 'react';
import { DesignConfig, TemplateId, FontFamily, PaperPreset } from '../../types/cv';
import { PAPER_PRESETS, getPaperDimensions } from '../../utils/paperDimensions';
import { Palette, Type, Sliders, Layout, SlidersHorizontal, Check, Lock, Unlock, Camera, Sparkles } from 'lucide-react';
import { Button, Card, Chip, Switch, Input } from '@heroui/react';

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
      <Card variant="secondary" className="border border-border">
        <Card.Content className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl transition ${config.forceOnePage ? 'bg-success/20 text-success' : 'bg-surface-tertiary text-muted'}`}>
                {config.forceOnePage ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <span>Force 1-Page Layout</span>
                  {config.forceOnePage && (
                    <Chip size="sm" variant="soft" color="success" className="h-4.5 text-[10px] px-1.5">
                      <Chip.Label>Locked</Chip.Label>
                    </Chip>
                  )}
                </div>
                <p className="text-[11px] text-muted">
                  {config.forceOnePage 
                    ? 'All content is mathematically constrained to 1 single page without spilling.' 
                    : 'Content will naturally flow to page 2 if entries exceed page height.'}
                </p>
              </div>
            </div>

            <Switch
              isSelected={config.forceOnePage}
              onChange={(checked) => updateConfig('forceOnePage', checked)}
              size="sm"
            >
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch>
          </div>

          <div className="pt-2.5 border-t border-border/70 flex items-center justify-between">
            <span className="text-[11px] text-muted">
              Auto-calculate ideal margins and font sizing for 1-page fit:
            </span>
            <Button
              size="sm"
              variant="secondary"
              onPress={handleAutoFitOnePage}
              className="text-xs font-medium h-7.5 px-2.5 shrink-0 ml-2"
            >
              <SlidersHorizontal className="w-3 h-3 mr-1 text-accent" />
              <span>Auto-Tune</span>
            </Button>
          </div>
        </Card.Content>
      </Card>

      {/* 1. Paper Size & Custom Dimensions Card */}
      <Card variant="secondary" className="border border-border">
        <Card.Header className="flex items-center gap-2 border-b border-border/70 pb-3 px-4 pt-3.5">
          <div className="p-1.5 rounded-lg bg-accent/15 text-accent">
            <Sliders className="w-4 h-4" />
          </div>
          <Card.Title className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Paper Size & Format
          </Card.Title>
        </Card.Header>

        <Card.Content className="p-4 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['a4', 'letter', 'legal', 'f4'] as PaperPreset[]).map((preset) => {
              const p = PAPER_PRESETS[preset];
              const isSelected = config.paperSize === preset;
              return (
                <Button
                  key={preset}
                  size="sm"
                  variant={isSelected ? 'primary' : 'secondary'}
                  onPress={() => handlePaperPresetChange(preset)}
                  className={`h-auto py-2 px-2.5 flex flex-col items-start rounded-xl text-left transition ${
                    isSelected ? 'shadow-sm' : 'border border-border'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-xs">{p.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-[10px] opacity-75 font-mono mt-0.5">
                    {p.widthMm} × {p.heightMm} mm
                  </span>
                </Button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-border/60">
            <Button
              size="sm"
              variant={config.paperSize === 'custom' ? 'primary' : 'ghost'}
              onPress={() => handlePaperPresetChange('custom')}
              className="w-full text-xs font-medium justify-between h-8 px-3 rounded-lg border border-border"
            >
              <span>Custom Dimensions (Free Size)</span>
              <span className="font-mono text-[11px] opacity-80">
                {currentDims.widthMm} × {currentDims.heightMm} mm
              </span>
            </Button>

            {config.paperSize === 'custom' && (
              <div className="grid grid-cols-2 gap-3 mt-3 bg-surface-tertiary/40 p-3 rounded-xl border border-border">
                <div>
                  <label className="block text-[11px] text-muted mb-1 font-medium">Width (mm)</label>
                  <Input
                    type="number"
                    variant="secondary"
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
                    className="w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-muted mb-1 font-medium">Height (mm)</label>
                  <Input
                    type="number"
                    variant="secondary"
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
                    className="w-full text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </Card.Content>
      </Card>

      {/* 2. Resume Template Style Card */}
      <Card variant="secondary" className="border border-border">
        <Card.Header className="flex items-center gap-2 border-b border-border/70 pb-3 px-4 pt-3.5">
          <div className="p-1.5 rounded-lg bg-accent/15 text-accent">
            <Layout className="w-4 h-4" />
          </div>
          <Card.Title className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Resume Template Style
          </Card.Title>
        </Card.Header>

        <Card.Content className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {TEMPLATE_OPTIONS.map((t) => {
              const isSelected = config.template === t.id;
              return (
                <Button
                  key={t.id}
                  variant={isSelected ? 'primary' : 'secondary'}
                  onPress={() => updateConfig('template', t.id)}
                  className={`h-auto p-3 flex flex-col items-start rounded-xl text-left transition ${
                    isSelected ? 'shadow-sm' : 'border border-border hover:bg-surface-tertiary'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-xs">{t.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <p className="text-[11px] opacity-75 mt-1 leading-snug font-normal">
                    {t.desc}
                  </p>
                </Button>
              );
            })}
          </div>
        </Card.Content>
      </Card>

      {/* 3. Header Layout & Letter Case Card */}
      <Card variant="secondary" className="border border-border">
        <Card.Header className="flex items-center gap-2 border-b border-border/70 pb-3 px-4 pt-3.5">
          <div className="p-1.5 rounded-lg bg-accent/15 text-accent">
            <Sliders className="w-4 h-4" />
          </div>
          <Card.Title className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Header Layout & Case
          </Card.Title>
        </Card.Header>

        <Card.Content className="p-4 space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Header Alignment</label>
            <div className="flex gap-1 bg-surface-tertiary/60 p-1 rounded-xl border border-border">
              {[
                { id: 'center', label: 'Centered (ATS Standard)' },
                { id: 'left', label: 'Left Aligned' },
                { id: 'split', label: 'Split (Name Left, Info Right)' },
              ].map((item) => (
                <Button
                  key={item.id}
                  size="sm"
                  variant={config.headerAlign === item.id ? 'primary' : 'ghost'}
                  onPress={() => updateConfig('headerAlign', item.id)}
                  className="flex-1 h-7.5 text-[11px] px-2 font-medium rounded-lg"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-center justify-between bg-surface-tertiary/50 p-2.5 rounded-xl border border-border">
              <span className="text-xs font-medium text-foreground">UPPERCASE Name</span>
              <Switch
                isSelected={config.uppercaseName}
                onChange={(checked) => updateConfig('uppercaseName', checked)}
                size="sm"
              >
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
              </Switch>
            </div>

            <div className="flex items-center justify-between bg-surface-tertiary/50 p-2.5 rounded-xl border border-border">
              <span className="text-xs font-medium text-foreground">UPPERCASE Headings</span>
              <Switch
                isSelected={config.uppercaseHeadings}
                onChange={(checked) => updateConfig('uppercaseHeadings', checked)}
                size="sm"
              >
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
              </Switch>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* 4. Profile Photo Layout & Shape Card */}
      <Card variant="secondary" className="border border-border">
        <Card.Header className="flex items-center gap-2 border-b border-border/70 pb-3 px-4 pt-3.5">
          <div className="p-1.5 rounded-lg bg-accent/15 text-accent">
            <Camera className="w-4 h-4" />
          </div>
          <Card.Title className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Profile Photo Layout & Shape
          </Card.Title>
        </Card.Header>

        <Card.Content className="p-4 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Avatar Shape</label>
              <div className="flex gap-1 bg-surface-tertiary/60 p-1 rounded-xl border border-border">
                {(['circle', 'rounded', 'square'] as const).map((shape) => (
                  <Button
                    key={shape}
                    size="sm"
                    variant={(config.photoShape || 'circle') === shape ? 'primary' : 'ghost'}
                    onPress={() => updateConfig('photoShape', shape)}
                    className="flex-1 h-7 text-[11px] px-1 font-medium rounded-lg"
                  >
                    {shape === 'circle' ? 'Circle' : shape === 'rounded' ? 'Rounded' : 'Square'}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Aspect Ratio</label>
              <div className="flex gap-1 bg-surface-tertiary/60 p-1 rounded-xl border border-border">
                {(['1:1', '3:4'] as const).map((ratio) => (
                  <Button
                    key={ratio}
                    size="sm"
                    variant={(config.photoAspectRatio || '1:1') === ratio ? 'primary' : 'ghost'}
                    onPress={() => {
                      if (ratio === '3:4' && config.photoShape === 'circle') {
                        onChange({ ...config, photoAspectRatio: ratio, photoShape: 'rounded' });
                      } else {
                        updateConfig('photoAspectRatio', ratio);
                      }
                    }}
                    className="flex-1 h-7 text-[11px] px-1 font-medium rounded-lg"
                  >
                    {ratio === '1:1' ? '1:1 Sq' : '3:4 Pas'}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Header Placement</label>
              <div className="flex gap-1 bg-surface-tertiary/60 p-1 rounded-xl border border-border">
                {(['right', 'left'] as const).map((pos) => (
                  <Button
                    key={pos}
                    size="sm"
                    variant={(config.photoPosition || 'right') === pos ? 'primary' : 'ghost'}
                    onPress={() => updateConfig('photoPosition', pos)}
                    className="flex-1 h-7 text-[11px] px-1 font-medium rounded-lg"
                  >
                    {pos === 'right' ? 'Right' : 'Left'}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-muted mb-1.5">
              <span>Photo Size (Width)</span>
              <span className="font-mono text-accent font-semibold">
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
              className="w-full accent-accent rounded"
            />
          </div>

          <div className="flex items-center justify-between bg-surface-tertiary/50 p-2.5 rounded-xl border border-border">
            <span className="text-xs font-medium text-foreground">Subtle outline border around photo</span>
            <Switch
              isSelected={config.photoBorder !== false}
              onChange={(checked) => updateConfig('photoBorder', checked)}
              size="sm"
            >
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch>
          </div>
        </Card.Content>
      </Card>

      {/* 5. Typography Card */}
      <Card variant="secondary" className="border border-border">
        <Card.Header className="flex items-center gap-2 border-b border-border/70 pb-3 px-4 pt-3.5">
          <div className="p-1.5 rounded-lg bg-accent/15 text-accent">
            <Type className="w-4 h-4" />
          </div>
          <Card.Title className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Typography & Font Sizing
          </Card.Title>
        </Card.Header>

        <Card.Content className="p-4 space-y-3.5">
          {/* Font family selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {FONT_OPTIONS.map((f) => {
              const isSelected = config.fontFamily === f.id;
              return (
                <Button
                  key={f.id}
                  size="sm"
                  variant={isSelected ? 'primary' : 'secondary'}
                  onPress={() => updateConfig('fontFamily', f.id)}
                  className={`h-auto py-2 px-2.5 flex flex-col items-start rounded-xl text-left transition ${
                    isSelected ? 'shadow-sm' : 'border border-border hover:bg-surface-tertiary'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-xs">{f.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-[10px] opacity-75 mt-0.5">{f.type}</span>
                </Button>
              );
            })}
          </div>

          {/* Sliders for font sizes */}
          <div className="space-y-3 bg-surface-tertiary/40 p-3.5 rounded-xl border border-border">
            <div>
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>Base Font Size</span>
                <span className="font-mono text-accent font-semibold">{config.baseFontSize} pt</span>
              </div>
              <input
                type="range"
                min={8.0}
                max={12.0}
                step={0.1}
                value={config.baseFontSize}
                onChange={(e) => updateConfig('baseFontSize', parseFloat(e.target.value))}
                className="w-full accent-accent rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>Name Title Font Size</span>
                <span className="font-mono text-accent font-semibold">{config.nameFontSize} pt</span>
              </div>
              <input
                type="range"
                min={16}
                max={28}
                step={1}
                value={config.nameFontSize}
                onChange={(e) => updateConfig('nameFontSize', parseFloat(e.target.value))}
                className="w-full accent-accent rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>Section Heading Font Size</span>
                <span className="font-mono text-accent font-semibold">{config.sectionHeadingFontSize} pt</span>
              </div>
              <input
                type="range"
                min={10}
                max={15}
                step={0.5}
                value={config.sectionHeadingFontSize}
                onChange={(e) => updateConfig('sectionHeadingFontSize', parseFloat(e.target.value))}
                className="w-full accent-accent rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>Line Height (Leading)</span>
                <span className="font-mono text-accent font-semibold">{config.lineHeight}</span>
              </div>
              <input
                type="range"
                min={1.15}
                max={1.65}
                step={0.02}
                value={config.lineHeight}
                onChange={(e) => updateConfig('lineHeight', parseFloat(e.target.value))}
                className="w-full accent-accent rounded"
              />
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* 6. Page Margins & Section Gaps Card */}
      <Card variant="secondary" className="border border-border">
        <Card.Header className="flex items-center gap-2 border-b border-border/70 pb-3 px-4 pt-3.5">
          <div className="p-1.5 rounded-lg bg-accent/15 text-accent">
            <Sliders className="w-4 h-4" />
          </div>
          <Card.Title className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Page Margins & Spacing (mm)
          </Card.Title>
        </Card.Header>

        <Card.Content className="p-4 space-y-3.5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-tertiary/40 p-3 rounded-xl border border-border">
            <div>
              <label className="block text-[11px] text-muted mb-1 font-medium">Top Margin</label>
              <Input
                type="number"
                variant="secondary"
                value={String(config.pageMarginTop)}
                onChange={(e) => updateConfig('pageMarginTop', parseFloat(e.target.value) || 0)}
                className="w-full text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-muted mb-1 font-medium">Bottom Margin</label>
              <Input
                type="number"
                variant="secondary"
                value={String(config.pageMarginBottom)}
                onChange={(e) => updateConfig('pageMarginBottom', parseFloat(e.target.value) || 0)}
                className="w-full text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-muted mb-1 font-medium">Left Margin</label>
              <Input
                type="number"
                variant="secondary"
                value={String(config.pageMarginLeft)}
                onChange={(e) => updateConfig('pageMarginLeft', parseFloat(e.target.value) || 0)}
                className="w-full text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-muted mb-1 font-medium">Right Margin</label>
              <Input
                type="number"
                variant="secondary"
                value={String(config.pageMarginRight)}
                onChange={(e) => updateConfig('pageMarginRight', parseFloat(e.target.value) || 0)}
                className="w-full text-xs"
              />
            </div>
          </div>

          <div className="space-y-3 bg-surface-tertiary/40 p-3.5 rounded-xl border border-border">
            <div>
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>Section Gap</span>
                <span className="font-mono text-accent font-semibold">{config.sectionGap} mm</span>
              </div>
              <input
                type="range"
                min={1.5}
                max={9.0}
                step={0.5}
                value={config.sectionGap}
                onChange={(e) => updateConfig('sectionGap', parseFloat(e.target.value))}
                className="w-full accent-accent rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>Entry Item Gap</span>
                <span className="font-mono text-accent font-semibold">{config.itemGap} mm</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={7.0}
                step={0.5}
                value={config.itemGap}
                onChange={(e) => updateConfig('itemGap', parseFloat(e.target.value))}
                className="w-full accent-accent rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>Bullet Point Gap</span>
                <span className="font-mono text-accent font-semibold">{config.bulletGap} mm</span>
              </div>
              <input
                type="range"
                min={0.4}
                max={4.0}
                step={0.2}
                value={config.bulletGap}
                onChange={(e) => updateConfig('bulletGap', parseFloat(e.target.value))}
                className="w-full accent-accent rounded"
              />
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* 7. Section Heading Line & Bullet Styles Card */}
      <Card variant="secondary" className="border border-border">
        <Card.Header className="flex items-center gap-2 border-b border-border/70 pb-3 px-4 pt-3.5">
          <div className="p-1.5 rounded-lg bg-accent/15 text-accent">
            <Sliders className="w-4 h-4" />
          </div>
          <Card.Title className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Divider & Bullet Style
          </Card.Title>
        </Card.Header>

        <Card.Content className="p-4 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Section Divider Style</label>
              <select
                value={config.sectionHeadingStyle}
                onChange={(e) => updateConfig('sectionHeadingStyle', e.target.value)}
                className="w-full bg-surface-tertiary border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent"
              >
                <option value="line-under">Underline Full-Width (Classic ATS)</option>
                <option value="left-bar">Left Accent Bar</option>
                <option value="pill">Pill Badge</option>
                <option value="double-line">Double Line</option>
                <option value="minimal">Minimal (No Line)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Bullet Point Style</label>
              <select
                value={config.bulletStyle}
                onChange={(e) => updateConfig('bulletStyle', e.target.value)}
                className="w-full bg-surface-tertiary border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-accent"
              >
                <option value="disc">• Solid Disc</option>
                <option value="dash">- Hyphen</option>
                <option value="square">▪ Square</option>
                <option value="circle">○ Circle</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-muted mb-1">
              <span>Divider Line Thickness</span>
              <span className="font-mono text-accent font-semibold">{config.sectionLineWidth} px</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.5}
              value={config.sectionLineWidth}
              onChange={(e) => updateConfig('sectionLineWidth', parseFloat(e.target.value))}
              className="w-full accent-accent rounded"
            />
          </div>
        </Card.Content>
      </Card>

      {/* 8. Accent Color Customization Card */}
      <Card variant="secondary" className="border border-border">
        <Card.Header className="flex items-center gap-2 border-b border-border/70 pb-3 px-4 pt-3.5">
          <div className="p-1.5 rounded-lg bg-accent/15 text-accent">
            <Palette className="w-4 h-4" />
          </div>
          <Card.Title className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Accent & Palette Colors
          </Card.Title>
        </Card.Header>

        <Card.Content className="p-4 space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-muted mb-2">Accent Presets</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((color) => {
                const isSelected = config.accentColor === color.hex;
                return (
                  <Button
                    key={color.hex}
                    size="sm"
                    variant={isSelected ? 'primary' : 'secondary'}
                    onPress={() => updateConfig('accentColor', color.hex)}
                    className={`h-8 px-2.5 text-xs rounded-xl flex items-center gap-1.5 transition ${
                      isSelected ? 'shadow-sm' : 'border border-border'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0 shadow-xs"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-2.5 bg-surface-tertiary px-3 py-1.5 rounded-xl border border-border">
              <input
                type="color"
                value={config.accentColor}
                onChange={(e) => updateConfig('accentColor', e.target.value)}
                className="w-6 h-6 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <span className="font-mono text-xs text-foreground uppercase font-semibold tracking-wider">
                {config.accentColor}
              </span>
            </div>
            <span className="text-xs text-muted">Custom Hex Picker</span>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};
