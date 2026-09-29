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
  Crop as CropIcon,
  Sparkles
} from 'lucide-react';
import { Button, Card, Chip, Switch, Input, TextArea } from '@heroui/react';

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
  const photoPosition = designConfig?.photoPosition || 'right';

  const shapeClass = 
    photoShape === 'circle' && !isPortrait ? 'rounded-full' :
    photoShape === 'rounded' || isPortrait ? 'rounded-xl' :
    'rounded-none';

  return (
    <div className="space-y-4">
      {/* 1. Profile Photo Management Card */}
      <Card variant="secondary" className="border border-border">
        <Card.Header className="flex items-center justify-between border-b border-border/70 pb-3 px-4 pt-3.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent/15 text-accent">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <Card.Title className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Profile Photo
              </Card.Title>
            </div>
            <Chip size="sm" variant="soft" color="default" className="text-[10px] h-4.5 px-1.5">
              <Chip.Label>Optional</Chip.Label>
            </Chip>
          </div>

          {data.photoUrl && (
            <Switch
              isSelected={data.showPhoto || false}
              onChange={(checked) => handleChange('showPhoto', checked)}
              size="sm"
            >
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Content className="text-xs font-medium text-foreground cursor-pointer">
                Show on CV
              </Switch.Content>
            </Switch>
          )}
        </Card.Header>

        <Card.Content className="p-4 space-y-3">
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
              <div className="flex items-center gap-4">
                {/* Thumbnail Preview */}
                <div className="relative shrink-0">
                  <img
                    src={data.photoUrl}
                    alt="Profile Preview"
                    className={`${isPortrait ? 'w-14 h-[72px]' : 'w-16 h-16'} object-cover bg-surface-tertiary border-2 ${
                      data.showPhoto ? 'border-accent shadow-sm' : 'border-border opacity-50'
                    } ${shapeClass} transition-all`}
                  />
                  {!data.showPhoto && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-[10px] font-semibold text-slate-200 rounded">
                      Hidden
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onPress={handleOpenCropModal}
                      className="text-xs font-medium h-8"
                    >
                      <CropIcon className="w-3.5 h-3.5 mr-1" />
                      <span>Crop & Frame</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      isDisabled={isProcessing}
                      onPress={() => fileInputRef.current?.click()}
                      className="text-xs font-medium h-8"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isProcessing ? 'animate-spin' : ''}`} />
                      <span>Change</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="danger-soft"
                      onPress={handleRemovePhoto}
                      className="text-xs font-medium h-8"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      <span>Remove</span>
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted">
                    Auto-optimized to 600×600 px for crisp print & vector PDF export.
                  </p>
                </div>
              </div>

              {/* Quick Photo Style Controls */}
              {designConfig && onUpdateDesignConfig && (
                <div className="pt-3 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {/* Shape Picker */}
                  <div>
                    <label className="block text-[11px] font-medium text-muted mb-1.5">Avatar Shape</label>
                    <div className="flex gap-1 bg-surface-tertiary/60 p-1 rounded-xl border border-border">
                      {(['circle', 'rounded', 'square'] as const).map((shape) => (
                        <Button
                          key={shape}
                          size="sm"
                          variant={photoShape === shape ? 'primary' : 'ghost'}
                          onPress={() => onUpdateDesignConfig({ ...designConfig, photoShape: shape })}
                          className="flex-1 h-7 text-[11px] px-1 font-medium rounded-lg"
                        >
                          {shape === 'circle' ? 'Circle' : shape === 'rounded' ? 'Rounded' : 'Square'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Aspect Ratio Picker */}
                  <div>
                    <label className="block text-[11px] font-medium text-muted mb-1.5">Aspect Ratio</label>
                    <div className="flex gap-1 bg-surface-tertiary/60 p-1 rounded-xl border border-border">
                      {(['1:1', '3:4'] as const).map((ratio) => (
                        <Button
                          key={ratio}
                          size="sm"
                          variant={photoAspectRatio === ratio ? 'primary' : 'ghost'}
                          onPress={() =>
                            onUpdateDesignConfig({
                              ...designConfig,
                              photoAspectRatio: ratio,
                              ...(ratio === '3:4' && photoShape === 'circle' ? { photoShape: 'rounded' } : {}),
                            })
                          }
                          className="flex-1 h-7 text-[11px] px-1 font-medium rounded-lg"
                        >
                          {ratio === '1:1' ? '1:1 Sq' : '3:4 Pas'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Position Picker */}
                  <div>
                    <label className="block text-[11px] font-medium text-muted mb-1.5">Header Position</label>
                    <div className="flex gap-1 bg-surface-tertiary/60 p-1 rounded-xl border border-border">
                      {(['right', 'left'] as const).map((pos) => (
                        <Button
                          key={pos}
                          size="sm"
                          variant={photoPosition === pos ? 'primary' : 'ghost'}
                          onPress={() => onUpdateDesignConfig({ ...designConfig, photoPosition: pos })}
                          className="flex-1 h-7 text-[11px] px-1 font-medium rounded-lg"
                        >
                          {pos === 'right' ? 'Right' : 'Left'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Size Slider */}
                  <div className="sm:col-span-3 pt-1">
                    <div className="flex justify-between text-[11px] text-muted mb-1">
                      <span>Photo Width</span>
                      <span className="font-mono text-accent font-semibold">
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
                      className="w-full accent-accent rounded"
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
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-accent bg-accent/10 shadow-inner'
                  : 'border-border/80 hover:border-accent/60 bg-surface-tertiary/30 hover:bg-surface-tertiary/60'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="p-3 bg-surface-secondary text-accent rounded-2xl border border-border shadow-xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-foreground">
                  {isProcessing ? 'Processing image...' : 'Click or drag & drop to upload profile photo'}
                </div>
                <p className="text-[11px] text-muted max-w-xs leading-relaxed">
                  Supports JPG, PNG, WebP. Automatically resized and compressed client-side.
                </p>
              </div>
            </div>
          )}

          {errorMessage && (
            <p className="text-xs text-danger bg-danger/10 border border-danger/30 p-2.5 rounded-xl">
              {errorMessage}
            </p>
          )}
        </Card.Content>
      </Card>

      {/* 2. Personal Information Fields Card */}
      <Card variant="secondary" className="border border-border">
        <Card.Header className="flex items-center justify-between border-b border-border/70 pb-3 px-4 pt-3.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent/15 text-accent">
              <User className="w-4 h-4" />
            </div>
            <Card.Title className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Contact & Header Details
            </Card.Title>
          </div>
        </Card.Header>

        <Card.Content className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Full Name</label>
              <Input
                variant="secondary"
                value={data.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="e.g. ALEX MORGAN"
                className="w-full text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Professional Title / Headline</label>
              <Input
                variant="secondary"
                value={data.jobTitle || ''}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                placeholder="e.g. Senior Full-Stack Engineer"
                className="w-full text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-muted" />
                Email Address
              </label>
              <Input
                type="email"
                variant="secondary"
                value={data.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="e.g. alex.morgan@example.com"
                className="w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-muted" />
                Phone Number
              </label>
              <Input
                type="text"
                variant="secondary"
                value={data.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="e.g. +1 (555) 234-5678"
                className="w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-muted" />
                Location
              </label>
              <Input
                type="text"
                variant="secondary"
                value={data.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className="w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-muted" />
                Portfolio Website
              </label>
              <Input
                type="text"
                variant="secondary"
                value={data.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="e.g. alexmorgan.dev"
                className="w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-muted" />
                LinkedIn Profile
              </label>
              <Input
                type="text"
                variant="secondary"
                value={data.linkedin || ''}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                placeholder="e.g. linkedin.com/in/alexmorgan"
                className="w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-muted" />
                GitHub Username / URL
              </label>
              <Input
                type="text"
                variant="secondary"
                value={data.github || ''}
                onChange={(e) => handleChange('github', e.target.value)}
                placeholder="e.g. github.com/alexmorgan"
                className="w-full text-sm"
              />
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* 3. Professional Summary Card */}
      <Card variant="secondary" className="border border-border">
        <Card.Header className="flex items-center justify-between border-b border-border/70 pb-3 px-4 pt-3.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent/15 text-accent">
              <FileText className="w-4 h-4" />
            </div>
            <Card.Title className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Professional Summary / Bio
            </Card.Title>
          </div>

          <Switch
            isSelected={data.showSummary}
            onChange={(checked) => handleChange('showSummary', checked)}
            size="sm"
          >
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Content className="text-xs font-medium text-foreground cursor-pointer">
              Show on CV
            </Switch.Content>
          </Switch>
        </Card.Header>

        <Card.Content className="p-4">
          <TextArea
            variant="secondary"
            rows={4}
            value={data.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            placeholder="Brief 2-4 sentences highlighting your background, expertise, and career focus..."
            className="w-full text-sm leading-relaxed"
          />
        </Card.Content>
      </Card>

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
