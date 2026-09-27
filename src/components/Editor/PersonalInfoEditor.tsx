import React, { useRef, useState } from 'react';
import { PersonalInfo, DesignConfig } from '../../types/cv';
import { readAndPreScaleImage } from '../../utils/imageUtils';
import { PhotoCropModal } from './PhotoCropModal';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Link2, 
  Code, 
  FileText, 
  Camera, 
  Upload, 
  Trash2, 
  RefreshCw,
  Sliders,
  Check,
  Crop as CropIcon
} from 'lucide-react';

interface Props {
  data: PersonalInfo;
  onChange: (updated: PersonalInfo) => void;
  designConfig?: DesignConfig;
  onUpdateDesignConfig?: (updated: DesignConfig) => void;
}

export const PersonalInfoEditor: React.FC<Props> = ({
  data,
  onChange,
  designConfig,
  onUpdateDesignConfig,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropImageSource, setCropImageSource] = useState<string>('');

  const handleChange = (field: keyof PersonalInfo, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }
    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const rawDataUrl = await readAndPreScaleImage(file, 1400);
      setCropImageSource(rawDataUrl);
      onChange({
        ...data,
        rawPhotoUrl: rawDataUrl,
      });
      setIsCropModalOpen(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenCropModal = () => {
    const imgSrc = data.rawPhotoUrl || data.photoUrl;
    if (imgSrc) {
      setCropImageSource(imgSrc);
      setIsCropModalOpen(true);
    }
  };

  const handleApplyCrop = (croppedDataUrl: string) => {
    onChange({
      ...data,
      photoUrl: croppedDataUrl,
      showPhoto: true,
    });
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemovePhoto = () => {
    onChange({
      ...data,
      photoUrl: '',
      rawPhotoUrl: '',
      showPhoto: false,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const photoShape = designConfig?.photoShape || 'circle';
  const photoSize = designConfig?.photoSize || 26;
  const photoBorder = designConfig?.photoBorder !== false;
  const photoPosition = designConfig?.photoPosition || 'right';

  const shapeClass = 
    photoShape === 'circle' ? 'rounded-full' :
    photoShape === 'rounded' ? 'rounded-xl' :
    'rounded-none';

  return (
    <div className="space-y-5">
      {/* 1. Profile Photo Management Card */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-lg p-3.5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Profile Photo
            </h3>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
              Optional
            </span>
          </div>

          {data.photoUrl && (
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={data.showPhoto || false}
                onChange={(e) => handleChange('showPhoto', e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
              />
              <span className="font-medium">Show Photo on CV</span>
            </label>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          onChange={onFileInputChange}
          className="hidden"
          id="photo-upload-input"
        />

        {data.photoUrl ? (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              {/* Thumbnail Preview */}
              <div className="relative shrink-0">
                <img
                  src={data.photoUrl}
                  alt="Profile Preview"
                  className={`w-16 h-16 object-cover bg-slate-950 border-2 ${
                    data.showPhoto ? 'border-blue-500' : 'border-slate-700 opacity-60'
                  } ${shapeClass}`}
                />
                {!data.showPhoto && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] font-semibold text-slate-300 rounded">
                    Hidden
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleOpenCropModal}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600/25 hover:bg-blue-600/40 text-blue-200 text-xs font-medium rounded border border-blue-500/50 transition focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
                    title="Crop and frame photo"
                  >
                    <CropIcon className="w-3.5 h-3.5 text-blue-400" />
                    <span>Crop & Frame</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 transition focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                    <span>Change</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium rounded border border-rose-800/60 transition focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Auto-optimized to 600×600 px for crisp print & vector PDF export.
                </p>
              </div>
            </div>

            {/* Quick Photo Style Controls */}
            {designConfig && onUpdateDesignConfig && (
              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Shape Picker */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Avatar Shape</label>
                  <div className="flex gap-1.5">
                    {(['circle', 'rounded', 'square'] as const).map((shape) => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => onUpdateDesignConfig({ ...designConfig, photoShape: shape })}
                        className={`flex-1 py-1 px-2 text-[11px] font-medium rounded border transition ${
                          photoShape === shape
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {shape === 'circle' ? 'Circle' : shape === 'rounded' ? 'Rounded' : 'Square'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Position Picker */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Header Position</label>
                  <div className="flex gap-1.5">
                    {(['right', 'left'] as const).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => onUpdateDesignConfig({ ...designConfig, photoPosition: pos })}
                        className={`flex-1 py-1 px-2 text-[11px] font-medium rounded border transition ${
                          photoPosition === pos
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {pos === 'right' ? 'Right Side' : 'Left Side'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Slider */}
                <div className="sm:col-span-2">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Photo Size</span>
                    <span className="font-mono text-blue-400">{photoSize} mm</span>
                  </div>
                  <input
                    type="range"
                    min={18}
                    max={38}
                    step={1}
                    value={photoSize}
                    onChange={(e) =>
                      onUpdateDesignConfig({
                        ...designConfig,
                        photoSize: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full accent-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none rounded"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Dropzone Upload Area */
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition ${
              isDragging
                ? 'border-blue-400 bg-blue-950/30'
                : 'border-slate-700 hover:border-slate-500 bg-slate-950/40 hover:bg-slate-900/40'
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-1.5">
              <div className="p-2.5 bg-slate-800 rounded-full text-slate-300">
                <Upload className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-xs font-semibold text-slate-200">
                {isProcessing ? 'Processing image...' : 'Click or drag & drop to upload profile photo'}
              </div>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Supports JPG, PNG, WebP. Automatically resized and compressed client-side.
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <p className="text-xs text-rose-400 bg-rose-950/30 border border-rose-800/50 p-2 rounded">
            {errorMessage}
          </p>
        )}
      </div>

      {/* 2. Personal Information Fields */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" />
            Contact & Header Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="e.g. ALEX MORGAN"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Professional Title / Headline</label>
            <input
              type="text"
              value={data.jobTitle || ''}
              onChange={(e) => handleChange('jobTitle', e.target.value)}
              placeholder="e.g. Senior Full-Stack Engineer"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Email Address
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="e.g. alex.morgan@example.com"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              Phone Number
            </label>
            <input
              type="text"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="e.g. +1 (555) 234-5678"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Location
            </label>
            <input
              type="text"
              value={data.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. San Francisco, CA"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-blue-400" />
              LinkedIn URL / Handle
            </label>
            <input
              type="text"
              value={data.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="e.g. linkedin.com/in/alexmorgan-dev"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              Portfolio / Website
            </label>
            <input
              type="text"
              value={data.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="e.g. alexmorgan.dev"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-slate-300" />
              GitHub URL / Profile
            </label>
            <input
              type="text"
              value={data.github || ''}
              onChange={(e) => handleChange('github', e.target.value)}
              placeholder="e.g. github.com/alexmorgan"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Professional Summary / Bio
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-200">
              <input
                type="checkbox"
                checked={data.showSummary}
                onChange={(e) => handleChange('showSummary', e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
              />
              <span>Show on CV</span>
            </label>
          </div>
          <textarea
            rows={4}
            value={data.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            placeholder="Brief 2-4 sentences highlighting your background, expertise, and focus..."
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Interactive Photo Crop Modal */}
      <PhotoCropModal
        isOpen={isCropModalOpen}
        imageSrc={cropImageSource}
        initialShape={photoShape}
        onClose={() => setIsCropModalOpen(false)}
        onApplyCrop={handleApplyCrop}
      />
    </div>
  );
};
