import React, { useState, useCallback } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { getCroppedImg } from '../../utils/imageUtils';
import { Button } from '@heroui/react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw, 
  Check, 
  Crop as CropIcon, 
  RefreshCw 
} from 'lucide-react';

interface PhotoCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  initialShape?: 'circle' | 'rounded' | 'square';
  initialAspectRatio?: '1:1' | '3:4';
  onClose: () => void;
  onApplyCrop: (
    croppedDataUrl: string,
    ratio: '1:1' | '3:4',
    shape?: 'circle' | 'rounded' | 'square'
  ) => void;
}

export const PhotoCropModal: React.FC<PhotoCropModalProps> = ({
  isOpen,
  imageSrc,
  initialShape = 'circle',
  initialAspectRatio = '1:1',
  onClose,
  onApplyCrop,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<number>(
    initialAspectRatio === '3:4' ? 3 / 4 : 1
  );
  const [cropShape, setCropShape] = useState<'round' | 'rect'>(
    initialAspectRatio === '3:4'
      ? 'rect'
      : initialShape === 'circle'
      ? 'round'
      : 'rect'
  );
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Sync state whenever modal is opened
  React.useEffect(() => {
    if (isOpen) {
      const is34 = initialAspectRatio === '3:4';
      setAspectRatio(is34 ? 3 / 4 : 1);
      setCropShape(is34 ? 'rect' : initialShape === 'circle' ? 'round' : 'rect');
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    }
  }, [isOpen, initialAspectRatio, initialShape]);

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
      const ratio: '1:1' | '3:4' = aspectRatio === 3 / 4 ? '3:4' : '1:1';
      const shape: 'circle' | 'rounded' | 'square' =
        ratio === '3:4'
          ? 'rounded'
          : cropShape === 'round'
          ? 'circle'
          : 'square';

      onApplyCrop(croppedImage, ratio, shape);
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
        className="bg-surface border border-border rounded-xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden text-foreground max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-accent/20 text-accent rounded-md">
              <CropIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Crop & Frame Profile Photo
              </h3>
              <p className="text-[11px] text-muted">
                Drag to reposition, use slider to zoom and rotate.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            isIconOnly
            onPress={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5 text-muted hover:text-foreground" />
          </Button>
        </div>

        {/* Cropper Canvas Area */}
        <div className="relative w-full h-[320px] sm:h-[360px] bg-black select-none">
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
                  ? 'border-2 border-accent shadow-outline'
                  : 'border-2 border-accent shadow-outline',
            }}
          />
        </div>

        {/* Controls Section */}
        <div className="p-3.5 space-y-3 bg-surface-secondary border-t border-border text-xs">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <span className="text-muted font-medium w-12 flex items-center gap-1">
              <ZoomIn className="w-3.5 h-3.5 text-accent" />
              Zoom
            </span>
            <Button
              variant="outline"
              size="sm"
              isIconOnly
              onPress={() => setZoom((z) => Math.max(1, z - 0.2))}
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-accent cursor-pointer"
            />
            <Button
              variant="outline"
              size="sm"
              isIconOnly
              onPress={() => setZoom((z) => Math.min(3, z + 0.2))}
              aria-label="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
            <span className="font-mono text-muted w-10 text-right">
              {zoom.toFixed(1)}x
            </span>
          </div>

          {/* Rotation & Framing Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {/* Rotation controls */}
            <div className="flex items-center gap-1.5 bg-surface p-1.5 rounded-lg border border-border">
              <span className="text-[11px] text-muted px-1 font-medium">Rotation:</span>
              <Button
                variant="outline"
                size="sm"
                onPress={() => setRotation((r) => (r - 90) % 360)}
                className="flex items-center gap-1 h-7 px-2 text-[11px]"
              >
                <RotateCcw className="w-3 h-3 text-accent" />
                -90°
              </Button>
              <Button
                variant="outline"
                size="sm"
                onPress={() => setRotation((r) => (r + 90) % 360)}
                className="flex items-center gap-1 h-7 px-2 text-[11px]"
              >
                <RotateCw className="w-3 h-3 text-accent" />
                +90°
              </Button>
              {rotation !== 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => setRotation(0)}
                  className="h-7 px-1.5 text-[10px] text-muted hover:text-foreground"
                >
                  0°
                </Button>
              )}
            </div>

            {/* Shape Guide & Aspect Ratio */}
            <div className="flex items-center justify-between gap-1.5 bg-surface p-1.5 rounded-lg border border-border">
              <span className="text-[11px] text-muted px-1 font-medium">Guide:</span>
              <div className="flex gap-1 flex-1">
                <Button
                  variant={cropShape === 'round' ? 'primary' : 'tertiary'}
                  size="sm"
                  onPress={() => {
                    setCropShape('round');
                    setAspectRatio(1);
                  }}
                  className="flex-1 h-7 px-1 text-[10px]"
                >
                  Circle
                </Button>
                <Button
                  variant={cropShape === 'rect' && aspectRatio === 1 ? 'primary' : 'tertiary'}
                  size="sm"
                  onPress={() => {
                    setCropShape('rect');
                    setAspectRatio(1);
                  }}
                  className="flex-1 h-7 px-1 text-[10px]"
                >
                  Square
                </Button>
                <Button
                  variant={cropShape === 'rect' && aspectRatio === 3 / 4 ? 'primary' : 'tertiary'}
                  size="sm"
                  onPress={() => {
                    setCropShape('rect');
                    setAspectRatio(3 / 4);
                  }}
                  className="flex-1 h-7 px-1 text-[10px]"
                >
                  3:4 Photo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-surface-secondary border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onPress={handleReset}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Position</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onPress={onClose}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onPress={handleApply}
              isDisabled={isProcessing}
              className="flex items-center gap-1.5 text-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Cropping...' : 'Apply & Save Crop'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
