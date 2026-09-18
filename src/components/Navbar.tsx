import React from 'react';
import { 
  FileCheck2, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye, 
  Edit3 
} from 'lucide-react';

interface Props {
  scale: number;
  onScaleChange: (scale: number) => void;
  onPrint: () => void;
  mobileView: 'editor' | 'preview';
  onToggleMobileView: (view: 'editor' | 'preview') => void;
}

export const Navbar: React.FC<Props> = ({
  scale,
  onScaleChange,
  onPrint,
  mobileView,
  onToggleMobileView,
}) => {
  return (
    <header className="no-print h-14 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-30">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center border border-blue-500/30">
          <FileCheck2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-sm text-slate-100">
            CV Studio
          </h1>
          <p className="text-[11px] text-slate-300 hidden sm:block">
            ATS & Customizable Resume Generator
          </p>
        </div>
      </div>

      {/* Center Zoom Controls (Hidden on small mobile) */}
      <div className="hidden md:flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
        <button
          type="button"
          onClick={() => onScaleChange(Math.max(0.4, scale - 0.1))}
          className="p-1 text-slate-300 hover:text-white transition rounded focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span className="text-xs font-mono text-slate-200 w-12 text-center select-none">
          {Math.round(scale * 100)}%
        </span>

        <button
          type="button"
          onClick={() => onScaleChange(Math.min(1.6, scale + 0.1))}
          className="p-1 text-slate-300 hover:text-white transition rounded focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onScaleChange(0.9)}
          className="p-1 text-slate-300 hover:text-white transition rounded border-l border-slate-800 ml-1 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
          title="Reset Zoom"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Mobile View Toggle (Only on screens < lg) */}
        <div className="flex lg:hidden bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => onToggleMobileView('editor')}
            className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1.5 transition focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none ${
              mobileView === 'editor' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            Editor
          </button>
          <button
            type="button"
            onClick={() => onToggleMobileView('preview')}
            className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1.5 transition focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none ${
              mobileView === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" />
            Preview
          </button>
        </div>

        {/* Quick Print / Export Button */}
        <button
          type="button"
          onClick={onPrint}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Print / Export PDF</span>
          <span className="sm:hidden">PDF</span>
        </button>
      </div>
    </header>
  );
};
