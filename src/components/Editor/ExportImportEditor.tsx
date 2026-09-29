import React, { useRef, useState } from 'react';
import { CVData, DesignConfig } from '../../types/cv';
import { defaultCVData, defaultDesignConfig } from '../../data/defaultCV';
import { downloadVectorPdf, openVectorPdfInNewTab } from '../../utils/pdfExport';
import { 
  Printer, 
  Download, 
  Upload, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Button, Card, Chip } from '@heroui/react';

interface Props {
  cvData: CVData;
  designConfig: DesignConfig;
  onUpdateCVData: (data: CVData) => void;
  onUpdateDesignConfig: (config: DesignConfig) => void;
}

export const ExportImportEditor: React.FC<Props> = ({
  cvData,
  designConfig,
  onUpdateCVData,
  onUpdateDesignConfig,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  // 1. Direct Vector PDF Download (100% accurate vector, ATS-friendly)
  const handleDownloadVectorPDF = async () => {
    setIsExporting(true);
    try {
      await downloadVectorPdf(cvData, designConfig);
    } catch (err) {
      console.error('Failed to generate vector PDF, falling back to print:', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  // 2. Open Vector PDF in new tab
  const handlePreviewVectorPDF = async () => {
    setIsPreviewing(true);
    try {
      await openVectorPdfInNewTab(cvData, designConfig);
    } catch (err) {
      console.error('Failed to preview vector PDF:', err);
    } finally {
      setIsPreviewing(false);
    }
  };

  // 3. Browser Native Print
  const handlePrint = () => {
    window.print();
  };

  // 4. Export JSON Configuration & Content
  const handleExportJSON = () => {
    const payload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      cvData,
      designConfig,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(payload, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `${(cvData.personalInfo.fullName || 'Resume').trim().replace(/\s+/g, '_')}_cv_backup.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 5. Import JSON Configuration & Content
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.cvData && parsed.designConfig) {
          onUpdateCVData(parsed.cvData);
          onUpdateDesignConfig(parsed.designConfig);
          alert('CV data and design configuration imported successfully!');
        } else if (parsed.personalInfo) {
          onUpdateCVData(parsed);
          alert('CV data imported successfully!');
        } else {
          alert('Invalid CV file structure.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 6. Reset to Example Data
  const handleResetToDefault = () => {
    if (window.confirm('Reset CV to default template example? Current changes will be overwritten.')) {
      onUpdateCVData(defaultCVData);
      onUpdateDesignConfig(defaultDesignConfig);
    }
  };

  // 7. Clear All Data
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all data to start with a blank CV?')) {
      onUpdateCVData({
        personalInfo: {
          fullName: '',
          jobTitle: '',
          phone: '',
          email: '',
          location: '',
          linkedin: '',
          website: '',
          github: '',
          summary: '',
          showSummary: true,
        },
        education: [],
        experiences: [],
        projects: [],
        achievements: [],
        skills: [],
        customSections: [],
        sectionsOrder: [
          { id: 'summary', title: 'Professional Summary', isVisible: true },
          { id: 'education', title: 'Education', isVisible: true },
          { id: 'experiences', title: 'Experiences', isVisible: true },
          { id: 'projects', title: 'Projects', isVisible: true },
          { id: 'achievements', title: 'Achievements', isVisible: true },
          { id: 'skills', title: 'Skills', isVisible: true },
        ],
      });
    }
  };

  // ATS Optimization Check
  const calculateATSScore = () => {
    let score = 0;
    const checks = [
      { label: 'Full Name provided', pass: !!cvData.personalInfo.fullName.trim() },
      { label: 'Valid email address', pass: !!cvData.personalInfo.email.includes('@') },
      { label: 'Phone number included', pass: !!cvData.personalInfo.phone.trim() },
      { label: 'Professional Summary / Headline', pass: !!cvData.personalInfo.summary.trim() },
      { label: 'At least 1 Education entry', pass: cvData.education.length > 0 },
      { label: 'At least 1 Work / Experience entry', pass: cvData.experiences.length > 0 },
      { label: 'Action-oriented bullet points (>3)', pass: cvData.experiences.some(e => e.bullets.length >= 2) },
      { label: 'Skills categorized & listed', pass: cvData.skills.length > 0 },
      { label: 'Projects or Achievements featured', pass: cvData.projects.length > 0 || cvData.achievements.length > 0 },
      { label: 'ATS Standard Font selected', pass: ['inter', 'roboto', 'eb-garamond'].includes(designConfig.fontFamily) },
    ];

    checks.forEach(c => { if (c.pass) score += 10; });
    return { score, checks };
  };

  const { score, checks } = calculateATSScore();

  return (
    <div className="space-y-4">
      {/* ATS Score Analyzer Card */}
      <Card variant="secondary" className="border border-border">
        <Card.Header className="flex items-center justify-between border-b border-border/70 pb-3 px-4 pt-3.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent/15 text-accent">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <Card.Title className="text-xs font-semibold uppercase tracking-wider text-foreground">
              ATS Readiness & Keyword Score
            </Card.Title>
          </div>

          <Chip
            size="sm"
            variant="soft"
            color={score >= 90 ? 'success' : score >= 70 ? 'accent' : 'warning'}
            className="font-mono font-bold text-xs"
          >
            <Chip.Label>{score} / 100</Chip.Label>
          </Chip>
        </Card.Header>

        <Card.Content className="p-4 space-y-3">
          <div className="w-full bg-surface-tertiary h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                score >= 90 ? 'bg-success' : score >= 70 ? 'bg-accent' : 'bg-warning'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
            {checks.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                {c.pass ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0" />
                )}
                <span className={c.pass ? 'text-foreground' : 'text-muted'}>{c.label}</span>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Vector PDF Export Card */}
      <Card variant="secondary" className="border border-border">
        <Card.Header className="flex items-center justify-between border-b border-border/70 pb-3 px-4 pt-3.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-success/20 text-success">
              <Download className="w-4 h-4" />
            </div>
            <Card.Title className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Vector PDF Engine (Accurate)
            </Card.Title>
          </div>

          <Chip size="sm" variant="soft" color="success" className="text-[10px] font-mono">
            <Chip.Label>100% Vector</Chip.Label>
          </Chip>
        </Card.Header>

        <Card.Content className="p-4 space-y-3">
          <p className="text-xs text-muted leading-relaxed">
            Menghasilkan file PDF vector murni: teks dapat di-copy dan diparsing sempurna oleh sistem ATS, garis vector tajam tanpa blur, link dapat diklik, dan rasio millimeter 100% akurat.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Button
              variant="primary"
              size="md"
              isDisabled={isExporting}
              onPress={handleDownloadVectorPDF}
              className="font-semibold text-xs h-9 rounded-xl shadow-sm"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  <span>Generating Vector PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  <span>Download Vector PDF</span>
                </>
              )}
            </Button>

            <Button
              variant="secondary"
              size="md"
              isDisabled={isPreviewing}
              onPress={handlePreviewVectorPDF}
              className="text-xs font-medium h-9 rounded-xl border border-border"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              <span>{isPreviewing ? 'Opening...' : 'Preview in New Tab'}</span>
            </Button>
          </div>

          {/* Browser Native Print Button */}
          <div className="pt-2 border-t border-border/60 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-foreground block">
                Browser Print Dialog
              </span>
              <span className="text-[11px] text-muted">
                Cetak fisik ke printer kantor atau simpan via dialog Chrome/Firefox.
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onPress={handlePrint}
              className="text-xs font-medium h-8 rounded-lg shrink-0 ml-3"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              <span>Print Dialog</span>
            </Button>
          </div>
        </Card.Content>
      </Card>

      {/* Backup, Import & Reset Card */}
      <Card variant="secondary" className="border border-border">
        <Card.Header className="flex items-center gap-2 border-b border-border/70 pb-3 px-4 pt-3.5">
          <div className="p-1.5 rounded-lg bg-accent/15 text-accent">
            <RefreshCw className="w-4 h-4" />
          </div>
          <Card.Title className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Backup, Import & Reset
          </Card.Title>
        </Card.Header>

        <Card.Content className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              onPress={handleExportJSON}
              className="h-8.5 text-xs font-medium rounded-xl border border-border"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              <span>Backup to JSON</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onPress={() => fileInputRef.current?.click()}
              className="h-8.5 text-xs font-medium rounded-xl border border-border"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              <span>Restore from JSON</span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Button
              variant="secondary"
              size="sm"
              onPress={handleResetToDefault}
              className="h-8.5 text-xs font-medium rounded-xl border border-warning/40 text-warning hover:bg-warning/10"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              <span>Load Example CV</span>
            </Button>

            <Button
              variant="danger-soft"
              size="sm"
              onPress={handleClearAll}
              className="h-8.5 text-xs font-medium rounded-xl"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              <span>Clear All Data</span>
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};
