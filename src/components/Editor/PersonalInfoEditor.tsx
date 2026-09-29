import React, { useState, useRef } from 'react';
import { PersonalInfo, DesignConfig } from '../../types/cv';
import { 
  Camera, 
  Trash2, 
  RefreshCw, 
  Upload, 
  Crop as CropIcon, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Link2, 
  Code, 
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@heroui/react';
import { PhotoCropModal } from './PhotoCropModal';
import { readAndPreScaleImage } from '../../utils/imageUtils';
import { ToggleSwitch } from '../UI/ToggleSwitch';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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
      setErrorMessage('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 8MB. Please choose a smaller photo.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const dataUrl = await readAndPreScaleImage(file);
      setCropImageSource(dataUrl);
      setIsCropModalOpen(true);
      onChange({
        ...data,
        rawPhotoUrl: dataUrl,
      });
    } catch (err: any) {
      console.error('Failed to load image:', err);
      setErrorMessage(err.message || 'Failed to process image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyCrop = (
    croppedDataUrl: string,
    ratio: '1:1' | '3:4',
    shape?: 'circle' | 'rounded' | 'square'
  ) => {
    onChange({
      ...data,
      photoUrl: croppedDataUrl,
      showPhoto: true,
    });
    if (designConfig && onUpdateDesignConfig) {
      onUpdateDesignConfig({
        ...designConfig,
        photoAspectRatio: ratio,
        ...(shape ? { photoShape: shape } : {}),
      });
    }
  };

  const handleOpenCropModal = () => {
    const sourceToCrop = data.rawPhotoUrl || data.photoUrl;
    if (sourceToCrop) {
      setCropImageSource(sourceToCrop);
      setIsCropModalOpen(true);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
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
  const photoAspectRatio = designConfig?.photoAspectRatio || '1:1';
  const isPortrait = photoAspectRatio === '3:4';
  const photoSize = designConfig?.photoSize || 26;

  const shapeClass = 
    photoShape === 'circle' && !isPortrait ? 'rounded-full' :
    photoShape === 'rounded' || isPortrait ? 'rounded-xl' :
    'rounded-none';

  return (
    <div className="space-y-4">
      {/* 1. Profile Photo Management Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Camera className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Profile Photo
            </span>
            <span className="text-[10px] font-medium bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
              Optional
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3.5">
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
            <div className="space-y-3.5">
              {/* Prominent, neatly aligned Visibility Toggle Row */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg border transition ${
                    data.showPhoto
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800/60 text-slate-500 border-slate-700/50'
                  }`}>
                    {data.showPhoto ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">
                      Show Photo on CV
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Include profile photo in the exported PDF and preview
                    </div>
                  </div>
                </div>
                <ToggleSwitch
                  checked={data.showPhoto || false}
                  onChange={(checked) => handleChange('showPhoto', checked)}
                  ariaLabel="Toggle photo visibility on CV"
                />
              </div>

              {/* Photo Preview & Action Controls */}
              <div className="flex items-center gap-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <div className="relative shrink-0">
                  <img
                    src={data.photoUrl}
                    alt="Profile Preview"
                    className={`${isPortrait ? 'w-14 h-[72px]' : 'w-16 h-16'} object-cover bg-slate-800 border-2 ${
                      data.showPhoto ? 'border-blue-500 shadow-sm' : 'border-slate-700 opacity-50'
                    } ${shapeClass} transition-all`}
                  />
                  {!data.showPhoto && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-[10px] font-semibold text-slate-200 rounded">
                      Hidden
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleOpenCropModal}
                      className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold h-8 px-3 rounded-lg flex items-center gap-1.5 transition shadow-sm"
                    >
                      <CropIcon className="w-3.5 h-3.5" />
                      <span>Crop / Adjust</span>
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold h-8 px-3 rounded-lg flex items-center gap-1.5 border border-slate-700 transition"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                      <span>Change</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 font-semibold h-8 px-2.5 rounded-lg border border-transparent hover:border-rose-500/20 flex items-center gap-1.5 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    High-res vector PDF export with print precision.
                  </p>
                </div>
              </div>

              {/* Photo Styling (Shape & Size) */}
              {designConfig && onUpdateDesignConfig && (
                <div className="pt-2 border-t border-slate-800/80 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Shape Picker */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                        Avatar Shape
                      </label>
                      <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        {(['circle', 'rounded', 'square'] as const).map((shape) => (
                          <button
                            key={shape}
                            type="button"
                            onClick={() => onUpdateDesignConfig({ ...designConfig, photoShape: shape })}
                            className={`py-1 text-xs font-semibold rounded-lg transition ${
                              photoShape === shape
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                            }`}
                          >
                            {shape === 'circle' ? 'Circle' : shape === 'rounded' ? 'Rounded' : 'Square'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Aspect Ratio */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                        Aspect Ratio
                      </label>
                      <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => onUpdateDesignConfig({ ...designConfig, photoAspectRatio: '1:1' })}
                          className={`py-1 text-xs font-semibold rounded-lg transition ${
                            photoAspectRatio === '1:1'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                          }`}
                        >
                          1:1 Square
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateDesignConfig({ ...designConfig, photoAspectRatio: '3:4' })}
                          className={`py-1 text-xs font-semibold rounded-lg transition ${
                            photoAspectRatio === '3:4'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                          }`}
                        >
                          3:4 Portrait
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Size Slider */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-semibold uppercase tracking-wider">
                      <span>Photo Width</span>
                      <span className="font-mono text-blue-400 font-bold">
                        {photoSize} mm {isPortrait ? `× ${Math.round((photoSize * 4) / 3)} mm` : `× ${photoSize} mm`}
                      </span>
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
                      className="w-full accent-blue-500 cursor-pointer"
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
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-800 hover:border-blue-500/60 bg-slate-950/60 hover:bg-slate-950'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="p-3 bg-slate-900 text-blue-400 rounded-xl border border-slate-800">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-slate-200">
                  {isProcessing ? 'Processing image...' : 'Click or drag & drop to upload profile photo'}
                </div>
                <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                  Supports JPG, PNG, WebP. High quality client-side scaling.
                </p>
              </div>
            </div>
          )}

          {errorMessage && (
            <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl">
              {errorMessage}
            </p>
          )}
        </div>
      </div>

      {/* 2. Personal Information Fields Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-800/80 bg-slate-950/70 px-4 py-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <User className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Contact & Header Details
          </span>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={data.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="e.g. ALEX MORGAN"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs font-medium placeholder:text-slate-600 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                Professional Title / Headline
              </label>
              <input
                type="text"
                value={data.jobTitle || ''}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs font-medium placeholder:text-slate-600 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                Email Address
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="e.g. alex.morgan@example.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-600 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                Phone Number
              </label>
              <input
                type="text"
                value={data.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="e.g. +1 (555) 234-5678"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-600 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                Location
              </label>
              <input
                type="text"
                value={data.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-600 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                Portfolio Website
              </label>
              <input
                type="text"
                value={data.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="e.g. alexmorgan.dev"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-600 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-slate-500" />
                LinkedIn Profile
              </label>
              <input
                type="text"
                value={data.linkedin || ''}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                placeholder="e.g. linkedin.com/in/alexmorgan"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-600 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-slate-500" />
                GitHub Profile
              </label>
              <input
                type="text"
                value={data.github || ''}
                onChange={(e) => handleChange('github', e.target.value)}
                placeholder="e.g. github.com/alexmorgan"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-600 transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Professional Summary Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Professional Summary / Bio
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">
              {data.showSummary ? 'Active on CV' : 'Hidden'}
            </span>
            <ToggleSwitch
              checked={data.showSummary}
              onChange={(checked) => handleChange('showSummary', checked)}
              ariaLabel="Toggle summary visibility"
            />
          </div>
        </div>

        <div className="p-4 space-y-2">
          <textarea
            rows={4}
            value={data.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            placeholder="Brief 2-4 sentences highlighting your background, core technical expertise, and career focus..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-slate-100 rounded-lg p-3 text-xs leading-relaxed placeholder:text-slate-600 transition"
          />
        </div>
      </div>

      {/* Interactive Photo Crop Modal */}
      <PhotoCropModal
        isOpen={isCropModalOpen}
        imageSrc={cropImageSource}
        initialShape={photoShape}
        initialAspectRatio={photoAspectRatio}
        onClose={() => setIsCropModalOpen(false)}
        onApplyCrop={handleApplyCrop}
      />
    </div>
  );
};
