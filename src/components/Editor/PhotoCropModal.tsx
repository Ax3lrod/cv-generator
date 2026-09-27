import React, { useState, useCallback } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { getCroppedImg } from '../../utils/imageUtils';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw, 
  Check, 
  Crop as CropIcon, 
  Maximize2, 
  RefreshCw,
  Eye
} from 'lucide-react';

interface PhotoCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  initialShape?: 'circle' | 'rounded' | 'square';
  onClose: () => void;
  onApplyCrop: (croppedDataUrl: string) => void;
}

export const PhotoCropModal: React.FC<PhotoCropModalProps> = ({
  isOpen,
  imageSrc,
  initialShape = 'circle',
  onClose,
  onApplyCrop,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<number>(1); // 1:1 default for CV
  const [cropShape, setCropShape] = useState<'round' | 'rect'>(
    initialShape === 'circle' ? 'round' : 'rect'
  );
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const onCropComplete = useCallback(
    (_croppedArea: Area, currentCroppedAreaPixels: Area) => {
      setCroppedAreaPixels(currentCroppedAreaPixels);
    },
    []
  );

  const handleApply = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        600
      );
      onApplyCrop(croppedImage);
      onClose();
    } catch (e) {
      console.error('Failed to crop image:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden text-slate-100 max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-md">
              <CropIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Crop & Frame Profile Photo
              </h3>
              <p className="text-[11px] text-slate-400">
                Drag to reposition, use slider to zoom and rotate.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Canvas Area */}
        <div className="relative w-full h-[320px] sm:h-[360px] bg-slate-950 select-none">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            cropShape={cropShape}
            showGrid={true}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            classes={{
              containerClassName: 'relative w-full h-full',
              cropAreaClassName:
                cropShape === 'round'
                  ? 'border-2 border-blue-400 shadow-outline'
                  : 'border-2 border-blue-400 shadow-outline',
            }}
          />
        </div>

        {/* Controls Section */}
        <div className="p-3.5 space-y-3 bg-slate-900/95 border-t border-slate-800 text-xs">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium w-12 flex items-center gap-1">
              <ZoomIn className="w-3.5 h-3.5 text-blue-400" />
              Zoom
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
              className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none rounded cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
              className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-slate-300 w-10 text-right">
              {zoom.toFixed(1)}x
            </span>
          </div>

          {/* Rotation & Framing Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {/* Rotation controls */}
            <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded border border-slate-800">
              <span className="text-[11px] text-slate-400 px-1 font-medium">Rotation:</span>
              <button
                type="button"
                onClick={() => setRotation((r) => (r - 90) % 360)}
                className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium border border-slate-700 transition"
                title="Rotate -90 deg"
              >
                <RotateCcw className="w-3 h-3 text-cyan-400" />
                -90°
              </button>
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium border border-slate-700 transition"
                title="Rotate +90 deg"
              >
                <RotateCw className="w-3 h-3 text-cyan-400" />
                +90°
              </button>
              {rotation !== 0 && (
                <button
                  type="button"
                  onClick={() => setRotation(0)}
                  className="px-1.5 py-1 text-[10px] text-slate-400 hover:text-slate-200"
                >
                  0°
                </button>
              )}
            </div>

            {/* Shape Guide & Aspect Ratio */}
            <div className="flex items-center justify-between gap-1.5 bg-slate-950/60 p-1.5 rounded border border-slate-800">
              <span className="text-[11px] text-slate-400 px-1 font-medium">Guide:</span>
              <div className="flex gap-1 flex-1">
                <button
                  type="button"
                  onClick={() => {
                    setCropShape('round');
                    setAspectRatio(1);
                  }}
                  className={`flex-1 py-1 px-1.5 text-[10px] font-medium rounded transition ${
                    cropShape === 'round'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Circle (1:1)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCropShape('rect');
                    setAspectRatio(1);
                  }}
                  className={`flex-1 py-1 px-1.5 text-[10px] font-medium rounded transition ${
                    cropShape === 'rect' && aspectRatio === 1
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Square (1:1)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCropShape('rect');
                    setAspectRatio(3 / 4);
                  }}
                  className={`flex-1 py-1 px-1.5 text-[10px] font-medium rounded transition ${
                    cropShape === 'rect' && aspectRatio === 3 / 4
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  3:4 Photo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-t border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Position</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg shadow-sm transition focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Cropping...' : 'Apply & Save Crop'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
