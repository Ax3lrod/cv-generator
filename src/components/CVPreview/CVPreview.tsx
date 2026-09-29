import React, { useRef, useEffect, useState } from 'react';
import { CVData, DesignConfig } from '../../types/cv';
import { ATSClassicTemplate } from './templates/ATSClassicTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { TechTemplate } from './templates/TechTemplate';
import { getPaperDimensions } from '../../utils/paperDimensions';
import { Lock, FileText, Layers } from 'lucide-react';
import { Chip } from '@heroui/react';

interface CVPreviewProps {
  cvData: CVData;
  designConfig: DesignConfig;
  scale?: number;
  showPageBreaks?: boolean;
}

export const CVPreview: React.FC<CVPreviewProps> = ({
  cvData,
  designConfig,
  scale = 1,
  showPageBreaks = true,
}) => {
  const paperRef = useRef<HTMLDivElement>(null);
  const innerContentRef = useRef<HTMLDivElement>(null);

  const [viewMode, setViewMode] = useState<'separated' | 'continuous'>('separated');
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [autoScaleFactor, setAutoScaleFactor] = useState<number>(1);

  const { widthMm, heightMm } = getPaperDimensions(designConfig);

  // 1mm ≈ 3.779527px at standard 96 DPI
  const pageHeightPx = Math.round(heightMm * 3.779527);
  const innerHeightMm = heightMm - designConfig.pageMarginTop - designConfig.pageMarginBottom;
  const innerHeightPx = Math.round(innerHeightMm * 3.779527);

  // Add 4mm safety buffer so print engine metrics never overrun the bottom margin in force-one-page mode
  const safetyBufferMm = 4;
  const availableInnerHeightPx = Math.round(
    (innerHeightMm - safetyBufferMm) * 3.779527
  );

  // Measure content and calculate force-1-page scaling factor
  useEffect(() => {
    if (innerContentRef.current) {
      const naturalHeight = innerContentRef.current.scrollHeight;
      setContentHeight(naturalHeight);

      if (designConfig.forceOnePage && naturalHeight > availableInnerHeightPx) {
        // Calculate exact scale factor needed to lock content into 1 page with safe bottom margin
        const neededScale = Math.max(0.6, availableInnerHeightPx / naturalHeight);
        setAutoScaleFactor(neededScale);
      } else {
        setAutoScaleFactor(1);
      }
    }
  }, [cvData, designConfig, availableInnerHeightPx]);

  const isOverflowingPageOne = contentHeight > innerHeightPx;
  const estimatedPages = designConfig.forceOnePage ? 1 : Math.max(1, Math.ceil(contentHeight / innerHeightPx));

  const renderTemplate = () => {
    switch (designConfig.template) {
      case 'modern':
        return <ModernTemplate cvData={cvData} config={designConfig} />;
      case 'executive':
        return <ExecutiveTemplate cvData={cvData} config={designConfig} />;
      case 'tech':
        return <TechTemplate cvData={cvData} config={designConfig} />;
      case 'ats-classic':
      default:
        return <ATSClassicTemplate cvData={cvData} config={designConfig} />;
    }
  };

  const fontFamilies: Record<string, string> = {
    'eb-garamond': "'EB Garamond', Garamond, serif",
    'inter': "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    'merriweather': "'Merriweather', Georgia, serif",
    'roboto': "'Roboto', sans-serif",
    'jetbrains-mono': "'JetBrains Mono', monospace",
  };

  const getPageSizeRule = () => {
    switch (designConfig.paperSize) {
      case 'a4':
        return 'a4 portrait';
      case 'letter':
        return 'letter portrait';
      case 'legal':
        return 'legal portrait';
      case 'f4':
        return '215mm 330mm';
      case 'custom':
      default:
        return `${widthMm}mm ${heightMm}mm`;
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Dynamic print @page rule matching exact millimeter dimensions and uniform per-page margins */}
      <style>{`
        @media print {
          @page {
            size: ${getPageSizeRule()};
            margin: 0;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }
          .no-print,
          .cv-screen-separated,
          #cv-print-target {
            display: none !important;
            visibility: hidden !important;
          }
          .cv-print-container {
            display: block !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }
          .cv-paper-sheet {
            display: block !important;
            width: ${widthMm}mm !important;
            height: ${heightMm}mm !important;
            max-height: ${heightMm}mm !important;
            min-height: ${heightMm}mm !important;
            box-sizing: border-box !important;
            padding-top: ${designConfig.pageMarginTop}mm !important;
            padding-bottom: ${designConfig.pageMarginBottom}mm !important;
            padding-left: ${designConfig.pageMarginLeft}mm !important;
            padding-right: ${designConfig.pageMarginRight}mm !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            border: none !important;
            overflow: hidden !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            background: #ffffff !important;
          }
          .cv-paper-sheet:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          .cv-paper-sheet header,
          .cv-paper-sheet .cv-header {
            display: block !important;
            visibility: visible !important;
          }
          h1, h2, h3, .section-header, .cv-section-heading {
            break-after: avoid-page !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          .cv-entry, .cv-item, .cv-block, li {
            break-inside: avoid-page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Page status & view mode toolbar (preview only, hidden on print) */}
      <div className="no-print mb-4 flex items-center justify-between w-full max-w-[215mm] text-xs px-2 text-muted gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Paper Dimensions Chip */}
          <Chip size="sm" variant="secondary">
            <Chip.Label className="font-mono flex items-center gap-1">
              <FileText className="w-3 h-3 text-muted" />
              {designConfig.paperSize.toUpperCase()} ({widthMm} × {heightMm} mm)
            </Chip.Label>
          </Chip>

          {/* Page Status Chip */}
          {designConfig.forceOnePage ? (
            <Chip size="sm" variant="soft" color="success">
              <Chip.Label className="flex items-center gap-1 font-medium">
                <Lock className="w-3 h-3 text-success" />
                1 Page Locked
                {autoScaleFactor < 1 && (
                  <span className="text-[10px] font-mono opacity-90 ml-1">
                    ({Math.round(autoScaleFactor * 100)}% fit)
                  </span>
                )}
              </Chip.Label>
            </Chip>
          ) : (
            <Chip
              size="sm"
              variant="soft"
              color={isOverflowingPageOne ? 'warning' : 'success'}
            >
              <Chip.Label className="font-medium">
                {estimatedPages === 1 ? '1 Page' : `${estimatedPages} Pages`}
              </Chip.Label>
            </Chip>
          )}
        </div>

        {/* View Mode Segmented Switch (Separated Pages vs Continuous) */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center p-0.5 rounded-lg bg-surface-secondary border border-border shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('separated')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === 'separated'
                  ? 'bg-accent text-white shadow-xs font-semibold'
                  : 'text-muted hover:text-foreground hover:bg-surface-tertiary/40'
              }`}
              title="View resume separated into individual A4 pages"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Separated Pages</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('continuous')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === 'continuous'
                  ? 'bg-accent text-white shadow-xs font-semibold'
                  : 'text-muted hover:text-foreground hover:bg-surface-tertiary/40'
              }`}
              title="View resume as a continuous document with page cut indicator"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Continuous</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scalable Container for Live Preview */}
      <div 
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top center',
          transition: 'transform 0.15s ease-out' 
        }}
        className="cv-preview-wrapper"
      >
        {/* VIEW 1: Separated Pages Mode (On Screen) */}
        {viewMode === 'separated' && (
          <div className="cv-screen-separated no-print flex flex-col items-center gap-8 w-full">
            {Array.from({ length: estimatedPages }).map((_, pageIndex) => (
              <div key={pageIndex} className="flex flex-col items-center">
                {/* Individual Sheet Top Indicator */}
                <div className="flex items-center justify-between w-full max-w-[215mm] mb-1.5 px-2 text-xs text-muted">
                  <span className="font-semibold text-foreground/80 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent inline-block" />
                    Page {pageIndex + 1} of {estimatedPages}
                  </span>
                  <span className="font-mono text-[11px] text-muted">
                    {widthMm} × {heightMm} mm
                  </span>
                </div>

                {/* Individual Sheet Card */}
                <div
                  className="cv-paper-sheet relative bg-white text-slate-900 shadow-2xl transition-all duration-200"
                  style={{
                    width: `${widthMm}mm`,
                    height: `${heightMm}mm`,
                    boxSizing: 'border-box',
                    paddingTop: `${designConfig.pageMarginTop}mm`,
                    paddingBottom: `${designConfig.pageMarginBottom}mm`,
                    paddingLeft: `${designConfig.pageMarginLeft}mm`,
                    paddingRight: `${designConfig.pageMarginRight}mm`,
                    overflow: 'hidden',
                    fontFamily: fontFamilies[designConfig.fontFamily] || fontFamilies['inter'],
                    fontSize: `${designConfig.baseFontSize}pt`,
                    lineHeight: designConfig.lineHeight,
                    color: designConfig.textColor,
                  }}
                >
                  {/* Viewport clipping exactly to one page of content */}
                  <div
                    className="w-full h-full relative"
                    style={{
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        transform: designConfig.forceOnePage && autoScaleFactor < 1
                          ? `scale(${autoScaleFactor})`
                          : `translateY(-${pageIndex * innerHeightPx}px)`,
                        transformOrigin: 'top left',
                        width: designConfig.forceOnePage && autoScaleFactor < 1
                          ? `${(1 / autoScaleFactor) * 100}%`
                          : '100%',
                      }}
                    >
                      {renderTemplate()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 2: Continuous Mode (On Screen) & Primary Measurement Target */}
        <div
          id="cv-print-target"
          ref={paperRef}
          className={`cv-paper relative bg-white text-slate-900 transition-all duration-200 ${
            viewMode === 'separated'
              ? 'absolute -left-[99999px] top-0 opacity-0 pointer-events-none'
              : 'shadow-2xl'
          }`}
          style={{
            width: `${widthMm}mm`,
            height: designConfig.forceOnePage ? `${heightMm}mm` : undefined,
            minHeight: `${heightMm}mm`,
            maxHeight: designConfig.forceOnePage ? `${heightMm}mm` : undefined,
            overflow: designConfig.forceOnePage ? 'hidden' : 'visible',
            paddingTop: `${designConfig.pageMarginTop}mm`,
            paddingBottom: `${designConfig.pageMarginBottom}mm`,
            paddingLeft: `${designConfig.pageMarginLeft}mm`,
            paddingRight: `${designConfig.pageMarginRight}mm`,
            fontFamily: fontFamilies[designConfig.fontFamily] || fontFamilies['inter'],
            fontSize: `${designConfig.baseFontSize}pt`,
            lineHeight: designConfig.lineHeight,
            color: designConfig.textColor,
            boxSizing: 'border-box',
          }}
        >
          {/* Visual Page Break Indicator when forceOnePage is OFF in continuous view */}
          {viewMode === 'continuous' && !designConfig.forceOnePage && showPageBreaks && contentHeight > availableInnerHeightPx && (
            <div 
              className="page-overflow-indicator no-print absolute left-0 right-0 border-b-2 border-dashed border-rose-400 pointer-events-none z-20 flex justify-end pr-4 text-[10px] font-mono text-rose-600 uppercase font-semibold"
              style={{ top: `${pageHeightPx}px` }}
            >
              <span className="bg-rose-100 px-2 py-0.5 rounded-t border border-rose-300">
                End of Page 1
              </span>
            </div>
          )}

          {/* Inner Content with dynamic 1-page scaling */}
          <div
            className="w-full"
            style={{
              maxHeight: designConfig.forceOnePage
                ? `calc(${heightMm}mm - ${designConfig.pageMarginTop}mm - ${designConfig.pageMarginBottom}mm)`
                : undefined,
              overflow: designConfig.forceOnePage ? 'hidden' : 'visible',
            }}
          >
            <div
              ref={innerContentRef}
              className="w-full"
              style={
                designConfig.forceOnePage && autoScaleFactor < 1
                  ? {
                      transform: `scale(${autoScaleFactor})`,
                      transformOrigin: 'top left',
                      width: `${(1 / autoScaleFactor) * 100}%`,
                    }
                  : undefined
              }
            >
              {renderTemplate()}
            </div>
          </div>
        </div>

        {/* VIEW 3: Dedicated Print Container for High-Fidelity Multi-Page Print */}
        <div className="hidden print:block cv-print-container">
          {Array.from({ length: estimatedPages }).map((_, pageIndex) => (
            <div
              key={pageIndex}
              className="cv-paper-sheet"
              style={{
                width: `${widthMm}mm`,
                height: `${heightMm}mm`,
                maxHeight: `${heightMm}mm`,
                minHeight: `${heightMm}mm`,
                boxSizing: 'border-box',
                paddingTop: `${designConfig.pageMarginTop}mm`,
                paddingBottom: `${designConfig.pageMarginBottom}mm`,
                paddingLeft: `${designConfig.pageMarginLeft}mm`,
                paddingRight: `${designConfig.pageMarginRight}mm`,
                overflow: 'hidden',
                fontFamily: fontFamilies[designConfig.fontFamily] || fontFamilies['inter'],
                fontSize: `${designConfig.baseFontSize}pt`,
                lineHeight: designConfig.lineHeight,
                color: designConfig.textColor,
                background: '#ffffff',
              }}
            >
              <div className="w-full h-full relative" style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    transform: designConfig.forceOnePage && autoScaleFactor < 1
                      ? `scale(${autoScaleFactor})`
                      : `translateY(-${pageIndex * innerHeightPx}px)`,
                    transformOrigin: 'top left',
                    width: designConfig.forceOnePage && autoScaleFactor < 1
                      ? `${(1 / autoScaleFactor) * 100}%`
                      : '100%',
                  }}
                >
                  {renderTemplate()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
