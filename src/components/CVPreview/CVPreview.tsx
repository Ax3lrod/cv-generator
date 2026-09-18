import React, { useRef, useEffect, useState } from 'react';
import { CVData, DesignConfig } from '../../types/cv';
import { ATSClassicTemplate } from './templates/ATSClassicTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { TechTemplate } from './templates/TechTemplate';
import { getPaperDimensions } from '../../utils/paperDimensions';
import { Lock, FileText, CheckCircle2 } from 'lucide-react';

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

  const [contentHeight, setContentHeight] = useState<number>(0);
  const [autoScaleFactor, setAutoScaleFactor] = useState<number>(1);

  const { widthMm, heightMm } = getPaperDimensions(designConfig);

  // 1mm ≈ 3.779527px at standard 96 DPI
  const pageHeightPx = Math.round(heightMm * 3.779527);
  const availableInnerHeightPx = Math.round(
    (heightMm - designConfig.pageMarginTop - designConfig.pageMarginBottom) * 3.779527
  );

  // Measure content and calculate force-1-page scaling factor
  useEffect(() => {
    if (innerContentRef.current) {
      const naturalHeight = innerContentRef.current.scrollHeight;
      setContentHeight(naturalHeight);

      if (designConfig.forceOnePage && naturalHeight > availableInnerHeightPx) {
        // Calculate exact scale factor needed to lock content into 1 page
        const neededScale = Math.max(0.6, availableInnerHeightPx / naturalHeight);
        setAutoScaleFactor(neededScale);
      } else {
        setAutoScaleFactor(1);
      }
    }
  }, [cvData, designConfig, availableInnerHeightPx]);

  const isOverflowingPageOne = contentHeight > availableInnerHeightPx;
  const estimatedPages = Math.max(1, Math.ceil(contentHeight / availableInnerHeightPx));

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

  return (
    <div className="relative flex flex-col items-center">
      {/* Dynamic print @page rule matching exact millimeter dimensions */}
      <style>{`
        @media print {
          @page {
            size: ${widthMm}mm ${heightMm}mm !important;
            margin: 0mm !important;
          }
          .cv-paper {
            width: ${widthMm}mm !important;
            min-height: ${heightMm}mm !important;
            ${designConfig.forceOnePage ? `height: ${heightMm}mm !important; max-height: ${heightMm}mm !important; overflow: hidden !important;` : ''}
          }
        }
      `}</style>

      {/* Page status toolbar (preview only, hidden on print) */}
      <div className="no-print mb-3 flex items-center justify-between w-full max-w-[215mm] text-xs px-2 text-slate-300">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
            <FileText className="w-3 h-3 text-slate-400" />
            {designConfig.paperSize.toUpperCase()} ({widthMm} × {heightMm} mm)
          </span>

          {designConfig.forceOnePage ? (
            <span className="px-2 py-0.5 rounded font-medium bg-emerald-950 text-emerald-200 border border-emerald-700 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              1 Page Locked
              {autoScaleFactor < 1 && (
                <span className="text-[10px] font-mono text-emerald-300 ml-1">
                  ({Math.round(autoScaleFactor * 100)}% fit scale)
                </span>
              )}
            </span>
          ) : (
            <span className={`px-2 py-0.5 rounded font-medium ${
              isOverflowingPageOne 
                ? 'bg-amber-950 text-amber-200 border border-amber-800' 
                : 'bg-emerald-950 text-emerald-200 border border-emerald-800'
            }`}>
              {estimatedPages === 1 ? '1 Page' : `${estimatedPages} Pages`}
            </span>
          )}
        </div>

        {!designConfig.forceOnePage && isOverflowingPageOne && (
          <span className="text-amber-300 text-[11px] font-medium">
            Tip: Enable "Force 1-Page" in Design tab to lock content to 1 page
          </span>
        )}
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
        <div
          id="cv-print-target"
          ref={paperRef}
          className="cv-paper relative bg-white text-slate-900 shadow-2xl transition-all duration-200"
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
          {/* Visual Page Break Indicator when forceOnePage is OFF */}
          {!designConfig.forceOnePage && showPageBreaks && contentHeight > availableInnerHeightPx && (
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
            ref={innerContentRef}
            className="w-full"
            style={
              designConfig.forceOnePage && autoScaleFactor < 1
                ? {
                    transform: `scale(${autoScaleFactor})`,
                    transformOrigin: 'top center',
                    width: '100%',
                  }
                : undefined
            }
          >
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};
