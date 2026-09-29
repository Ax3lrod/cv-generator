import React from 'react';
import { 
  FileCheck2, 
  Printer, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye, 
  Edit3,
  Loader2
} from 'lucide-react';
import { Button } from '@heroui/react';

interface Props {
  scale: number;
  onScaleChange: (scale: number) => void;
  onPrint: () => void;
  onDownloadPDF?: () => void;
  isDownloading?: boolean;
  mobileView: 'editor' | 'preview';
  onToggleMobileView: (view: 'editor' | 'preview') => void;
}

export const Navbar: React.FC<Props> = ({
  scale,
  onScaleChange,
  onPrint,
  onDownloadPDF,
  isDownloading = false,
  mobileView,
  onToggleMobileView,
}) => {
  return (
    <header className="no-print h-14 bg-surface border-b border-border px-4 flex items-center justify-between shrink-0 z-30 transition-colors">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs border border-border">
          <FileCheck2 className="w-4 h-4" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight text-foreground leading-none">
            VitaGo
          </h1>
          <p className="text-[11px] text-muted hidden sm:block mt-1">
            Your Curriculum Vitae on the Go
          </p>
        </div>
      </div>

      {/* Center Zoom Controls (Desktop & Tablet) */}
      <div className="hidden md:flex items-center gap-1 bg-surface-secondary border border-border rounded-xl px-1.5 py-1">
        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          onPress={() => onScaleChange(Math.max(0.4, scale - 0.1))}
          className="text-foreground hover:bg-surface-tertiary transition rounded-lg h-7 w-7"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </Button>

        <span className="text-xs font-mono font-medium text-foreground w-12 text-center select-none">
          {Math.round(scale * 100)}%
        </span>

        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          onPress={() => onScaleChange(Math.min(1.6, scale + 0.1))}
          className="text-foreground hover:bg-surface-tertiary transition rounded-lg h-7 w-7"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </Button>

        <div className="h-4 w-px bg-border mx-0.5" />

        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          onPress={() => onScaleChange(0.9)}
          className="text-muted hover:text-foreground hover:bg-surface-tertiary transition rounded-lg h-7 w-7"
          aria-label="Reset Zoom"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Mobile View Toggle (Only on screens < lg) */}
        <div className="flex lg:hidden bg-surface-secondary p-1 rounded-xl border border-border">
          <Button
            size="sm"
            variant={mobileView === 'editor' ? 'primary' : 'ghost'}
            onPress={() => onToggleMobileView('editor')}
            className="h-7 px-2.5 text-xs font-medium rounded-lg"
          >
            <Edit3 className="w-3 h-3 mr-1" />
            Editor
          </Button>
          <Button
            size="sm"
            variant={mobileView === 'preview' ? 'primary' : 'ghost'}
            onPress={() => onToggleMobileView('preview')}
            className="h-7 px-2.5 text-xs font-medium rounded-lg"
          >
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </Button>
        </div>

        {/* Browser Native Print Button */}
        <Button
          variant="outline"
          size="sm"
          onPress={onPrint}
          className="hidden sm:inline-flex text-xs font-medium rounded-lg border-border hover:bg-surface-secondary"
        >
          <Printer className="w-3.5 h-3.5 mr-1" />
          <span>Print Dialog</span>
        </Button>

        {/* Primary Vector PDF Download Button */}
        {onDownloadPDF && (
          <Button
            variant="primary"
            size="sm"
            isDisabled={isDownloading}
            onPress={onDownloadPDF}
            className="font-semibold text-xs rounded-lg shadow-sm"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 mr-1" />
                <span>Download PDF</span>
              </>
            )}
          </Button>
        )}
      </div>
    </header>
  );
};
